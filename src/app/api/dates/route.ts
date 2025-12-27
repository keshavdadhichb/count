import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/dates - Fetch all dates with summaries
export async function GET() {
    try {
        const dates = await prisma.workDate.findMany({
            orderBy: { date: "desc" },
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

        const formattedDates = dates.map((d) => ({
            id: d.id,
            date: d.date.toISOString(),
            vehicleCount: d.vehicles.length,
            packageCount: d.vehicles.reduce(
                (sum, v) => sum + v._count.packages,
                0
            ),
        }));

        return NextResponse.json(formattedDates);
    } catch (error) {
        console.error("Error fetching dates:", error);
        return NextResponse.json(
            { error: "Failed to fetch dates" },
            { status: 500 }
        );
    }
}

// POST /api/dates - Create new date entry
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const date = body.date ? new Date(body.date) : new Date();

        // Normalize to start of day (UTC)
        const normalizedDate = new Date(
            Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
        );

        // Check if date already exists
        const existing = await prisma.workDate.findUnique({
            where: { date: normalizedDate },
        });

        if (existing) {
            return NextResponse.json(existing);
        }

        const newDate = await prisma.workDate.create({
            data: { date: normalizedDate },
        });

        return NextResponse.json(newDate, { status: 201 });
    } catch (error) {
        console.error("Error creating date:", error);
        return NextResponse.json(
            { error: "Failed to create date" },
            { status: 500 }
        );
    }
}
