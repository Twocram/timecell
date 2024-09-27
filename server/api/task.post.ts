import { Client } from "@notionhq/client";

export default defineEventHandler(async (event) => {
  const { title, time, summary, color, pickedTime, telegramId } = (await readBody(
    event
  )) as {
    title: string;
    time: string;
    summary: string;
    color: string;
    pickedTime: string[];
    telegramId: number;
  };

  const config = useRuntimeConfig();

  const notion = new Client({ auth: config.apiKey });

  const tasksWithSameName = await notion.databases.query({
    database_id: config.databaseId as string,
    filter: {
      property: "Name",
      title: {
        equals: title,
      },
    },
  });

  let sameTask: any = {};

  if (tasksWithSameName.results.length > 0) {
    sameTask = tasksWithSameName.results[0];
  }

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
              content: sameTask?.properties
                ? sameTask.properties.Color.rich_text[0].plain_text
                : color,
            },
          },
        ],
      },

      "Picked Time": {
        type: "rich_text",
        rich_text: [
          {
            type: "text",
            text: {
              content: pickedTime.toString(),
            },
          },
        ],
      },

      "telegram_id": {
        type: "rich_text",
        rich_text: [
          {
            type: "text",
            text: {
              content: telegramId.toString(),
            },
          },
        ],
      }
    },
  });

  return { success: true, message: "Task created" };
});
