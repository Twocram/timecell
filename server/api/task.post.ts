import { Client } from "@notionhq/client";

export default defineEventHandler(async (event) => {
  const { title, time, summary, color } = (await readBody(event)) as {
    title: string;
    time: string;
    summary: string;
    color: string;
  };

  const config = useRuntimeConfig();

  const notion = new Client({ auth: config.apiKey });

  await notion.pages.create({
    parent: {
      database_id: config.databaseId as string,
    },
    properties: {
      Name: {
        type: "title",
        title: [
          {
            type: "text",
            text: {
              content: title,
            },
          },
        ],
      },
      Time: {
        type: "rich_text",
        rich_text: [
          {
            type: "text",
            text: {
              content: time,
            },
          },
        ],
      },

      Summary: {
        type: "rich_text",
        rich_text: [
          {
            type: "text",
            text: {
              content: summary,
            },
          },
        ],
      },

      Color: {
        type: "rich_text",
        rich_text: [
          {
            type: "text",
            text: {
              content: color,
            },
          },
        ],
      },
    },
  });

  return { success: true, message: "Task created" };
});
