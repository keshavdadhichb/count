import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/stats - Fetch statistics (vehicle count, date count, grand total)
export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const vehicleId = url.searchParams.get("vehicleId");
        const dateId = url.searchParams.get("dateId");

        // Get vehicle count (packages in specific vehicle)
        let vehicleCount = 0;
        if (vehicleId) {
            vehicleCount = await prisma.package.count({
                where: { vehicleId },
            });
        }

        // Get date count (packages for specific date)
        let dateCount = 0;
        if (dateId) {
            const date = await prisma.workDate.findUnique({
                where: { id: dateId },
                include: {
                    vehicles: {
                        include: {
                            _count: {
                                select: { packages: true },
                            },
                        },
                    },
                },
            });
            if (date) {
                dateCount = date.vehicles.reduce(
                    (sum, v) => sum + v._count.packages,
                    0
                );
            }
        }

        // Get grand total (all packages ever)
        const grandTotal = await prisma.package.count();

        return NextResponse.json({
            vehicleCount,
            dateCount,
            grandTotal,
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch stats" },
            { status: 500 }
        );
    }
}
