import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center min-h-screen p-16 accent-bg-light shadow-accent-box">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center
             justify-center animate-bounce shadow-accent-box"
            >
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold">Welcome to BloggrChat!</h2>
        <p className="text-base-content/60">
          Select a conversation from the sidebar to start Conversation
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
