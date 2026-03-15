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
      codeLesson: {
        title: "LangChain Mastery",
        subtitle: "Module 1: LangChain Basics",
        overallProgress: 25,
        activeStepCount: 15,
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
