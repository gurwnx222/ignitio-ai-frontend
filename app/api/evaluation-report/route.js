/**
 * Evaluation Report API Route
 *
 * GET /api/evaluation-report?session_id=...
 *   Fetches the evaluation report from the backend tutor API.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return Response.json({ error: "session_id is required" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/tutor/test/report?session_id=${sessionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return Response.json(
        { error: errorData.detail || "Failed to fetch evaluation report" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Evaluation report fetch error:", error);
    return Response.json({ error: "Failed to connect to evaluation service" }, { status: 500 });
  }
}