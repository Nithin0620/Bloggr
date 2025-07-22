import { IoMdShare } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";
import { useShareModalStore } from "../store/ShareModal";

const HeroCard = () => {
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const { openShareModal} = useShareModalStore();

  return (
    <div className="shadow-md accent-box-shadow accent-border border w-[98%] rounded-xl m-5 p-5 z-20 drop-shadow-md shadow-accent-box  space-y-4 transition-colors duration-300 accent-bg-mode accent-text-mode">
      {/* =========================== Not Logged In =========================== */}
      {token === null && (
        <div className="text-center space-y-4">
          {/* Top Right Share Button */}
          <div className="relative">
            <div onClick={()=>openShareModal("bloggr")} className="absolute right-0 top-0 flex items-center gap-1 text-xs font-thin italic cursor-pointer hover:accent-underline transition">
              <IoMdShare />
              <span>Share Bloggr</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold accent-text">
              Welcome to Bloggr
            </h1>
          </div>

          <p className="text-sm font-serif leading-relaxed max-w-3xl mx-auto">
            Step into the future of blogging — a space where your voice finds
            clarity, your stories find purpose, and your ideas reach the world.
            <span className="font-medium"> Bloggr</span> isn’t just a platform;
            it’s a thoughtfully designed home for creators who believe in the
            power of words to inspire, connect, and lead.
          </p>

          {/* Buttons */}
          <div className="flex justify-center flex-wrap gap-4 pt-2">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 border rounded-md font-medium hover:scale-105 transition accent-text accent-border"
            >
              Login
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("PostSection")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-4 py-2 border rounded-md font-medium hover:scale-105 transition accent-text accent-border"
            >
              Explore
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-4 py-2 border rounded-md font-medium hover:scale-105 transition accent-text accent-border"
            >
              Create Account
            </button>
          </div>
        </div>
      )}

      {/* =========================== Logged In =========================== */}
      {token !== null && (
        <div className="text-center space-y-4">
          <div className="relative">
            <div onClick={()=>openShareModal("bloggr")} className="absolute right-0 top-0 flex items-center gap-1 text-xs font-thin italic cursor-pointer hover:accent-underline transition">
              <IoMdShare />
              <span>Share Bloggr</span>
            </div>

            <h1 className="text-2xl font-bold accent-text">
              Welcome back, creator.
            </h1>
          </div>

          <p className="text-sm font-serif leading-relaxed max-w-3xl mx-auto">
            "You're no longer just exploring — you're{" "}
            <span className="font-semibold">building</span>. At{" "}
            <span className="font-semibold accent-text">Bloggr</span>, your
            words are your power. It's time to{" "}
            <span className="font-semibold">amplify your voice</span>,{" "}
            <span className="font-semibold">grow your influence</span>, and{" "}
            <span className="font-semibold">
              shape the conversations that matter."
            </span>
            
          </p>

          <p className="text-base sm:text-lg md:text-xl font-medium opacity-95">
            Let your next Blog not just inform, but{" "}
            <span className="font-semibold accent-text">inspire</span>.
          </p>

          {/* Buttons */}
          <div className="flex justify-center flex-wrap gap-4 pt-2">
            <button
              onClick={() => navigate("/profile")}
              className="px-4 py-2 border rounded-md font-medium hover:scale-105 transition accent-text accent-border"
            >
              View Profile
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("PostSection")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-4 py-2 border rounded-md font-medium hover:scale-105 transition accent-text accent-border"
            >
              Explore
            </button>
            <button
              onClick={() => navigate("/settings")}
              className="px-4 py-2 border rounded-md font-medium hover:scale-105 transition accent-text accent-border"
            >
              Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroCard;
