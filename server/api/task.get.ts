import { Client } from "@notionhq/client";
import { users } from "~/mock";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const headers = getRequestHeaders(event);

  const authorizationHeader = headers["authorization"];

  const telegramUsername = authorizationHeader?.replace("Bearer ", "");

  const apiKey = config.apiKey;

  const currentUser = users[telegramUsername as keyof typeof users];

  const notion = new Client({ auth: apiKey });

  const databaseList = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID as string,
    filter: {
      and: [
        {
          or: [
            {
              property: "Status",
              status: {
                equals: "Not Started",
              },
            },
            {
              property: "Status",
              status: {
                equals: "In progress",
              },
            },
          ],
        },
      ],
    },
  });

  const result: {
    id: string;
    name: string;
    time: string;
    summary: string;
    color: string;
    pickedTime: string[];
    telegramId: string;
    link: string;
  }[] = [];

  for (const page of databaseList.results) {
    // @ts-ignore
    const persons = page.properties["Person"].people;

    const personNames = [];

    for (const person of persons) {
      if (person.object === "user") {
        const personDetails = await notion.users.retrieve({
          user_id: person.id,
        });
        personNames.push(personDetails.name);
      }
    }

    if (personNames.length > 0 && personNames.includes(currentUser)) {
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
        
        link: `https://www.notion.so/${page.id.replace(/-/g, '')}`
      });
    }
  }

  return result;
});
