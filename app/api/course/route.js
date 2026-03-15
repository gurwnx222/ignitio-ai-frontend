/**
 * PSEUDO CODE — Real API Integration
 * ─────────────────────────────────────────────────────────────────────────────
 * In production, replace the static COURSE_DATA below with real API calls:
 *
 *   import { db } from "@/lib/db";               // e.g. Prisma, Drizzle, Supabase
 *   import { verifySession } from "@/lib/auth";  // e.g. NextAuth / Clerk
 *
 *   export async function GET(request) {
 *     const session = await verifySession(request);
 *     if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
 *
 *     const courseId = new URL(request.url).searchParams.get("courseId") ?? "langchain-mastery";
 *
 *     // Fetch course structure from database
 *     const course     = await db.course.findUnique({ where: { slug: courseId } });
 *     const lessons    = await db.lesson.findMany({ where: { courseId: course.id }, orderBy: { order: "asc" } });
 *     const progress   = await db.userProgress.findMany({ where: { userId: session.userId, courseId: course.id } });
 *
 *     // Merge progress into lessons (mark completed steps, unlock next lesson)
 *     const enriched = mergeLessonsWithProgress(lessons, progress);
 *
 *     return Response.json({ course: { ...course, lessons: enriched } });
 *   }
 *
 *   export async function POST(request) {
 *     // Mark a step as completed and unlock the next one
 *     const { stepId, lessonId } = await request.json();
 *     await db.userProgress.upsert({ ... });
 *     return Response.json({ success: true });
 *   }
 * ─────────────────────────────────────────────────────────────────────────────
 */

const COURSE_DATA = {
  id: "langchain-mastery",
  title: "LangChain Mastery",
  overallProgress: 20,
  lessons: [
    {
      id: "what-is-langchain",
      title: "What is LangChain?",
      subtitle: "Foundations & Architecture",
      locked: false,
      current: true,
      currentStep: 1,
      totalSteps: 3,
      steps: [
        {
          stepNumber: 1,
          sectionTitle: "THE CORE CONCEPT",
          progress: 33,
          title: "What is LangChain?",
          description:
            'At its core, LangChain is a framework designed to simplify the creation of applications using large language models (LLMs). Think of it as the "glue" that connects powerful AI models with your data and application logic.',
          features: [
            {
              icon: "orchestration",
              title: "Orchestration",
              description:
                "LangChain allows you to \"chain\" together different components to create complex workflows that a single LLM call couldn't handle alone.",
            },
            {
              icon: "data",
              title: "Data Awareness",
              description:
                "It enables LLMs to connect to external data sources—like PDFs, databases, or APIs—to provide context-aware answers.",
            },
          ],
          objectives: [
            "Understand the problem space LangChain addresses in the LLM ecosystem.",
            "Identify the 6 core modules: Model I/O, Data Connection, Chains, Memory, Agents, and Callbacks.",
            "Set up your local environment for the upcoming hands-on projects.",
          ],
          resources: [
            { icon: "doc", title: "Official Documentation" },
            { icon: "code", title: "Starter Code Assets" },
            { icon: "forum", title: "Discussion Forum" },
          ],
        },
        {
          stepNumber: 2,
          sectionTitle: "MODEL I/O",
          progress: 66,
          title: "Talking to Language Models",
          description:
            "Model I/O is the foundation of any LangChain application. It covers how to format inputs (prompts), interact with any LLM or chat model, and parse outputs into structured data your app can use.",
          features: [
            {
              icon: "orchestration",
              title: "Prompt Templates",
              description:
                "Reusable, parameterized templates that let you dynamically inject variables into prompts for consistent, testable LLM inputs.",
            },
            {
              icon: "data",
              title: "Output Parsers",
              description:
                "Transform raw LLM text responses into structured formats like JSON, lists, or typed Pydantic objects.",
            },
          ],
          objectives: [
            "Create and reuse PromptTemplates for consistent LLM interactions.",
            "Call chat models using LangChain's unified interface (OpenAI, Anthropic, etc.).",
            "Parse structured output from free-form model responses.",
          ],
          resources: [
            { icon: "doc", title: "Prompt Templates Docs" },
            { icon: "code", title: "Model I/O Notebook" },
            { icon: "forum", title: "Community Examples" },
          ],
        },
        {
          stepNumber: 3,
          sectionTitle: "PUTTING IT TOGETHER",
          progress: 100,
          title: "Your First LangChain App",
          description:
            "You now have all the pieces to build a real application. In this step you will combine prompt templates, a language model, and an output parser into a complete, runnable LangChain pipeline.",
          features: [
            {
              icon: "orchestration",
              title: "LCEL Pipelines",
              description:
                "Use the pipe operator (|) from LangChain Expression Language to compose components declaratively into a clean, readable chain.",
            },
            {
              icon: "data",
              title: "Streaming Responses",
              description:
                "Stream tokens in real-time as the model generates them for a faster, more responsive user experience.",
            },
          ],
          objectives: [
            "Build an end-to-end chain using LCEL syntax.",
            "Run the chain against a real LLM and inspect the output.",
            "Add streaming support and observe token-by-token output.",
          ],
          resources: [
            { icon: "doc", title: "LCEL Reference Guide" },
            { icon: "code", title: "Completed Project Code" },
            { icon: "forum", title: "Share Your Build" },
          ],
        },
      ],
    },
    {
      id: "lcel",
      title: "LCEL",
      subtitle: "Expression Language Syntax",
      locked: true,
      totalSteps: 4,
      steps: [],
    },
    {
      id: "chains",
      title: "Chains",
      subtitle: "Connecting Multiple Components",
      locked: true,
      totalSteps: 5,
      steps: [],
    },
    {
      id: "memory",
      title: "Memory",
      subtitle: "State & Conversation Context",
      locked: true,
      totalSteps: 3,
      steps: [],
    },
  ],
};

export async function GET() {
  return Response.json({ course: COURSE_DATA });
}
