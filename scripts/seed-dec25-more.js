// Script to add more historical data for 25/12/2024
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    // Get the existing date for 25/12/2024
    const date = new Date('2024-12-25T00:00:00.000Z');

    console.log('Finding date entry for 25/12/2024...');

    const workDate = await prisma.workDate.findUnique({
        where: { date },
    });

    if (!workDate) {
        console.error('Date not found! Please run seed-dec25.js first.');
        return;
    }

    console.log('Date found:', workDate.id);

    // TN59AT0877 - Trip 2
    const tn59Trip2 = [
        '546', '478', '1215', '1118', '1120',
        '545', '486', '1204', '1117', '1123',
        '566', '484', '1209', '1205', '1212',
        '717', '480', '809', '786', '1209',
        '547', '485', '475', '653', '803',
        '482', '470', '807', '1214', '798',
        '552', '476', '574', '488',
        '481', '550', '572', '787',
        '560', '559', '799', '788',
        '489', '558', '587', '794',
        '483', '549', '554', '593',
        '562', '553', '594', '1119',
        '191', '557', '551', '1122',
        '555', '473', '564', '595',
        '474', '556', '789', '1121',
        '472', '586', '790', '1124',
        '477', '1206', '808', '1210',
        '548', '563', '1208', '797',
        '487', '796', '806', '1211',
        '561', '886', '795', '800'
    ];

    // TN39EZ2867 - Trip 1
    const tn39ez = [
        '1246', '1103', '670', '884',
        '1251', '1243', '1176', '1078',
        '1247', '1241', '678', '912',
        '1245', '1252', '892', '1083',
        '1185', '1079', '1184', '1182',
        '1186', '1192', '686', '1081',
        '1248', '104', '999', '107',
        '1250', '1141', '1194', '672',
        '95', '1101', '92', '1086',
        '1179', '1240', '1239', '93',
        '1249', '1191', '669', '1140',
        '1104', '1173', '671', '1080',
        '1139', '1181', '685', '1177',
        '1244', '1076', '680', '679',
        '1105', '1174', '715', '838',
        '1090', '1075', '1074', '1180',
        '911', '1189', '91', '684',
        '1178', '1187', '898', '681',
        '94', '1183', '1073', '688',
        '1242', '837', '1188', '682',
        '683', '674', '677', '713',
        '1102', '1097', '903', '835',
        '880', '1064', '881', '1100',
        '1098', '891', '695', '1096',
        '693', '1057', '714', '936',
        '712', '895', '692', '1099',
        '689', '897', '565', '893',
        '673', '675', '894', '667',
        '691', '694'
    ];

    // TN33BE1803 - Trip 2
    const tn33Trip2 = [
        '338', '426', '449', '1213',
        '334', '427', '437', '567',
        '317', '430', '447', '456',
        '339', '459', '460', '544',
        '432', '445', '528', '565',
        '329', '428', '1261', '570',
        '332', '524', '569', '440',
        '320', '601', '457', '450',
        '1354', '568', '492', '458',
        '429', '442', '441', '523',
        '433', '461', '448', '609',
        '308', '340', '455', '611',
        '331', '436', '1260', '582',
        '316', '718', '438', '603',
        '190', '446', '444', '571',
        '335', '434', '439', '581',
        '337', '719', '1262', '538',
        '453', '543', '1259', '539',
        '307', '435', '542', '600',
        '333', '537', '541', '530', '540'
    ];

    // TN59AT0877 - Trip 3
    const tn59Trip3 = [
        '1374', '1376', '1301',
        '1373', '1293', '1274',
        '1276', '1389', '1273',
        '1353', '1279', '1300',
        '1365', '1298', '1316',
        '1366', '1295', '1304',
        '1265', '1297', '1309',
        '1224', '1072', '1301',
        '1364', '1161', '1294',
        '1358', '1266', '1305',
        '1379', '1296', '1303',
        '1333', '1256', '1314',
        '1377', '1268', '1116',
        '1375', '1302', '1115',
        '1193', '1257', '1322',
        '1332', '1255', '1324',
        '826', '1312', '1321',
        '1360', '1330', '1328',
        '1263', '1310', '1271',
        '1306', '1331', '1327',
        '1308', '1325', '1313', '1269',
        '1315', '1217', '1317', '1222',
        '1329', '1272', '1113', '1223',
        '1318', '1221', '1110', '1111',
        '1326', '1320', '1219', '1323',
        '1220', '1270', '1112', '1114',
        '1218', '1319'
    ];

    // Create TN59AT0877 - Trip 2
    console.log('Creating TN59AT0877 - Trip 2...');
    const v1 = await prisma.vehicle.create({
        data: {
            vehicleNo: 'TN59AT0877',
            tripNo: '2',
            workDateId: workDate.id,
        },
    });
    for (const packageNo of tn59Trip2) {
        await prisma.package.create({
            data: { packageNo, isDuplicate: false, vehicleId: v1.id },
        });
    }
    console.log(`Added ${tn59Trip2.length} packages`);

    // Create TN39EZ2867 - Trip 1
    console.log('Creating TN39EZ2867 - Trip 1...');
    const v2 = await prisma.vehicle.create({
        data: {
            vehicleNo: 'TN39EZ2867',
            tripNo: '1',
            workDateId: workDate.id,
        },
    });
    for (const packageNo of tn39ez) {
        await prisma.package.create({
            data: { packageNo, isDuplicate: false, vehicleId: v2.id },
        });
    }
    console.log(`Added ${tn39ez.length} packages`);

    // Create TN33BE1803 - Trip 2
    console.log('Creating TN33BE1803 - Trip 2...');
    const v3 = await prisma.vehicle.create({
        data: {
            vehicleNo: 'TN33BE1803',
            tripNo: '2',
            workDateId: workDate.id,
        },
    });
    for (const packageNo of tn33Trip2) {
        await prisma.package.create({
            data: { packageNo, isDuplicate: false, vehicleId: v3.id },
        });
    }
    console.log(`Added ${tn33Trip2.length} packages`);

    // Create TN59AT0877 - Trip 3
    console.log('Creating TN59AT0877 - Trip 3...');
    const v4 = await prisma.vehicle.create({
        data: {
            vehicleNo: 'TN59AT0877',
            tripNo: '3',
            workDateId: workDate.id,
        },
    });
    for (const packageNo of tn59Trip3) {
        await prisma.package.create({
            data: { packageNo, isDuplicate: false, vehicleId: v4.id },
        });
    }
    console.log(`Added ${tn59Trip3.length} packages`);

    const total = tn59Trip2.length + tn39ez.length + tn33Trip2.length + tn59Trip3.length;
    console.log('\n✅ All data added successfully!');
    console.log('Summary:');
    console.log('- TN59AT0877 Trip 2:', tn59Trip2.length, 'packages');
    console.log('- TN39EZ2867 Trip 1:', tn39ez.length, 'packages');
    console.log('- TN33BE1803 Trip 2:', tn33Trip2.length, 'packages');
    console.log('- TN59AT0877 Trip 3:', tn59Trip3.length, 'packages');
    console.log('- Total added:', total, 'packages');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
