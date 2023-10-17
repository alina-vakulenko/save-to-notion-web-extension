import { useEffect, useState } from "react";
import browser, { Tabs } from "webextension-polyfill";
import Popup from "./components/Popup";

export type PageData = {
  title: string | null;
  url: string | null;
};

function App() {
  const pageData = useBrowserData();

  return <Popup pageData={pageData} />;
}

export default App;

const useBrowserData = () => {
  const [pageData, setPageData] = useState<PageData>();

  useEffect(() => {
    browser.tabs
      .query({ active: true, currentWindow: true })
      .then((tabs: Tabs.Tab[]) => {
        const url = tabs[0].url || null;
        const title = tabs[0].title || null;
        setPageData({ url, title });
      });
  }, []);

  return pageData;
};
