import { useRef, useState } from "react";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import messageChatStore from "../lib/messageChatStore";
import axiosincetence from "../lib/axios";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [uploading, setUploading] = useState(false); // 🔹 Track upload status
  const fileInputRef = useRef(null);
  const { sendMessage } = messageChatStore();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true); // 🔹 Show skeleton

    let formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axiosincetence.post("/image/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setImageFile(res.data.url);
      setPreviewURL(res.data.url);
    } catch (error) {
      toast.error("Image upload failed!");
      console.error(error);
    } finally {
      setUploading(false); // 🔹 Hide skeleton
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewURL(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();


    try {
      await sendMessage(
        {
          text: text.trim(),
          image: imageFile || "",
        }
      );
      setText("");
      removeImage();
    } catch (err) {
      console.error("Sending failed:", err);
    }
  };

  return (
    <div className="p-4 w-full">
      {/* 🔹 Image Preview OR Skeleton */}
      {(previewURL || uploading) && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            {uploading ? (
              <div className="w-20 h-20 bg-zinc-700 animate-pulse rounded-lg border border-zinc-600" />
            ) : (
              <>
                <img
                  src={previewURL}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                />
                <button
                  onClick={removeImage}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
                  type="button"
                >
                  <X className="size-3" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
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

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${previewURL ? "text-emerald-500" : "text-zinc-400"
              }`}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading} // 🔹 Prevent new uploads during uploading
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={(!text.trim() && !imageFile) || uploading} // 🔹 Prevent send while uploading
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
