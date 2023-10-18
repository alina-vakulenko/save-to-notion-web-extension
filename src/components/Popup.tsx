import { useState } from "react";
import BookmarkForm from "./BookmarkForm";
import {
  Bookmark,
  saveBookmarkToNotion,
} from "../helpers/saveBookmarkToNotion";
import type { PageData } from "../App";
import styles from "./Popup.module.css";

type PopupProps = {
  pageData?: PageData;
};

const Popup = ({ pageData }: PopupProps) => {
  const [status, setStatus] = useState<"error" | "saving" | "success" | "idle">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");
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
      setStatus("success");
    } else {
      setStatus("error");
    }
  }

  const contentSaved = <span className={styles.message}>Done 👍</span>;
  const contentError = (
    <span className={styles.message}>Something went wrong</span>
  );

  return (
    <div className={styles.popup}>
      <div>
        <h1 className={styles.heading}>Save to Notion</h1>
      </div>
      {status === "success" && contentSaved}
      {status === "error" && contentError}
      {(status === "saving" || status === "idle") && (
        <BookmarkForm
          onSubmit={handleSubmit}
          pageTitle={pageData?.title}
          pageUrl={pageData?.url}
          isSaving={status === "saving"}
        />
      )}
    </div>
  );
};

export default Popup;
