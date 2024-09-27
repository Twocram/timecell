import { Client } from "@notionhq/client";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const headers = getRequestHeaders(event);

  const authorizationHeader = headers["authorization"];

  const telegramId = authorizationHeader?.replace("Bearer ", "");

  const apiKey = config.apiKey;

  const notion = new Client({ auth: apiKey });

  const databaseList = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID as string,
    filter: {
      property: "telegram_id",
      rich_text: {
        equals: telegramId as string,
      },
    }
  });

  const result: {
    id: string;
    name: string;
    time: string;
    summary: string;
    color: string;
    pickedTime: string[];
    telegramId: string;
  }[] = [];

  for (const page of databaseList.results) {
    result.push({
      id: page.id,
      // @ts-ignore
      name: page.properties["Name"].title[0].plain_text,
      // @ts-ignore

      time: page.properties["Time"].rich_text[0].plain_text,
      // @ts-ignore

      summary: page.properties["Summary"].rich_text[0].plain_text,
      // @ts-ignore

      color: page.properties["Color"].rich_text[0].plain_text,

      // @ts-ignore
      pickedTime: page.properties["Picked Time"].rich_text[0].plain_text,

      // @ts-ignore
      telegramId: page.properties["telegram_id"].rich_text[0].plain_text,
    });
  }

  return result;
});
