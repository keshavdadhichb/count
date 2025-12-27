// Script to fix dates from 2024 to 2025 and merge Today with 27 Dec
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Fetching all dates...');

    const allDates = await prisma.workDate.findMany({
        include: { vehicles: { include: { packages: true } } }
    });

    console.log('Found', allDates.length, 'dates:');
    allDates.forEach(d => console.log('-', d.date.toISOString(), '| ID:', d.id));

    // Find the "Today" entry (27 Dec 2024 created during testing)
    const today2024 = allDates.find(d => d.date.toISOString().startsWith('2024-12-27'));

    // Find any duplicate dates for the same day
    const dateMap = new Map();

    for (const dateEntry of allDates) {
        const dateStr = dateEntry.date.toISOString().split('T')[0];
        if (!dateMap.has(dateStr)) {
            dateMap.set(dateStr, []);
        }
        dateMap.get(dateStr).push(dateEntry);
    }

    // Update each date to 2025
    console.log('\nUpdating dates to 2025...');

    for (const dateEntry of allDates) {
        const oldDate = dateEntry.date;
        const newDate = new Date(oldDate);
        newDate.setFullYear(2025);

        console.log(`Updating ${oldDate.toISOString()} -> ${newDate.toISOString()}`);

        try {
            await prisma.workDate.update({
                where: { id: dateEntry.id },
                data: { date: newDate }
            });
        } catch (e) {
            // If there's a conflict (duplicate date), we need to merge
            console.log('Conflict detected, merging...');

            // Find the existing 2025 date
            const existingDate = await prisma.workDate.findUnique({
                where: { date: newDate }
            });

            if (existingDate && existingDate.id !== dateEntry.id) {
                // Move all vehicles from this date to the existing one
                console.log(`Moving vehicles from ${dateEntry.id} to ${existingDate.id}`);

                await prisma.vehicle.updateMany({
                    where: { workDateId: dateEntry.id },
                    data: { workDateId: existingDate.id }
                });

                // Delete the old date entry
                await prisma.workDate.delete({
                    where: { id: dateEntry.id }
                });

                console.log('Merged successfully');
            }
        }
    }

    // Final check
    console.log('\nFinal dates in database:');
    const finalDates = await prisma.workDate.findMany({
        include: {
            vehicles: {
                include: {
                    _count: { select: { packages: true } }
                }
            }
        },
        orderBy: { date: 'desc' }
    });

    for (const d of finalDates) {
        const totalPackages = d.vehicles.reduce((sum, v) => sum + v._count.packages, 0);
        console.log(`- ${d.date.toISOString().split('T')[0]} | ${d.vehicles.length} vehicles | ${totalPackages} packages`);
    }

    console.log('\n✅ All dates updated to 2025!');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
