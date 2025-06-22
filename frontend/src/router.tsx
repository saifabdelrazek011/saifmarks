import { HashRouter, Route, Routes, Navigate } from "react-router-dom";

function router() {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/about" element={<div>About Page</div>} />
          <Route path="/contact" element={<div>Contact Page</div>} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default router;
