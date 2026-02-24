import { ChatInterface } from "@/components/app/chat/ChatInterface";

export default function AppPage() {
    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
            <ChatInterface />
        </div>
    );
}
