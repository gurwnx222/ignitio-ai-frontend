/**
 * PSEUDO CODE — Real API Integration
 * ─────────────────────────────────────────────────────────────────────────────
 * In production this endpoint queries the database for the lesson's code steps
 * and merges them with the authenticated user's progress record:
 *
 *   export async function GET(request) {
 *     const session = await verifySession(request);
 *     if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
 *
 *     const { searchParams } = new URL(request.url);
 *     const lessonId        = searchParams.get("lessonId");
 *     const stepNumber      = searchParams.get("step");          // optional
 *     const completedSteps  = (searchParams.get("completedSteps") ?? "")
 *                               .split(",").filter(Boolean).map(Number);
 *
 *     // Sidebar — always returned
 *     const lesson   = await db.lesson.findUnique({ where: { id: lessonId } });
 *     const steps    = await db.codeStep.findMany({ where: { lessonId }, orderBy: { order: "asc" } });
 *     const progress = await db.userCodeProgress.findMany({
 *       where: { userId: session.userId, lessonId },
 *     });
 *     const completedSet = new Set(progress.map((p) => p.stepNumber));
 *     const overallPct   = Math.round((completedSet.size / steps.length) * 100);
 *
 *     const sidebar = {
 *       title:           lesson.courseTitle,
 *       subtitle:        lesson.moduleTitle,
 *       overallProgress: overallPct,
 *       activeStepCount: lesson.activeLearnersCount,
 *       steps: steps.map((s) => ({
 *         stepNumber: s.order,
 *         title:      s.title,
 *         locked:     !completedSet.has(s.order - 1) && s.order !== 1,
 *       })),
 *     };
 *
 *     // Step content — only returned when ?step= is present
 *     if (stepNumber) {
 *       const step = await db.codeStep.findFirst({
 *         where: { lessonId, order: Number(stepNumber) },
 *       });
 *       return Response.json({ sidebar, step });
 *     }
 *
 *     return Response.json({ sidebar });
 *   }
 *
 *   export async function POST(request) {
 *     // Mark a code step as completed
 *     const { lessonId, stepNumber } = await request.json();
 *     const session = await verifySession(request);
 *     await db.userCodeProgress.upsert({
 *       where:  { userId_lessonId_stepNumber: { userId: session.userId, lessonId, stepNumber } },
 *       update: { completedAt: new Date() },
 *       create: { userId: session.userId, lessonId, stepNumber, completedAt: new Date() },
 *     });
 *     return Response.json({ success: true });
 *   }
 * ─────────────────────────────────────────────────────────────────────────────
 */

