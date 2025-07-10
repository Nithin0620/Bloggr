import { IoMdShare } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";

const HeroCard = () => {
  const { token } = useAuthStore();
  const navigate = useNavigate();
  return (
    <div className="shadow-lg w-[98%] rounded-lg m-5 p-2 bg-white space-y-4">
      {token === null && (
        <div className="text-center space-y-3">
          <div className="relative text-center space-y-3">
            {/* Top Right Share Button */}
            <div className="absolute right-0 top-0 flex items-center gap-1 text-xs font-thin italic cursor-pointer hover:underline">
              <IoMdShare />
              <span>Share Bloggr</span>
            </div>

            {/* Center Title */}
            <h1 className="text-2xl font-bold">Welcome to Bloggr</h1>
          </div>
          <p className="text-sm font-serif leading-relaxed max-w-3xl mx-auto">
            Step into the future of blogging — a space where your voice finds
            clarity, your stories find purpose, and your ideas reach the world.
            Bloggr isn’t just a platform; it’s a thoughtfully designed home for
            modern creators who believe in the power of words to inspire,
            connect, and lead.
          </p>
          <div className="flex justify-center flex-wrap gap-4 pt-2">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-md font-medium shadow-sm hover:scale-105 transition"
            >
              Login
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("PostSection")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-4 py-2 rounded-md font-medium shadow-sm hover:scale-105 transition"
            >
              Explore
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-4 py-2 rounded-md font-medium shadow-sm hover:scale-105 transition"
            >
              Create Account
            </button>
          </div>
        </div>
      )}

      {token !== null && (
        <div className="text-center space-y-3">
          <div className="relative text-center space-y-3">
            {/* Top Right Share Button */}
            <div className="absolute right-0 top-0 flex items-center gap-1 text-xs font-thin italic cursor-pointer hover:underline">
              <IoMdShare />
              <span>Share Bloggr</span>
            </div>

            {/* Center Title */}
            <h1 className="text-2xl font-bold">Welcome back, creator.</h1>
          </div>
          <p className="text-sm font-serif leading-relaxed max-w-3xl mx-auto">
            You're no longer just exploring — you're{" "}
            <span className="font-semibold">building</span>. At{" "}
            <span className="font-semibold">Bloggr</span>, your words are your
            power, and now is the time to{" "}
            <span className="font-semibold">amplify your voice</span>,
            <span className="font-semibold"> grow your influence</span>, and
            <span className="font-semibold">
              {" "}
              shape the conversations that matter
            </span>
            .
          </p>
          <p className="text-base sm:text-lg md:text-xl font-medium opacity-95">
            Let your next post not just inform, but{" "}
            <span className="font-semibold">inspire</span>.
          </p>
          <div className="flex justify-center flex-wrap gap-4 pt-2">
            <button
              onClick={() => navigate("/myprofile")}
              className="px-4 py-2 rounded-md font-medium shadow-sm hover:scale-105 transition"
            >
              View Profile
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("PostSection")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-4 py-2 rounded-md font-medium shadow-sm hover:scale-105 transition"
            >
              Explore
            </button>
            <button
              onClick={() => navigate("/settings")}
              className="px-4 py-2 rounded-md font-medium shadow-sm hover:scale-105 transition"
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
