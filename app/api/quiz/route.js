/**
 * Quiz API Route
 *
 * GET  /api/quiz?session_id=...
 *   Fetches quiz questions from the backend tutor API.
 *
 * POST /api/quiz
 *   Body: { session_id, answers: { [concept_key]: string } }
 *   Submits answers to the backend for evaluation.
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
      `${API_BASE_URL}/api/v1/tutor/test/start?session_id=${sessionId}`,
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
        { error: errorData.detail || "Failed to fetch quiz" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Quiz fetch error:", error);
    return Response.json({ error: "Failed to connect to quiz service" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { session_id, answers } = body;

    if (!session_id) {
      return Response.json({ error: "session_id is required" }, { status: 400 });
    }

    // Submit answers to backend for evaluation
    const response = await fetch(
      `${API_BASE_URL}/api/v1/tutor/test/submit?session_id=${session_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return Response.json(
        { error: errorData.detail || "Failed to submit quiz" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Quiz submit error:", error);
    return Response.json({ error: "Failed to submit answers" }, { status: 500 });
  }
}