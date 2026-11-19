import { Route, Routes } from "react-router-dom";
import BookDetail from "./pages/BookDetail.jsx";
import HomePage from "./pages/HomePage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/books/:id" element={<BookDetail />} />
    </Routes>
  );
}

export default App;
