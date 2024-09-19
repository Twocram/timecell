// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  ssr: false,
  css: ["~/assets/main.css"],
  plugins: ["~/plugins/directives.ts"],
  runtimeConfig: {
    apiKey: process.env.NOTION_API_KEY || "",
    pageId: process.env.NOTION_PAGE_ID || "",
    databaseId: process.env.NOTION_DATABASE_ID || "",
  },
});
