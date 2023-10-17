import { useEffect, useState } from "react";
import browser, { Tabs } from "webextension-polyfill";
import {
  type Bookmark,
  saveBookmarkToNotion,
} from "./helpers/saveBookmarkToNotion";

type PageData = {
  title: string;
  url: string;
};

function App() {
  const [pageData, setPageData] = useState<PageData>();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    browser.tabs
      .query({ active: true, currentWindow: true })
      .then((tabs: Tabs.Tab[]) => {
        const url = tabs[0].url || "URL";
        const title = tabs[0].title || "Title";
        setPageData({ url, title });
      });
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    const bookmarkData = Object.fromEntries(formData.entries()) as Record<
      string,
      string
    >;

    const tags = bookmarkData.tags
      .split(",")
      .filter((item: string) => item.trim().length !== 0)
      .map((item: string) => ({
        name: item.trim(),
      }));

    const bookmark = { ...bookmarkData, tags } as Bookmark;
    const result = await saveBookmarkToNotion(bookmark);

    if (result) {
      setIsSaved(true);
    } else {
      setIsSaving(false);
    }
  }

  return (
    <div>
      <div>
        <h1>Save to Notion</h1>
      </div>
      <div>
        {isSaved ? (
          <span>Saved</span>
        ) : (
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="title">Title</label>
              <input
                name="title"
                type="text"
                defaultValue={pageData?.title}
                title={pageData?.title}
                required
              />
            </div>
            <div>
              <label htmlFor="url">URL</label>
              <input
                name="url"
                type="url"
                defaultValue={pageData?.url}
                title={pageData?.url}
                required
              />
            </div>
            <div>
              <label htmlFor="tags">Tags</label>
              <input name="tags" type="text" />
              <small>Separate Tags with Commas</small>
            </div>
            <div>
              <label htmlFor="notes">Notes</label>
              <textarea name="notes" rows={3} />
            </div>
            <div>
              <button type="submit" disabled={isSaving} className="btn-save">
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
