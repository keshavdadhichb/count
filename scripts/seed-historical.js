// Script to add historical data
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    // Create date for 24/12/2024
    const date = new Date('2024-12-24T00:00:00.000Z');

    console.log('Creating date entry for 24/12/2024...');

    const workDate = await prisma.workDate.upsert({
        where: { date },
        update: {},
        create: { date },
    });

    console.log('Date created:', workDate.id);

    // Vehicle 1: TN39CV3261 - Trip 1
    const trip1Packages = [
        '6', '22', '05', '03', '01', '103', '99', '98', '02', '13',
        '16', '20', '18', '15', '07', '11', '21', '10', '08', '09',
        '04', '25', '24', '19', '23', '12', '14', '17'
    ];

    // Vehicle 1: TN39CV3261 - Trip 2
    const trip2Packages = [
        '85', '79', '90', '83', '80', '27', '89', '28', '35', '60',
        '34', '82', '38', '58', '31', '54', '81', '61', '78', '57',
        '84', '62', '49', '59', '52', '30', '39', '67', '47', '64',
        '26', '86', '72', '65', '48', '66', '53', '87', '50', '63',
        '32', '77', '88'
    ];

    // Vehicle 2: TN39DA7698 - Trip 1
    const vehicle2Packages = [
        '726', '705', '725', '703', '728', '654', '727', '33', '782', '69',
        '781', '71', '76', '73', '791', '75', '783', '74', '710', '40',
        '687', '46', '706', '56', '707', '29', '690', '41', '68', '70',
        '708', '45', '785', '44', '711', '43', '704', '55', '36', '709'
    ];

    // Create Vehicle 1 - Trip 1
    console.log('Creating TN39CV3261 - Trip 1...');
    const vehicle1Trip1 = await prisma.vehicle.create({
        data: {
            vehicleNo: 'TN39CV3261',
            tripNo: '1',
            workDateId: workDate.id,
        },
    });

    // Add packages for Trip 1
    for (const packageNo of trip1Packages) {
        await prisma.package.create({
            data: {
                packageNo,
                isDuplicate: false,
                vehicleId: vehicle1Trip1.id,
            },
        });
    }
    console.log(`Added ${trip1Packages.length} packages to Trip 1`);

    // Create Vehicle 1 - Trip 2
    console.log('Creating TN39CV3261 - Trip 2...');
    const vehicle1Trip2 = await prisma.vehicle.create({
        data: {
            vehicleNo: 'TN39CV3261',
            tripNo: '2',
            workDateId: workDate.id,
        },
    });

    // Add packages for Trip 2
    for (const packageNo of trip2Packages) {
        await prisma.package.create({
            data: {
                packageNo,
                isDuplicate: false,
                vehicleId: vehicle1Trip2.id,
            },
        });
    }
    console.log(`Added ${trip2Packages.length} packages to Trip 2`);

    // Create Vehicle 2 - Trip 1
    console.log('Creating TN39DA7698 - Trip 1...');
    const vehicle2Trip1 = await prisma.vehicle.create({
        data: {
            vehicleNo: 'TN39DA7698',
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
                vehicleId: vehicle2Trip1.id,
            },
        });
    }
    console.log(`Added ${vehicle2Packages.length} packages to TN39DA7698`);

    console.log('\n✅ All data added successfully!');
    console.log('Summary:');
    console.log('- Date: 24/12/2024');
    console.log('- TN39CV3261 Trip 1:', trip1Packages.length, 'packages');
    console.log('- TN39CV3261 Trip 2:', trip2Packages.length, 'packages');
    console.log('- TN39DA7698 Trip 1:', vehicle2Packages.length, 'packages');
    console.log('- Total:', trip1Packages.length + trip2Packages.length + vehicle2Packages.length, 'packages');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
