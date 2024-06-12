import "./app.css";
import Home from "./Layout/Home";
import { Routes, Route } from "react-router-dom";
import Page from "./pages/Page";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}>
        <Route path="/" element={<h1>Hello Page</h1>} />
        <Route path="/page1" element={<Page />} />
        <Route path="/page2" element={<Page />} />
        <Route path="/page3" element={<Page />} />
        <Route path="/page4" element={<Page />} />
      </Route>
    </Routes>
  );
}

export default App;
