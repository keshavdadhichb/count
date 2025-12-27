import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST /api/packages - Add package with duplicate check (all-time history)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { vehicleId, packageNo } = body;

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

        // Check for duplicates across ALL packages in the database (all-time history)
        const existingPackage = await prisma.package.findFirst({
            where: { packageNo: trimmedNo },
        });

        const isDuplicate = !!existingPackage;

        // Create the package regardless of duplicate status (as per requirement)
        const newPackage = await prisma.package.create({
            data: {
                packageNo: trimmedNo,
                isDuplicate,
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
