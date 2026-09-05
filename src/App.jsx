import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import styles from "./App.module.css";
import CaptchaPage from "./components/CaptchaPage";

const App = () => {
  return (
    <div className={styles.appContainer}>
      <BrowserRouter>
        <Routes>
          {/* Main verification route */}
          <Route
            path="/captcha"
            element={<CaptchaPage initialGems={125.5} />}
          />

          {/* Root redirect to /captcha */}
          <Route path="/" element={<Navigate to="/captcha" replace />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/captcha" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
