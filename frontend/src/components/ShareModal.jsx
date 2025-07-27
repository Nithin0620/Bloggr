// components/ShareModal.jsx
import React from "react";
import { useShareModalStore } from "../store/ShareModal";
import { IoMdClose } from "react-icons/io";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/AuthStore";
import {
  WhatsappShareButton,
  WhatsappIcon,
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramShareButton,
  TelegramIcon,
} from "react-share";

const ShareModal = () => {
  const { isShareModalOpen, shareType, shareData, closeShareModal } = useShareModalStore();
  const { token, authUser } = useAuthStore();

  if (!isShareModalOpen) return null;

  let shareTitle = "";
  let shareUrl = "";

  switch (shareType) {
    case "profile":
      shareTitle = "Share your Profile";
      shareUrl = `${window.location.origin}/profile/${shareData?.userId}`;
      break;
    case "bloggr":
      shareTitle = "Share Bloggr with your friends";
      shareUrl = `${window.location.origin}`;
      break;
    case "post":
      shareTitle = "Share this Post";
      shareUrl = `${window.location.origin}/readmore/${shareData?.postId}`;
      break;
    default:
      break;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
  };

  if (!token && !authUser) {
    toast("Please login yourself to share this amazing stuff with your friends!", {
      duration: 6000,
      position: "top-center",
      style: {
        background: "#fff3cd",
        color: "#856404",
        border: "1px solid #ffeeba",
      },
      icon: "⚠️",
      iconTheme: {
        primary: "#856404",
        secondary: "#fff3cd",
      },
      ariaProps: {
        role: "alert",
        "aria-live": "assertive",
      },
      removeDelay: 1000,
    });
    closeShareModal();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="w-[90%] sm:w-[400px] p-6 accent-bg-mode rounded-xl shadow-accent-box relative">
        <button
          onClick={closeShareModal}
          className="absolute top-3 right-3 text-xl text-red-500 hover:rotate-90 hover:scale-75 transition-all duration-500"
        >
          <IoMdClose />
        </button>

        <h2 className="text-xl font-semibold accent-text mb-4">{shareTitle}</h2>

        <div className="bg-gray-100 text-sm p-3 rounded-lg break-all accent-text-mode mb-4">
          {shareUrl}
        </div>



        <div className="flex py-2 px-2 justify-between rounded-xl items-center accent-text mb-3 bg-gray-100">
            <div className="text-sm font-semibold flex my-auto py-auto  rounded-2xl p-2 ">Share on Social media! </div>
            <div className="flex justify-start items-center gap-2 my-auto transition-all duration-150">
               <WhatsappShareButton url={shareUrl} title={shareTitle}>
                  <WhatsappIcon size={36} round className="hover:opacity-80 transition-all duration-150"  />
               </WhatsappShareButton>
               <TwitterShareButton url={shareUrl} title={shareTitle}>
                  <TwitterIcon size={36} round  className="hover:opacity-80 transition-all duration-150"/>
               </TwitterShareButton>
               <LinkedinShareButton url={shareUrl} quote={shareTitle}>
                  <LinkedinIcon size={36} className="rounded-full hover:opacity-80 transition-all duration-150"/>
               </LinkedinShareButton>
               <TelegramShareButton url={shareUrl} quote={shareTitle}>
                  <TelegramIcon size={36} round className="hover:opacity-80 transition-all duration-150" />
               </TelegramShareButton>
            </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-lg accent-bg transition-all duration-300 hover:opacity-80 text-white shadow-accent-box"
          >
            Copy Link
          </button>
          <button
            onClick={closeShareModal}
            className="px-4 py-2 rounded-lg border transition-all duration-300 hover:bg-slate-100 hover:scale-95 accent-border accent-text-mode"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
