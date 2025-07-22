// Importing dependencies
import { useState } from "react";

// Importing UI Components
import { CircleX } from "lucide-react";
import { Button } from "./ui/button";

// Importing Global Types
import type { Img } from "@/types/global";

type ImagesPreviewProps = {
  images: Img[];
  sizeClasses: string;
  removeImage: (value: number) => void;
  canEdit: boolean;
};

const ImagesPreview = ({
  images,
  sizeClasses,
  removeImage,
  canEdit,
}: ImagesPreviewProps) => {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="flex flex-wrap gap-4">
      {images.map((src, i) => (
        <div
          key={i}
          className="relative"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(null)}
        >
          {hover == i && canEdit && (
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-1 left-1 hover:cursor-pointer"
              onClick={() => removeImage(src.id)}
            >
              <CircleX />
            </Button>
          )}
          <img
            key={src.id}
            src={src.src}
            alt={`Styling Suggestion ${i + 1}`}
            className={`${sizeClasses} object-cover rounded border`}
          />
        </div>
      ))}
    </div>
  );
};

export default ImagesPreview;