const CODE_STEPS = {
  "what-is-langchain": {
    meta: {
      title: "LangChain Mastery",
      subtitle: "Module 1: LangChain Basics",
      activeStepCount: 15,
    },
    steps: [
      {
        stepNumber: 1,
        title: "Importing Dependencies",
        subtitle: "Learn how to pull in the necessary LangChain modules.",
        filename: "chain.py",
        code: `from langchain_openai import ChatOpenAI\nfrom langchain.prompts import PromptTemplate\nfrom langchain.chains import LLMChain\nfrom langchain.schema import BaseOutputParser\n\n# Initialise the model\nllm = ChatOpenAI(\n    model="gpt-4o-mini",\n    temperature=0.7,\n)\n\nprint("Dependencies loaded successfully!")`,
        explanation: {
          title: "Core Dependencies",
          body: "We start by importing the **ChatOpenAI** wrapper, which is essential for any chain. We also pull in **PromptTemplate** and **LLMChain** from the langchain package.",
          tip: "KEEP IT LEAN",
          tipDetail: "Learn More",
        },
        concepts: "Python import syntax, LangChain module structure, and package management.",
        quickTip: "Always import only what you need. LangChain is modular — import from specific sub-packages (e.g. langchain_openai) for faster load times.",
      },
      {
        stepNumber: 2,
        title: "Creating a Prompt Template",
        subtitle: "Define reusable, parameterised prompt structures.",
        filename: "prompt.py",
        code: `from langchain.prompts import PromptTemplate\n\n# Define the template with input variables\ntemplate = """\nYou are a helpful assistant that explains concepts clearly.\n\nTopic: {topic}\nAudience level: {level}\n\nProvide a concise explanation in 3 bullet points.\n"""\n\nprompt = PromptTemplate(\n    input_variables=["topic", "level"],\n    template=template,\n)\n\n# Preview a formatted prompt\nformatted = prompt.format(topic="LangChain", level="beginner")\nprint(formatted)`,
        explanation: {
          title: "PromptTemplate",
          body: "**PromptTemplate** turns a plain string into a reusable, testable object. The curly-brace placeholders become **input_variables** that you fill at runtime.",
          tip: "VERSION CONTROL",
          tipDetail: "Learn More",
        },
        concepts: "Prompt engineering, template variables, and input validation.",
        quickTip: "Name your variables descriptively. PromptTemplate validates that every declared variable is provided before calling the model.",
      },
      {
        stepNumber: 3,
        title: "Building a Chain",
        subtitle: "Pipe a prompt and a model together using LCEL.",
        filename: "chain.py",
        code: `from langchain_openai import ChatOpenAI\nfrom langchain.prompts import PromptTemplate\nfrom langchain_core.output_parsers import StrOutputParser\n\nllm = ChatOpenAI(model="gpt-4o-mini", temperature=0.7)\n\nprompt = PromptTemplate.from_template(\n    "Explain {topic} in one sentence for a {level}."\n)\n\n# LCEL pipe syntax: prompt → model → parser\nchain = prompt | llm | StrOutputParser()\n\n# Invoke the chain\nresult = chain.invoke({"topic": "LangChain", "level": "beginner"})\nprint(result)`,
        explanation: {
          title: "LCEL Pipe Syntax",
          body: "The **|** operator is LangChain Expression Language (LCEL). It composes **prompt → model → parser** into a single callable chain with built-in streaming and batching.",
          tip: "COMPOSABILITY",
          tipDetail: "Learn More",
        },
        concepts: "LangChain Expression Language (LCEL), chain composition, and output parsing.",
        quickTip: "LCEL chains are lazy — nothing runs until you call .invoke(), .stream(), or .batch(). This makes them easy to unit-test in isolation.",
      },
      {
        stepNumber: 4,
        title: "Streaming the Response",
        subtitle: "Receive tokens in real-time for a responsive UX.",
        filename: "stream.py",
        code: `from langchain_openai import ChatOpenAI\nfrom langchain.prompts import PromptTemplate\nfrom langchain_core.output_parsers import StrOutputParser\n\nllm = ChatOpenAI(model="gpt-4o-mini", temperature=0.7)\n\nchain = (\n    PromptTemplate.from_template("Write a haiku about {subject}.")\n    | llm\n    | StrOutputParser()\n)\n\n# Stream tokens one-by-one\nfor chunk in chain.stream({"subject": "artificial intelligence"}):\n    print(chunk, end="", flush=True)\n\nprint()  # newline at the end`,
        explanation: {
          title: "Streaming Tokens",
          body: "Calling **.stream()** instead of **.invoke()** returns a generator. Each **chunk** is a partial string as the model produces it — perfect for chat UIs.",
          tip: "UX FIRST",
          tipDetail: "Learn More",
        },
        concepts: "Async generators, streaming APIs, and real-time UI updates.",
        quickTip: "For web apps, pair chain.astream() with Server-Sent Events (SSE) or WebSockets so the browser receives chunks without polling.",
      },
    ],
  },
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lessonId       = searchParams.get("lessonId") ?? "what-is-langchain";
  const stepNumber     = searchParams.get("step") ? Number(searchParams.get("step")) : null;
  const completedRaw   = searchParams.get("completedSteps") ?? "";
  const completedSteps = new Set(completedRaw.split(",").filter(Boolean).map(Number));

  const lesson = CODE_STEPS[lessonId];
  if (!lesson) return Response.json({ error: "Lesson not found" }, { status: 404 });

  const { meta, steps } = lesson;
  const overallProgress = completedSteps.size === 0
    ? 0
    : Math.round((completedSteps.size / steps.length) * 100);

  // Sidebar — always returned; lock state driven by completedSteps from client
  const sidebar = {
    title: meta.title,
    subtitle: meta.subtitle,
    overallProgress,
    activeStepCount: meta.activeStepCount,
    steps: steps.map((s) => ({
      stepNumber: s.stepNumber,
      title: s.title,
      locked: s.stepNumber !== 1 && !completedSteps.has(s.stepNumber - 1),
    })),
  };

  // Step content — only when ?step= is provided
  if (stepNumber !== null) {
    const step = steps.find((s) => s.stepNumber === stepNumber) ?? null;
    if (!step) return Response.json({ error: "Step not found" }, { status: 404 });
    return Response.json({ sidebar, step });
  }

  return Response.json({ sidebar });
}
