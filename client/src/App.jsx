// src/App.jsx
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* later: add /dashboard, /missions, /login, etc. */}
    </Routes>
  );
}

export default App;
