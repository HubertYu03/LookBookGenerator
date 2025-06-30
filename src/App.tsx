import { Buffer } from "buffer";

// Importing dependencies
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LookBookGenerator from "./pages/LookBookGenerator";

window.Buffer = Buffer;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LookBookGenerator />} />
      </Routes>
    </Router>
  );
}

export default App;
