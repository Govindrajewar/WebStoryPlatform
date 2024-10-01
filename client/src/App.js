import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import YourBookmarks from "./components/YourBookmarks";
import ViewStory from "./components/ViewStory";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/your-bookmarks" element={<YourBookmarks />} />
          <Route path="/stories/:storyId" element={<ViewStory />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
