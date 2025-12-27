import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// DELETE /api/packages/[id] - Delete a package
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;

        await prisma.package.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting package:", error);
        return NextResponse.json(
            { error: "Failed to delete package" },
            { status: 500 }
        );
    }
}

// PATCH /api/packages/[id] - Update a package number
export async function PATCH(request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { packageNo } = body;

        if (!packageNo) {
            return NextResponse.json(
                { error: "packageNo is required" },
                { status: 400 }
            );
        }

        const trimmedNo = packageNo.trim();

        // Check for duplicates (excluding this package)
        const existingPackage = await prisma.package.findFirst({
            where: {
                packageNo: trimmedNo,
                NOT: { id },
            },
        });

        const isDuplicate = !!existingPackage;

        const updatedPackage = await prisma.package.update({
            where: { id },
            data: {
                packageNo: trimmedNo,
                isDuplicate,
            },
        });

        return NextResponse.json({
            success: true,
            isDuplicate,
            package: {
                id: updatedPackage.id,
                packageNo: updatedPackage.packageNo,
                isDuplicate: updatedPackage.isDuplicate,
                createdAt: updatedPackage.createdAt.toISOString(),
            },
        });
    } catch (error) {
        console.error("Error updating package:", error);
        return NextResponse.json(
            { error: "Failed to update package" },
            { status: 500 }
        );
    }
}
