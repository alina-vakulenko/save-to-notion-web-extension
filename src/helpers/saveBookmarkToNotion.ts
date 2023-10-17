import { notion } from "../notionClient";

type Tag = {
  name: string;
};

export type Bookmark = {
  title: string;
  url: string;
  tags: Tag[];
  notes?: string;
};

export async function saveBookmarkToNotion(bookmark: Bookmark) {
  try {
    await notion.pages.create({
      parent: {
        type: "database_id",
        database_id: import.meta.env.VITE_NOTION_DATABASE_ID,
      },
      properties: {
        Title: {
          title: [
            {
              text: {
                content: bookmark.title,
              },
            },
          ],
        },
        URL: {
          url: bookmark.url,
        },
        Tags: {
          multi_select: bookmark.tags,
        },
        Notes: {
          rich_text: [
            {
              text: {
                content: bookmark.notes || "-",
              },
            },
          ],
        },
      },
    });
    return true;
  } catch (error) {
    return false;
  }
}
