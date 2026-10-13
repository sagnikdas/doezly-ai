import { getCollection } from "astro:content";

export async function GET() {
  // Astro v6 uses the 'posts' collection name by default
  const posts = await getCollection("posts", ({ data }) => !data.draft);

  const postList = posts
    .sort((a, b) => b.data.pubDatetime.getTime() - a.data.pubDatetime.getTime())
    .map(
      post =>
        `- [${post.data.title}](https://ai.doezly.com/posts/${post.id}): ${post.data.description}`
    )
    .join("\n");

  const content = `# Doezly AI
> Curated AI workflows, GEO processes, prompt tricks, and model release benchmarks.

## Canonical URL
https://ai.doezly.com/

## Curated AI Workflows & Tricks
${postList || "- No posts published yet."}
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
