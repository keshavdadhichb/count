// Script to add historical data for 26/12/2024 and 27/12/2024
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    // ===== 26/12/2024 =====
    const date26 = new Date('2024-12-26T00:00:00.000Z');
    console.log('Creating date entry for 26/12/2024...');
    const workDate26 = await prisma.workDate.upsert({
        where: { date: date26 },
        update: {},
        create: { date: date26 },
    });
    console.log('Date created:', workDate26.id);

    // TN59AT0877 - Trip 1 (26th)
    const tn59_26_t1 = [
        '138', '223', '1498', '1493', '1505', '421', '114', '1492',
        '117', '330', '1507', '1480', '118', '129', '140', '1501',
        '127', '328', '1524', '1512', '1491', '128', '1511', '1509',
        '134', '422', '115', '1504', '119', '311', '431', '1488',
        '1571', '312', '1506', '1526', '313', '1522', '1476', '1540',
        '1570', '336', '1482', '1525', '133', '1523', '1478', '1477',
        '120', '513', '573', '1473', '1587', '1485', '196', '1472',
        '113', '141', '1500', '1527', '318', '147', '1481', '1502',
        '314', '142', '1539', '1486', '315', '116', '1499', '1503',
        '1484', '121', '1490', '1474', '424', '139', '1541', '1475',
        '23', '1483', '1489', '1479'
    ];

    // TN22BV4248 - Trip 1 (26th)
    const tn22_26_t1 = [
        '1586', '1583', '1426', '1428', '1466', '1585', '1444', '1550', '1423',
        '1531', '1581', '1443', '1543', '1518', '1576', '1530', '1436',
        '840', '1563', '1548', '1427', '1536', '1420', '1549', '1437',
        '1575', '1560', '1433', '1439', '1521', '1442', '1435', '1432',
        '1574', '1582', '1557', '1546', '1577', '1558', '1542', '1516',
        '1578', '1556', '1547', '1463', '1430', '1562', '1434', '1538',
        '859', '1424', '1440', '1470', '1584', '1555', '664', '1465',
        '1429', '1258', '1441', '1515', '1422', '867', '1447', '1545',
        '1445', '1552', '1467', '1494', '1446', '1421', '1438', '1497',
        '1579', '1553', '1519', '1495', '1580', '1551', '1425', '1496',
        '1561', '1554', '1544', '1464'
    ];

    // TN59AT0877 - Trip 2 (26th)
    const tn59_26_t2 = [
        '854', '858', '135', '131', '863', '864', '110', '123',
        '829', '862', '1603', '1599', '852', '107', '1573', '124',
        '857', '108', '1566', '1568', '860', '846', '1621', '137',
        '856', '1535', '1589', '1508', '850', '1517', '1596', '327',
        '792', '1537', '111', '1601', '853', '855', '136', '1600',
        '1534', '1569', '130', '1600', '865', '1487', '122', '109',
        '1533', '106', '192', '1597', '1602', '1528', '1609', '112',
        '1604', '1667', '1567', '1598', '1451', '129', '321', '310',
        '866', '1620', '105', '1593', '848', '1615', '1510', '1595',
        '720', '1618', '1572', '1591', '1520', '1588', '125', '1565',
        '1532', '126', '132', '1594'
    ];

    // TN22BV4248 - Trip 2 (26th)
    const tn22_26_t2 = [
        '1468', '1090', '1629', '1652', '1645', '1736', '1678', '1649', '1647',
        '793', '1407', '1635', '1657', '1234', '1642', '1650', '1070',
        '1089', '1391', '1634', '1450', '1448', '1378', '1654', '1408',
        '1230', '861', '1674', '1390', '1384', '849', '1605', '1159',
        '836', '1267', '1643', '1644', '1640', '1627', '1636', '1387',
        '1454', '1381', '1637', '1143', '722', '1404', '1675', '1372',
        '830', '845', '1677', '1385', '1632', '158', '1641', '1386',
        '721', '847', '1413', '1383', '1631', '1633', '1651', '1452',
        '1630', '638', '1646', '1380', '1639', '1655', '1656', '1382',
        '701', '1648', '1361', '1418', '1676', '1526', '1419', '1449',
        '1638', '1628', '1388', '1405'
    ];

    // TN59AT0877 - Trip 3 (26th)
    const tn59_26_t3 = [
        '1453', '1791', '1720', '1706', '1710', '1774', '1744', '1776',
        '1775', '1799', '1777', '1802', '1735', '1793', '1784', '1782',
        '1779', '1734', '1732', '1730', '1733', '1800', '1708', '1727', '1670',
        '1711', '1694', '1718', '1714', '1689', '1700', '1780', '1610', '1686',
        '1616', '1665', '1661', '1803', '1698', '1623', '1721', '1724', '1619',
        '1804', '1607', '1624', '1712', '1625', '1622', '1713', '1691', '1617',
        '1722', '1695', '1668', '1725', '1671', '1684', '1716', '1606', '1705',
        '1699', '1608', '1704', '1703', '1669', '1663', '1719', '1673', '1664',
        '1688', '1666', '1715', '1929', '1672', '1708', '1612', '1611'
    ];

    // Add 26th data
    console.log('Creating TN59AT0877 - Trip 1 (26th)...');
    const v1 = await prisma.vehicle.create({ data: { vehicleNo: 'TN59AT0877', tripNo: '1', workDateId: workDate26.id } });
    for (const p of tn59_26_t1) await prisma.package.create({ data: { packageNo: p, isDuplicate: false, vehicleId: v1.id } });
    console.log(`Added ${tn59_26_t1.length} packages`);

    console.log('Creating TN22BV4248 - Trip 1 (26th)...');
    const v2 = await prisma.vehicle.create({ data: { vehicleNo: 'TN22BV4248', tripNo: '1', workDateId: workDate26.id } });
    for (const p of tn22_26_t1) await prisma.package.create({ data: { packageNo: p, isDuplicate: false, vehicleId: v2.id } });
    console.log(`Added ${tn22_26_t1.length} packages`);

    console.log('Creating TN59AT0877 - Trip 2 (26th)...');
    const v3 = await prisma.vehicle.create({ data: { vehicleNo: 'TN59AT0877', tripNo: '2', workDateId: workDate26.id } });
    for (const p of tn59_26_t2) await prisma.package.create({ data: { packageNo: p, isDuplicate: false, vehicleId: v3.id } });
    console.log(`Added ${tn59_26_t2.length} packages`);

    console.log('Creating TN22BV4248 - Trip 2 (26th)...');
    const v4 = await prisma.vehicle.create({ data: { vehicleNo: 'TN22BV4248', tripNo: '2', workDateId: workDate26.id } });
    for (const p of tn22_26_t2) await prisma.package.create({ data: { packageNo: p, isDuplicate: false, vehicleId: v4.id } });
    console.log(`Added ${tn22_26_t2.length} packages`);

    console.log('Creating TN59AT0877 - Trip 3 (26th)...');
    const v5 = await prisma.vehicle.create({ data: { vehicleNo: 'TN59AT0877', tripNo: '3', workDateId: workDate26.id } });
    for (const p of tn59_26_t3) await prisma.package.create({ data: { packageNo: p, isDuplicate: false, vehicleId: v5.id } });
    console.log(`Added ${tn59_26_t3.length} packages`);

    // ===== 27/12/2024 =====
    const date27 = new Date('2024-12-27T00:00:00.000Z');
    console.log('\nCreating date entry for 27/12/2024...');
    const workDate27 = await prisma.workDate.upsert({
        where: { date: date27 },
        update: {},
        create: { date: date27 },
    });
    console.log('Date created:', workDate27.id);

    // TN59AT0877 - Trip 1 (27th)
    const tn59_27_t1 = [
        '1745', '1915', '1910', '1837', '1808', '1702', '1921', '1864',
        '1840', '1749', '1731', '1924', '1916', '1687', '1728', '1865',
        '1919', '1692', '1851', '1785', '1936', '1743', '1844', '1862',
        '1927', '1842', '1850', '1926', '1906', '1773', '1867', '1918',
        '1859', '1740', '1846', '1853', '1693', '1738', '1690', '1855',
        '1852', '1739', '1866', '1858', '1737', '1928', '1697', '1792',
        '1930', '1958', '1854', '1912', '1843', '1956', '1848', '1747',
        '1839', '1929', '1847', '1911', '1930', '1729', '1917', '1860',
        '1717', '1922', '1845', '1849', '1746', '1905', '1868', '1914',
        '1841', '1903', '1863', '1856', '1685', '1923', '1925', '1723',
        '1726', '1920', '1857', '1709', '1913', '1861'
    ];

    // TN22BD0957 - Trip 1 (27th)
    const tn22_27_t1 = [
        '1861', '1359', '1909', '1231', '1163', '1108', '1164', '1409',
        '885', '1367', '1165', '1200', '1084', '1390', '1807', '1195',
        '2044', '1092', '910', '1196', '1168', '1171', '1109', '1175',
        '1813', '1875', '1107', '1201', '918', '1940', '1338', '1167',
        '1809', '1953', '1106', '1235', '1237', '1401', '1160', '1199',
        '1172', '1395', '1951', '1233', '1238', '1341', '909', '1197',
        '1997', '1812', '1339', '1229', '1998', '1934', '1166', '1335',
        '1810', '1169', '1337', '1216', '1236', '1832', '1226', '1203',
        '1814', '1889', '1225', '1410', '1228', '1340', '1227', '1198',
        '1091', '1087', '1162', '1085', '1334', '1907', '1952', '1368',
        '1202', '1336', '1082', '1806', '1088', '1805'
    ];

    console.log('Creating TN59AT0877 - Trip 1 (27th)...');
    const v6 = await prisma.vehicle.create({ data: { vehicleNo: 'TN59AT0877', tripNo: '1', workDateId: workDate27.id } });
    for (const p of tn59_27_t1) await prisma.package.create({ data: { packageNo: p, isDuplicate: false, vehicleId: v6.id } });
    console.log(`Added ${tn59_27_t1.length} packages`);

    console.log('Creating TN22BD0957 - Trip 1 (27th)...');
    const v7 = await prisma.vehicle.create({ data: { vehicleNo: 'TN22BD0957', tripNo: '1', workDateId: workDate27.id } });
    for (const p of tn22_27_t1) await prisma.package.create({ data: { packageNo: p, isDuplicate: false, vehicleId: v7.id } });
    console.log(`Added ${tn22_27_t1.length} packages`);

    const total26 = tn59_26_t1.length + tn22_26_t1.length + tn59_26_t2.length + tn22_26_t2.length + tn59_26_t3.length;
    const total27 = tn59_27_t1.length + tn22_27_t1.length;

    console.log('\n✅ All data added successfully!');
    console.log('Summary for 26/12/2024:', total26, 'packages');
    console.log('Summary for 27/12/2024:', total27, 'packages');
    console.log('Grand total:', total26 + total27, 'packages');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
