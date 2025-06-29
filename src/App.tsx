import { pdf } from "@react-pdf/renderer";
import LookBook from "./pdf/LookBook";
import { Button } from "./components/ui/button";
import { useState } from "react";
import { Input } from "./components/ui/input";
import { Buffer } from "buffer";

window.Buffer = Buffer;

function App() {
  const [text, setText] = useState<string>("Default");
  const [two, setTwo] = useState<string>("Default 2");
  const [imageData, setImageData] = useState<string | null>(null);

  const openPDFInNewTab = async () => {
    const blob = await pdf(
      <LookBook
        section_one={text}
        section_two={two}
        image={imageData as string}
      />
    ).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          setImageData(result); // This will be a base64 data URL
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <Input
        placeholder="Enter Text"
        onChange={(e) => setText(e.target.value)}
      />
      <Input
        placeholder="Enter Text"
        onChange={(e) => setTwo(e.target.value)}
      />
      <Input
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp"
        onChange={handleImageChange}
      />
      <Button onClick={openPDFInNewTab}>Open PDF in New Tab</Button>
    </div>
  );
}

export default App;
