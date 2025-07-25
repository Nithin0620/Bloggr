import { useRef, useState } from "react";
import { useChatStore } from "../store/ChatStore";
import { Image, Loader, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();
  const [loading,setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file?.type?.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      setLoading(true);
      console.log(text);
      await sendMessage({
        text: text.trim() || null,
        image: imagePreview || null,
      });
      setLoading(false);

      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full accent-bg-mode shadow-accent-box rounded-t-md transition-colors duration-300 accent-bg-mode accent-text-mode">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative shadow-accent-box rounded-md">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border accent-box-shadow accent-border"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center accent-bg-mode  hover:scale-105 transition-all duration-300 justify-center shadow-accent-box"
              type="button"
            >
              <IoMdClose className="m-1 hover:text-red-500 transition-all duration-150 hover:scale-105 accent-bg-mode"/>
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full focus:outline-none border-none rounded accent-bg-mode input-sm sm:input-md shadow-accent-box"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
            />
            {loading && <Loader className="mr-20 right-0 animate-spin"/>}

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle shadow-accent-box ${
              imagePreview ? "text-emerald-500" : "text-zinc-400"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>

        <button
          type="submit"
          className={`btn ${(!text.trim() && !imagePreview) || loading ? "from-neutral-400":"" }cursor-pointer hover:scale-110 transition-all duration-150 btn-sm btn-circle shadow-accent-box`}
          disabled={(!text.trim() && !imagePreview) || loading}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
