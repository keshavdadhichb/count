const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const date = new Date('2025-12-27T00:00:00.000Z');
    const workDate = await prisma.workDate.findUnique({ where: { date } });

    if (!workDate) { console.log('Date not found!'); return; }
    console.log('Found date:', workDate.id);

    const packages = [
        '1741', '2170', '1742', '2166', '2151', '2187', '2286', '1965',
        '2188', '2152', '1966', '2130', '2164', '2190', '2153', '1950',
        '2189', '1798', '2035', '2163', '2128'
    ];

    console.log('Creating TN59AT0877 - Trip 2 (27th)...');
    const vehicle = await prisma.vehicle.create({
        data: { vehicleNo: 'TN59AT0877', tripNo: '2', workDateId: workDate.id }
    });

    for (const p of packages) {
        await prisma.package.create({ data: { packageNo: p, isDuplicate: false, vehicleId: vehicle.id } });
    }

    console.log('Added', packages.length, 'packages');
    console.log('Done!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
