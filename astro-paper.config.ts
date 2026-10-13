import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://ai.doezly.com/",
    title: "Doezly AI",
    description: "Curated AI workflows, GEO processes, prompt tricks, and model release benchmarks.",
    author: "Sagnik Das",
    profile: "https://doezly.com",
    ogImage: "default-og.jpg",
    lang: "en",
    timezone: "Asia/Calcutta",
    dir: "ltr",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: true,
      url: "https://github.com/sagnikdas/doezly-ai/edit/main/",
    },
    search: "pagefind",
  },
  socials: [
    { name: "mail",     url: "mailto:contact@doezly.com" },
  ],
  shareLinks: [
    { name: "whatsapp", url: "https://wa.me/?text=" },
    { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
    { name: "x",        url: "https://x.com/intent/post?url=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "pinterest", url: "https://pinterest.com/pin/create/button/?url=" },
    { name: "mail",     url: "mailto:?subject=See%20this%20post&body=" },
  ],
});
