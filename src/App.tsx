import { pdf } from "@react-pdf/renderer";
import LookBook from "./pdf/LookBook";
import { Button } from "./components/ui/button";

function App() {
  const openPDFInNewTab = async () => {
    const blob = await pdf(<LookBook />).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <div>
      <Button onClick={openPDFInNewTab}>Open PDF in New Tab</Button>
    </div>
  );
}

export default App;
