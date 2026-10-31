import { NextResponse } from "next/server";
import { PlaceHubStore, ensureNeonHydrated } from "@/lib/store";

export async function GET(request: Request) {
  await ensureNeonHydrated();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const tier = searchParams.get("tier");
  const search = searchParams.get("search")?.toLowerCase();

  if (id) {
    const company = PlaceHubStore.getCompanyById(parseInt(id, 10));
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }
    return NextResponse.json(company);
  }

  let companies = PlaceHubStore.getCompanies();

  if (tier && tier !== "All") {
    companies = companies.filter((c) => c.tier === tier);
  }

  if (search) {
    companies = companies.filter(
      (c) =>
        c.companyName.toLowerCase().includes(search) ||
        c.roleTitle.toLowerCase().includes(search) ||
        c.industry.toLowerCase().includes(search) ||
        c.location.toLowerCase().includes(search)
    );
  }

  return NextResponse.json(companies);
}

export async function POST(request: Request) {
  try {
    await ensureNeonHydrated();
    const body = await request.json();

    // Check for bulk CSV import or single creation
    if (Array.isArray(body)) {
      const created = [];
      for (const item of body) {
        if (item.companyName && item.roleTitle) {
          const comp = PlaceHubStore.addCompany({
            companyName: item.companyName,
            industry: item.industry || "Technology",
            tier: item.tier || "Dream",
            roleTitle: item.roleTitle,
            roleType: item.roleType || "Full-Time",
            ctcLpa: parseFloat(item.ctcLpa) || 10.0,
            stipendMonthly: parseFloat(item.stipendMonthly) || 25000,
            location: item.location || "Bengaluru",
            minCgpa: parseFloat(item.minCgpa) || 7.0,
            maxBacklogs: parseInt(item.maxBacklogs, 10) || 0,
            eligibleDepts: Array.isArray(item.eligibleDepts)
              ? item.eligibleDepts
              : ["CSE", "IT"],
            eligibleBatch: item.eligibleBatch || "2027",
            requiredSkills: Array.isArray(item.requiredSkills)
              ? item.requiredSkills
              : ["JavaScript", "SQL"],
            deadline: item.deadline || "2026-12-15",
            driveDate: item.driveDate || "2026-12-20",
            status: item.status || "Upcoming",
            description: item.description || "Campus recruitment drive.",
          });
          created.push(comp);
        }
      }
      return NextResponse.json({
        success: true,
        message: `Successfully imported ${created.length} recruitment drives!`,
        companies: created,
      });
    }

    if (!body.companyName || !body.roleTitle) {
      return NextResponse.json(
        { error: "Company name and role title are required." },
        { status: 400 }
      );
    }

    const newCompany = PlaceHubStore.addCompany({
      companyName: body.companyName,
      industry: body.industry || "Information Technology",
      tier: body.tier || "Dream",
      roleTitle: body.roleTitle,
      roleType: body.roleType || "Full-Time",
      ctcLpa: parseFloat(body.ctcLpa) || 12.0,
      stipendMonthly: parseFloat(body.stipendMonthly) || 30000,
      location: body.location || "Pan-India",
      minCgpa: parseFloat(body.minCgpa) || 7.0,
      maxBacklogs: parseInt(body.maxBacklogs, 10) || 0,
      eligibleDepts: Array.isArray(body.eligibleDepts)
        ? body.eligibleDepts
        : ["CSE", "IT", "ECE"],
      eligibleBatch: body.eligibleBatch || "2027",
      requiredSkills: Array.isArray(body.requiredSkills)
        ? body.requiredSkills
        : typeof body.requiredSkills === "string"
        ? body.requiredSkills.split(",").map((s: string) => s.trim())
        : ["Problem Solving"],
      deadline: body.deadline || "2026-12-01",
      driveDate: body.driveDate || "2026-12-10",
      status: body.status || "Upcoming",
      description: body.description || "Exciting engineering role.",
    });

    return NextResponse.json({
      success: true,
      message: `Recruitment drive for ${newCompany.companyName} created!`,
      company: newCompany,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to create company drive" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await ensureNeonHydrated();
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 });
    }

    const updated = PlaceHubStore.updateCompany(parseInt(id, 10), updates);
    if (!updated) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Updated drive for ${updated.companyName}`,
      company: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update company" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await ensureNeonHydrated();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 });
    }

    const deleted = PlaceHubStore.deleteCompany(parseInt(id, 10));
    if (!deleted) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Company drive and associated applications removed.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to delete company" },
      { status: 500 }
    );
  }
}
