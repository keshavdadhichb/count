import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/vehicles/[id] - Fetch vehicle details with packages
export async function GET(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;

        const vehicle = await prisma.vehicle.findUnique({
            where: { id },
            include: {
                packages: {
                    orderBy: { createdAt: "desc" },
                },
                workDate: true,
            },
        });

        if (!vehicle) {
            return NextResponse.json(
                { error: "Vehicle not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            id: vehicle.id,
            vehicleNo: vehicle.vehicleNo,
            tripNo: vehicle.tripNo,
            targetCount: vehicle.targetCount,
            workDateId: vehicle.workDateId,
            date: vehicle.workDate.date.toISOString(),
            packages: vehicle.packages.map((p) => ({
                id: p.id,
                packageNo: p.packageNo,
                isDuplicate: p.isDuplicate,
                isADAS: p.isADAS,
                isLoose: p.isLoose,
                createdAt: p.createdAt.toISOString(),
            })),
        });
    } catch (error) {
        console.error("Error fetching vehicle:", error);
        return NextResponse.json(
            { error: "Failed to fetch vehicle" },
            { status: 500 }
        );
    }
}

// PATCH /api/vehicles/[id] - Update vehicle details
export async function PATCH(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { vehicleNo, tripNo } = body;

        // Build update data
        const updateData: { vehicleNo?: string; tripNo?: string | null } = {};

        if (vehicleNo !== undefined) {
            updateData.vehicleNo = vehicleNo.trim().toUpperCase();
        }
        if (tripNo !== undefined) {
            updateData.tripNo = tripNo ? tripNo.trim() : null;
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { error: "No fields to update" },
                { status: 400 }
            );
        }

        const vehicle = await prisma.vehicle.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({
            success: true,
            vehicle: {
                id: vehicle.id,
                vehicleNo: vehicle.vehicleNo,
                tripNo: vehicle.tripNo,
            },
        });
    } catch (error) {
        console.error("Error updating vehicle:", error);
        return NextResponse.json(
            { error: "Failed to update vehicle" },
            { status: 500 }
        );
    }
}

// DELETE /api/vehicles/[id] - Delete a vehicle and all related packages
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;

        await prisma.vehicle.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting vehicle:", error);
        return NextResponse.json(
            { error: "Failed to delete vehicle" },
            { status: 500 }
        );
    }
}

