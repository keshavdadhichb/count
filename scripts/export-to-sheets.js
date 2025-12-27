// Script to export database to CSV format for Google Sheets
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
    console.log('Fetching all data from database...\n');

    const dates = await prisma.workDate.findMany({
        include: {
            vehicles: {
                include: {
                    packages: {
                        orderBy: { createdAt: 'asc' }
                    }
                },
                orderBy: { createdAt: 'asc' }
            }
        },
        orderBy: { date: 'asc' }
    });

    // Create CSV content
    const rows = [];
    rows.push(['Date', 'Vehicle No', 'Trip No', 'Package No', 'Is Duplicate', 'Created At']);

    for (const dateEntry of dates) {
        const dateStr = dateEntry.date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        for (const vehicle of dateEntry.vehicles) {
            for (const pkg of vehicle.packages) {
                rows.push([
                    dateStr,
                    vehicle.vehicleNo,
                    vehicle.tripNo || '',
                    pkg.packageNo,
                    pkg.isDuplicate ? 'Yes' : 'No',
                    pkg.createdAt.toISOString()
                ]);
            }
        }
    }

    // Write CSV file
    const csvContent = rows.map(row => row.join('\t')).join('\n');
    fs.writeFileSync('export.tsv', csvContent);

    console.log('Export complete!');
    console.log('File saved: export.tsv');
    console.log(`Total rows: ${rows.length - 1} packages\n`);

    // Also print summary
    console.log('=== Summary ===');
    for (const dateEntry of dates) {
        const dateStr = dateEntry.date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        const totalPackages = dateEntry.vehicles.reduce((sum, v) => sum + v.packages.length, 0);
        console.log(`${dateStr}: ${dateEntry.vehicles.length} vehicles, ${totalPackages} packages`);
    }

    console.log('\n📋 To import into Google Sheets:');
    console.log('1. Open export.tsv file');
    console.log('2. Select all (Cmd+A)');
    console.log('3. Copy (Cmd+C)');
    console.log('4. Paste into Google Sheets cell A1 (Cmd+V)');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
