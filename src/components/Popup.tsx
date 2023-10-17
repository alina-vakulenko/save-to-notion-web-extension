import { useState } from "react";
import BookmarkForm from "./BookmarkForm";
import {
  type Bookmark,
  saveBookmarkToNotion,
} from "../helpers/saveBookmarkToNotion";
import type { PageData } from "../App";
import styles from "./Popup.module.css";

type PopupProps = {
  pageData?: PageData;
};

const Popup = ({ pageData }: PopupProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

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
    <div className={styles.popup}>
      <div>
        <h1 className={styles.heading}>Save to Notion</h1>
      </div>
      {isSaved ? (
        <span>Saved</span>
      ) : (
        <BookmarkForm
          onSubmit={handleSubmit}
          pageTitle={pageData?.title}
          pageUrl={pageData?.url}
          isSaving={isSaving}
        />
      )}
    </div>
  );
};

export default Popup;
