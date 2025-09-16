import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

type GifViewerProps = {
  gif: string;
};

const GifViewer = ({ gif }: GifViewerProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <img
          className="p-2 mt-2 hover:cursor-pointer"
          src={gif}
          alt={`${gif}_gif`}
        />
      </DialogTrigger>
      <DialogContent
        className="max-w-[90vw] max-h-[90vh] p-0 bg-transparent border-none shadow-none"
        showCloseButton={false}
      >
        <img className="p-2 mt-2 scale-200" src={gif} alt={`${gif}_gif`} />
      </DialogContent>
    </Dialog>
  );
};

export default GifViewer;
