import "./app.css";
import Home from "./components/home/Home";
import { Routes, Route } from "react-router-dom";
import Page from "./components/pages/Page";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}>
        <Route path="/page1" element={<Page />} />
        <Route path="/page2" element={<Page />} />
        <Route path="/page3" element={<Page />} />
        <Route path="/page4" element={<Page />} />
      </Route>
    </Routes>
  );
}

export default App;
