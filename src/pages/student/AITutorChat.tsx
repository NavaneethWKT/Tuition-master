import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ScrollArea } from "../../components/ui/scroll-area";
import {
  Send,
  Mic,
  Image as ImageIcon,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { usePdf } from "../../contexts/PdfContext";
import { useAuth } from "../../contexts/AuthContext";
import { PageHeader } from "../../components/PageHeader";
import { Sparkles } from "lucide-react";

interface Message {
  id: number;
  role: "ai" | "user";
  content: string;
}

export function AITutorChat() {
  const navigate = useNavigate();
  const { selectedPdfUrl: pdfUrl, selectedPdfTitle: pdfTitle } = usePdf();
  const { userRole } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "ai",
      content:
        "Hello! I'm your AI Tuition Master. How can I help you learn today?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isChatAreaVisible, setIsChatAreaVisible] = useState(true);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newUserMessage: Message = {
        id: messages.length + 1,
        role: "user",
        content: inputMessage,
      };

      const aiResponse: Message = {
        id: messages.length + 2,
        role: "ai",
        content: `I understand you want help with "${inputMessage}". Let me break this down for you step by step...`,
      };

      setMessages([...messages, newUserMessage, aiResponse]);
      setInputMessage("");
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt);
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <PageHeader
        title="AI Tuition Master"
        subtitle="Your personal AI tutor"
        showBackButton={true}
        icon={
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        }
      />

      {/* Main Content Area - Split Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* PDF Viewer - 35% Left (or 100% when chat is hidden) */}
        {pdfUrl && (
          <div
            className={`${
              isChatAreaVisible ? "flex-[0_0_35%]" : "flex-1"
            } border-r border-border bg-gray-50 flex flex-col min-w-0 transition-all duration-300`}
          >
            <div className="p-4 border-b border-border shrink-0 bg-white flex items-center justify-between">
              <h3 className="font-medium text-gray-800 truncate">
                {pdfTitle || "PDF Document"}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsChatAreaVisible(!isChatAreaVisible)}
                className="shrink-0"
              >
                {isChatAreaVisible ? (
                  <ChevronRight className="w-5 h-5" />
                ) : (
                  <ChevronLeft className="w-5 h-5" />
                )}
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="w-full h-full bg-white">
                <embed
                  src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                  type="application/pdf"
                  className="w-full h-full"
                  style={{ minHeight: "100%" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Chat Area - 65% Right (hidden when isChatAreaVisible is false) */}
        {isChatAreaVisible ? (
          <div
            className={`${
              pdfUrl
                ? "flex-[0_0_65%]"
                : "flex-1 container mx-auto px-6 max-w-4xl"
            } flex flex-col min-w-0 transition-all duration-300 bg-paper relative`}
          >
            <div
              className={`flex-1 flex flex-col ${
                pdfUrl ? "px-6 py-6" : "py-6"
              }`}
            >
              {/* Chalkboard - AI Messages */}
              <Card className="h-2/3 max-w-3xl mb-10 mx-auto chalkboard overflow-hidden">
                <CardContent className="p-6 h-full flex flex-col">
                  <ScrollArea className="flex-1">
                    <div className="space-y-4 chalkboard-text">
                      {messages[0].content}
                      {messages[0].content}
                      {messages[0].content}
                      {messages[0].content}
                      {messages[0].content}
                      {messages[0].content}
                      {messages[0].content}
                      {messages[0].content}
                      {messages[0].content}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card className="h-1/7 w-lg mb-10 ml-auto overflow-hidden">
                <CardContent className="p-6 h-full flex flex-col">
                  <ScrollArea className="flex-1">
                    <div className="space-y-4">{messages[0].content}</div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Input Area */}
              <Card className="shadow-lg border-0">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <Mic className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <ImageIcon className="w-5 h-5" />
                    </Button>
                    <Input
                      placeholder="Ask me anything about your lessons..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      className="flex-1 border-0 bg-muted focus-visible:ring-0"
                    />
                    <Button
                      onClick={handleSendMessage}
                      size="icon"
                      className="shrink-0"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Floating button to show chat when hidden and no PDF */
          !pdfUrl && (
            <div className="absolute top-4 right-4 z-10">
              <Button
                variant="default"
                size="icon"
                onClick={() => setIsChatAreaVisible(true)}
                className="rounded-full shadow-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
