import { NextResponse } from "next/server";
import { PlaceHubStore } from "@/lib/store";

export async function GET(request: Request) {
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
              : ["Java", "SQL"],
            deadline: item.deadline || "2026-12-30",
            driveDate: item.driveDate || "2027-01-10",
            status: item.status || "Upcoming",
            description: item.description || "Recruitment drive via Placement System.",
          });
          created.push(comp);
        }
      }
      return NextResponse.json({
        success: true,
        message: `Imported ${created.length} company recruitment drives successfully!`,
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
      industry: body.industry || "Technology",
      tier: body.tier || "Dream",
      roleTitle: body.roleTitle,
      roleType: body.roleType || "Full-Time",
      ctcLpa: parseFloat(body.ctcLpa) || 10.0,
      stipendMonthly: parseFloat(body.stipendMonthly) || 25000,
      location: body.location || "Bengaluru",
      minCgpa: parseFloat(body.minCgpa) || 7.0,
      maxBacklogs: parseInt(body.maxBacklogs, 10) || 0,
      eligibleDepts: body.eligibleDepts || ["CSE", "IT", "ECE"],
      eligibleBatch: body.eligibleBatch || "2027",
      requiredSkills: body.requiredSkills || ["Problem Solving", "Core CS"],
      deadline: body.deadline || "2026-12-30",
      driveDate: body.driveDate || "2027-01-15",
      status: body.status || "Upcoming",
      description: body.description || "Campus recruitment drive.",
    });

    return NextResponse.json({
      success: true,
      message: `Created recruitment drive for ${newCompany.companyName}`,
      company: newCompany,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to create company" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
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
