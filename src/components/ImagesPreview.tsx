type ImagesPreviewProps = {
  images: string[];
  sizeClasses: string;
};

const ImagesPreview = ({ images, sizeClasses }: ImagesPreviewProps) => {
  return (
    <div className="flex flex-wrap gap-4">
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`Styling Suggestion ${i + 1}`}
          className={`${sizeClasses} object-cover rounded border`}
        />
      ))}
    </div>
  );
};

export default ImagesPreview;
