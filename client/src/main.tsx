import { createRoot } from "react-dom/client";
import { Helmet } from "react-helmet";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <>
    <Helmet>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" />
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Inter:wght@300;400;500&family=Roboto+Condensed:wght@400;700&display=swap" rel="stylesheet" />
    </Helmet>
    <App />
  </>
);
