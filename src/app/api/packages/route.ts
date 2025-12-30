import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST /api/packages - Add package with duplicate check (all-time history)
// ADAS and LOOSE packages are tracked separately and don't count as duplicates with regular packages
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { vehicleId, packageNo, isADAS = false, isLoose = false } = body;

        if (!vehicleId || !packageNo) {
            return NextResponse.json(
                { error: "vehicleId and packageNo are required" },
                { status: 400 }
            );
        }

        const trimmedNo = packageNo.trim();

        // Verify vehicle exists
        const vehicle = await prisma.vehicle.findUnique({
            where: { id: vehicleId },
        });

        if (!vehicle) {
            return NextResponse.json(
                { error: "Vehicle not found" },
                { status: 404 }
            );
        }

        // Check for duplicates - only check within the SAME category
        // Regular packages only check against other regular packages
        // ADAS packages only check against other ADAS packages
        // LOOSE packages only check against other LOOSE packages
        const existingPackage = await prisma.package.findFirst({
            where: {
                packageNo: trimmedNo,
                isADAS: isADAS,
                isLoose: isLoose,
            },
        });

        const isDuplicate = !!existingPackage;

        // Create the package regardless of duplicate status (as per requirement)
        const newPackage = await prisma.package.create({
            data: {
                packageNo: trimmedNo,
                isDuplicate,
                isADAS,
                isLoose,
                vehicleId,
            },
        });

        return NextResponse.json(
            {
                success: true,
                isDuplicate,
                package: {
                    id: newPackage.id,
                    packageNo: newPackage.packageNo,
                    isDuplicate: newPackage.isDuplicate,
                    isADAS: newPackage.isADAS,
                    isLoose: newPackage.isLoose,
                    createdAt: newPackage.createdAt.toISOString(),
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating package:", error);
        return NextResponse.json(
            { error: "Failed to create package" },
            { status: 500 }
        );
    }
}
