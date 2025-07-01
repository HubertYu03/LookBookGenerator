// Importing dependencies
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Buffer } from "buffer";
import { Toaster } from "sonner";

// Importing Pages
import LookBookGenerator from "./pages/LookBookGenerator";

window.Buffer = Buffer;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LookBookGenerator />} />
      </Routes>
      <Toaster richColors position="top-center" />
    </Router>
  );
}

export default App;
