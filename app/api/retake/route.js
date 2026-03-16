/**
 * Retake API Route
 *
 * POST /api/retake
 *   Body: { session_id }
 *   Triggers simpler explanations from the backend and returns updated content.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function POST(request) {
  try {
    const body = await request.json();
    const { session_id } = body;

    if (!session_id) {
      return Response.json({ error: "session_id is required" }, { status: 400 });
    }

    // Call backend to trigger simpler explanations
    const response = await fetch(
      `${API_BASE_URL}/api/v1/tutor/retake?session_id=${session_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return Response.json(
        { error: errorData.detail || "Failed to prepare simpler explanations" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Retake error:", error);
    return Response.json({ error: "Failed to connect to retake service" }, { status: 500 });
  }
}