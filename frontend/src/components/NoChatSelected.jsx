import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col accent-box-shadow border-l-0 accent-border items-center justify-center min-h-screen p-16 shadow-accent-box transition-colors duration-300 accent-bg-mode accent-text-mode">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center
             justify-center animate-bounce shadow-accent-box  bg-transparent"
            >
              <MessageSquare className="w-8 bg-transparent h-8 text-primary" />
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
