// Script to add historical data for 25/12/2024
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    // Create date for 25/12/2024
    const date = new Date('2024-12-25T00:00:00.000Z');

    console.log('Creating date entry for 25/12/2024...');

    const workDate = await prisma.workDate.upsert({
        where: { date },
        update: {},
        create: { date },
    });

    console.log('Date created:', workDate.id);

    // Vehicle 1: TN59AT0877 - Trip 1
    const vehicle1Packages = [
        '949', '1061', '898', '913', '934',
        '1007', '1054', '1077', '922', '940',
        '1093', '1059', '924', '901', '887',
        '1049', '1051', '169', '176', '942',
        '947', '1052', '536', '186', '100',
        '1058', '941', '506', '925',
        '926', '156', '499', '929',
        '1008', '1004', '945', '937',
        '1094', '504', '165', '928',
        '1060', '175', '164', '930',
        '948', '502', '902', '932',
        '1095', '97', '525', '938',
        '1062', '899', '96', '933',
        '1056', '1053', '167', '935',
        '900', '927', '503', '908',
        '1005', '1055', '179', '101',
        '943', '946', '178', '931',
        '916', '923', '185', '896',
        '1065', '944', '939', '888',
        '920', '1050', '102', '921'
    ];

    // Vehicle 2: TN33BE1803 - Trip 1
    const vehicle2Packages = [
        '535', '529', '700', '171',
        '802', '532', '596', '617',
        '620', '804', '521', '166',
        '618', '606', '588', '153',
        '608', '517', '519', '619',
        '604', '614', '534', '177',
        '585', '575', '716', '154',
        '801', '616', '505', '577',
        '531', '699', '183', '173',
        '584', '698', '500', '576',
        '599', '613', '159', '152',
        '583', '621', '160', '622',
        '607', '598', '516', '155',
        '615', '589', '182', '501',
        '597', '580', '168', '578',
        '527', '612', '184', '157',
        '602', '533', '495', '496',
        '610', '592', '174', '158',
        '805', '590', '181', '579',
        '605', '591', '172', '518',
        '162', '497', '161', '170', '180'
    ];

    // Create Vehicle 1 - Trip 1
    console.log('Creating TN59AT0877 - Trip 1...');
    const vehicle1 = await prisma.vehicle.create({
        data: {
            vehicleNo: 'TN59AT0877',
            tripNo: '1',
            workDateId: workDate.id,
        },
    });

    // Add packages for Vehicle 1
    for (const packageNo of vehicle1Packages) {
        await prisma.package.create({
            data: {
                packageNo,
                isDuplicate: false,
                vehicleId: vehicle1.id,
            },
        });
    }
    console.log(`Added ${vehicle1Packages.length} packages to TN59AT0877`);

    // Create Vehicle 2 - Trip 1
    console.log('Creating TN33BE1803 - Trip 1...');
    const vehicle2 = await prisma.vehicle.create({
        data: {
            vehicleNo: 'TN33BE1803',
            tripNo: '1',
            workDateId: workDate.id,
        },
    });

    // Add packages for Vehicle 2
    for (const packageNo of vehicle2Packages) {
        await prisma.package.create({
            data: {
                packageNo,
                isDuplicate: false,
                vehicleId: vehicle2.id,
            },
        });
    }
    console.log(`Added ${vehicle2Packages.length} packages to TN33BE1803`);

    console.log('\n✅ All data added successfully!');
    console.log('Summary:');
    console.log('- Date: 25/12/2024');
    console.log('- TN59AT0877 Trip 1:', vehicle1Packages.length, 'packages');
    console.log('- TN33BE1803 Trip 1:', vehicle2Packages.length, 'packages');
    console.log('- Total:', vehicle1Packages.length + vehicle2Packages.length, 'packages');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
