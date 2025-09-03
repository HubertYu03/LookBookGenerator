// Importing UI Components
import { toast } from "sonner";

// Importing Icons
import { Share } from "lucide-react";

// Importing dependencies
import { useLocation } from "react-router-dom";

type MobileShareProps = {
  exists: boolean;
};

const MobileShare = ({ exists }: MobileShareProps) => {
  // Get the current path
  const location = useLocation();

  // Get full pathname + query
  const fullPath =
    window.location.origin +
    location.pathname +
    location.search +
    location.hash;

  // Function to handle the link copy
  async function handle_copy() {
    const text = fullPath;
    if (text) {
      await navigator.clipboard.writeText(text);
      toast.success("Link Copied to Clipboard!");
    }
  }

  // Function to handle sharing a link
  const handle_share_link = () => {
    // Clear toasts
    toast.dismiss();

    if (exists) {
      handle_copy();
    } else {
      // If the book does not exist, you cannot share the link
      toast.warning("You must save progress before sharing link!");
    }
  };

  return (
    <div
      className="flex flex-row gap-2 active:opacity-50"
      onClick={handle_share_link}
    >
      <Share />
      <div>Share</div>
    </div>
  );
};

export default MobileShare;
