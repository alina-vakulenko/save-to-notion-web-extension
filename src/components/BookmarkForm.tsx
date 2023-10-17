import styles from "./BookmarkForm.module.css";

type BookmarkFormProps = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  pageTitle?: string | null;
  pageUrl?: string | null;
  isSaving: boolean;
};

const BookmarkForm = ({
  onSubmit,
  pageTitle,
  pageUrl,
  isSaving,
}: BookmarkFormProps) => {
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <label htmlFor="title">
        <input
          name="title"
          type="text"
          defaultValue={pageTitle || ""}
          required
        />
        <span>Title</span>
      </label>
      <label htmlFor="url">
        <input name="url" type="text" defaultValue={pageUrl || ""} required />
        <span>URL</span>
      </label>
      <label htmlFor="tags">
        <input name="tags" type="text" />
        <span>Tags</span>
        <small>Separate Tags with Commas</small>
      </label>
      <label htmlFor="notes">
        <textarea name="notes" rows={3} />
        <span>Notes</span>
      </label>
      <div className={styles.btnContainer}>
        <button type="submit" disabled={isSaving}>
          {isSaving ? <span>Saving</span> : <span>Save</span>}
        </button>
      </div>
    </form>
  );
};

export default BookmarkForm;
