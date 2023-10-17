import { useEffect, useState } from "react";
import { Client } from "@notionhq/client";
import browser, { Tabs } from "webextension-polyfill";
import "./App.css";

type Tag = {
  name: string;
};

type Bookmark = {
  title: string;
  url: string;
  tags: Tag[];
  notes: string;
};

type PageData = {
  title: string;
  url: string;
};

const notion = new Client({
  auth: import.meta.env.VITE_NOTION_API_TOKEN,
});

function App() {
  const [pageData, setPageData] = useState<PageData>();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  async function saveBookmarkToNotion(bookmark: Bookmark) {
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);
    console.log(e.target);
    // const bookmark = Object.fromEntries(e.target.elements);

    // bookmark.tags = bookmark.tags
    //   .split(",")
    //   .filter((tag: string) => tag.trim().length !== 0)
    //   .map((tag: string) => ({
    //     name: tag.trim(),
    //   }));
    const bookmark = {
      title: "title",
      url: "url",
      tags: [{ name: "tag1" }, { name: "tag2" }],
      notes: "notes",
    };

    const result = await saveBookmarkToNotion(bookmark);

    if (result) {
      setIsSaved(true);
    } else {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    browser.tabs &&
      browser.tabs
        .query({ active: true, currentWindow: true })
        .then((tabs: Tabs.Tab[]) => {
          const url = tabs[0].url || "unknown";
          const title = tabs[0].title || "unknown";
          setPageData({ url, title });
        });
  }, []);

  return (
    <div>
      <div>
        <h1>Save to Notion Bookmarks</h1>
      </div>
      <div>
        {isSaved ? (
          <span>Saved</span>
        ) : (
          <form onSubmit={handleSubmit}>
            <div>
              <label>Title</label>
              <input
                name="title"
                type="text"
                defaultValue={pageData?.title}
                title={pageData?.title}
                required
              />
            </div>
            <div>
              <label>URL</label>
              <input
                name="url"
                type="url"
                defaultValue={pageData?.url}
                title={pageData?.url}
                required
              />
            </div>
            <div>
              <label>Languages</label>
              <input name="languages" type="text" />
              <small>Separate Languages with Commas</small>
            </div>
            <div>
              <label>Tags</label>
              <input name="tags" type="text" />
              <small>Separate Tags with Commas</small>
            </div>
            <div>
              <label>Notes</label>
              <textarea name="notes" rows={3} />
            </div>
            <div>
              <button type="submit" disabled={isSaving}>
                {isSaving ? <span>Saving</span> : <span>Save</span>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default App;
