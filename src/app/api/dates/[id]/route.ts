import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/dates/[id] - Fetch date details with vehicles
export async function GET(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;

        const date = await prisma.workDate.findUnique({
            where: { id },
            include: {
                vehicles: {
                    orderBy: { createdAt: "desc" },
                    include: {
                        _count: {
                            select: { packages: true },
                        },
                    },
                },
            },
        });

        if (!date) {
            return NextResponse.json(
                { error: "Date not found" },
                { status: 404 }
            );
        }

        const formattedDate = {
            id: date.id,
            date: date.date.toISOString(),
            vehicles: date.vehicles.map((v) => ({
                id: v.id,
                vehicleNo: v.vehicleNo,
                tripNo: v.tripNo,
                targetCount: v.targetCount,
                packageCount: v._count.packages,
            })),
        };

        return NextResponse.json(formattedDate);
    } catch (error) {
        console.error("Error fetching date:", error);
        return NextResponse.json(
            { error: "Failed to fetch date" },
            { status: 500 }
        );
    }
}

// DELETE /api/dates/[id] - Delete a date and all related vehicles/packages
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;

        await prisma.workDate.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting date:", error);
        return NextResponse.json(
            { error: "Failed to delete date" },
            { status: 500 }
        );
    }
}
