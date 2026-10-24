import { NextResponse } from "next/server";
import { PlaceHubStore } from "@/lib/store";
import { ApplicationStage } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get("studentId");
  const driveId = searchParams.get("driveId");
  const stage = searchParams.get("stage");

  let apps = PlaceHubStore.getApplications();

  if (studentId) {
    apps = apps.filter((a) => a.studentId === parseInt(studentId, 10));
  }

  if (driveId) {
    apps = apps.filter((a) => a.driveId === parseInt(driveId, 10));
  }

  if (stage && stage !== "All") {
    apps = apps.filter((a) => a.stage === stage);
  }

  return NextResponse.json(apps);
}

export async function POST(request: Request) {
  try {
    const { studentId, driveId } = await request.json();

    if (!studentId || !driveId) {
      return NextResponse.json(
        { error: "studentId and driveId are required to apply" },
        { status: 400 }
      );
    }

    const result = PlaceHubStore.applyToDrive(
      parseInt(studentId, 10),
      parseInt(driveId, 10)
    );

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 422 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      application: result.application,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to process application" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    // Check for bulk action
    if (body.bulk && Array.isArray(body.appIds)) {
      const { appIds, stage, remarks } = body;
      const count = PlaceHubStore.bulkUpdateApplications(
        appIds,
        stage as ApplicationStage,
        remarks
      );
      return NextResponse.json({
        success: true,
        message: `Successfully updated ${count} applications to '${stage}'!`,
        count,
      });
    }

    const { appId, stage, remarks } = body;
    if (!appId || !stage) {
      return NextResponse.json(
        { error: "appId and stage are required" },
        { status: 400 }
      );
    }

    const updated = PlaceHubStore.updateApplicationStage(
      parseInt(appId, 10),
      stage as ApplicationStage,
      remarks
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Updated status to '${stage}' for ${updated.studentName}`,
      application: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update application status" },
      { status: 500 }
    );
  }
}
