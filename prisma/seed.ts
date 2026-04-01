import { PrismaClient, CheckType, Status, Plan } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database…");

  // ── Demo user ──────────────────────────────────────────────────────────────
  const user = await db.user.upsert({
    where: { email: "demo@zeroplag.com" },
    update: {},
    create: {
      email: "demo@zeroplag.com",
      name: "Demo User",
      plan: Plan.PRO,
    },
  });
  console.log("  ✓ User:", user.email);

  // ── Sample documents ───────────────────────────────────────────────────────
  const doc1 = await db.document.create({
    data: {
      userId: user.id,
      title: "Introduction to Machine Learning",
      content: `Machine learning is a subset of artificial intelligence that provides systems the ability to automatically learn and improve from experience without being explicitly programmed. Machine learning focuses on the development of computer programs that can access data and use it learn for themselves.

The process begins with observations or data, such as examples, direct experience, or instruction, so that computers can learn to make better decisions in the future. The primary aim is to allow the computers to learn automatically without human intervention or assistance and adjust actions accordingly.

Some machine learning methods include supervised learning, unsupervised learning, and reinforcement learning. Each method has different applications and is used depending on the type of data available and the desired outcome.`,
      wordCount: 112,
    },
  });

  await db.check.create({
    data: {
      documentId: doc1.id,
      type: CheckType.GRAMMAR,
      status: Status.COMPLETE,
      score: 94.0,
      completedAt: new Date(),
      results: {
        errors: [
          {
            original: "in the future",
            suggestion: "going forward",
            explanation: "Slightly redundant phrasing",
            severity: "info",
            position: { start: 412, end: 426 },
          },
        ],
      },
    },
  });

  await db.check.create({
    data: {
      documentId: doc1.id,
      type: CheckType.PLAGIARISM,
      status: Status.COMPLETE,
      score: 72.0,
      completedAt: new Date(),
      results: {
        summary: "Some common phrases detected from educational sources.",
        overallRisk: "medium",
      },
      matches: {
        create: [
          {
            sourceUrl: "https://example.com/ml-intro",
            sourceTitle: "Introduction to Machine Learning — Example University",
            matchText: "Machine learning is a subset of artificial intelligence",
            similarity: 0.88,
            startIndex: 0,
            endIndex: 56,
          },
        ],
      },
    },
  });

  console.log("  ✓ Document:", doc1.title);

  const doc2 = await db.document.create({
    data: {
      userId: user.id,
      title: "Climate Change Overview",
      content: `Climate change refers to long-term shifts in global temperatures and weather patterns. These shifts may be natural, but since the mid-20th century, human activities have been the main driver of climate change, primarily due to the burning of fossil fuels like coal, oil, and gas.

Burning fossil fuels generates greenhouse gas emissions that act like a blanket wrapped around the Earth, trapping the sun's heat and raising temperatures. The main greenhouse gases that are causing climate change include carbon dioxide and methane.

The effects of climate change include more frequent extreme weather events, rising sea levels, melting glaciers, and disruptions to ecosystems and biodiversity worldwide.`,
      wordCount: 103,
    },
  });

  console.log("  ✓ Document:", doc2.title);

  console.log("✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
