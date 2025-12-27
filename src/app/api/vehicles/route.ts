import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST /api/vehicles - Add new vehicle to a date
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { workDateId, vehicleNo, tripNo, targetCount } = body;

        if (!workDateId || !vehicleNo) {
            return NextResponse.json(
                { error: "workDateId and vehicleNo are required" },
                { status: 400 }
            );
        }

        // Verify date exists
        const date = await prisma.workDate.findUnique({
            where: { id: workDateId },
        });

        if (!date) {
            return NextResponse.json(
                { error: "Date not found" },
                { status: 404 }
            );
        }

        const vehicle = await prisma.vehicle.create({
            data: {
                vehicleNo: vehicleNo.toUpperCase().trim(),
                tripNo: tripNo?.trim() || null,
                targetCount: targetCount ? parseInt(targetCount, 10) : null,
                workDateId,
            },
        });

        return NextResponse.json(vehicle, { status: 201 });
    } catch (error) {
        console.error("Error creating vehicle:", error);
        return NextResponse.json(
            { error: "Failed to create vehicle" },
            { status: 500 }
        );
    }
}
