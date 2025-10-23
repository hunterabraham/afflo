import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "~/server/db";
import { partners, admins } from "~/server/db/schema";
import { auth } from "~/server/auth";

const setupCompanySchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  domain: z.string().min(1, "Domain is required"),
  shopifySecret: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { companyName, domain, shopifySecret } =
      setupCompanySchema.parse(body);

    // Check if user already has a partner
    const existingAdmin = await db.query.admins.findFirst({
      where: (admins, { eq }) => eq(admins.user_id, session.user.id),
    });

    if (existingAdmin) {
      return NextResponse.json(
        { message: "User already has a company setup" },
        { status: 400 },
      );
    }

    // Create the partner
    const newPartner = await db
      .insert(partners)
      .values({
        name: companyName,
        domain,
        shopify_secret: shopifySecret || "",
      })
      .returning();

    if (!newPartner[0]) {
      throw new Error("Failed to create partner");
    }

    // Create admin relationship
    await db.insert(admins).values({
      user_id: session.user.id,
      partner_id: newPartner[0].id,
    });

    return NextResponse.json(
      {
        message: "Company setup completed successfully",
        partner: {
          id: newPartner[0].id,
          name: newPartner[0].name,
          domain: newPartner[0].domain,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid input", errors: error.errors },
        { status: 400 },
      );
    }

    console.error("Setup company error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// Force Node.js runtime for database operations
export const runtime = "nodejs";
