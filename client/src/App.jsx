import TextEditor from "./components/TextEditor";
import { v4 as uuid } from "uuid";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate replace to={`/document/${uuid()}`} />}
        />
        <Route path="/document/:id" element={<TextEditor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
