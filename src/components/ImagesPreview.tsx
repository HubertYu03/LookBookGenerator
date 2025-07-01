type ImagesPreviewProps = {
  images: string[];
  width: string;
  height: string;
};

const ImagesPreview = ({ images, width, height }: ImagesPreviewProps) => {
  return (
    <div className="flex flex-wrap gap-4">
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`Styling Suggestion ${i + 1}`}
          className={`h-${height} w-${width} object-cover rounded border`}
        />
      ))}
    </div>
  );
};

export default ImagesPreview;
