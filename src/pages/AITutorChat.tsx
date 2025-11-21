import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { Send, Mic, Image as ImageIcon } from "lucide-react";
import { usePdf } from "../contexts/PdfContext";
import { useAuth } from "../contexts/AuthContext";
import { PageHeader } from "../components/PageHeader";
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

  const quickPrompts = [
    "Explain chapter in Tamil",
    "Create revision summary",
    "Generate mock test",
    "Solve this problem step by step",
  ];

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
    <div className="min-h-screen bg-background flex flex-col">
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
      <div className="flex-1 flex overflow-hidden">
        {/* PDF Viewer - 40% Left */}
        {pdfUrl && (
          <div className="w-[40%] border-r border-border bg-gray-50 flex flex-col min-w-0">
            <div className="p-4 border-b border-border shrink-0 bg-white">
              <h3 className="font-medium text-gray-800 truncate">
                {pdfTitle || "PDF Document"}
              </h3>
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

        {/* Chat Area - 70% Right */}
        <div
          className={`flex-1 flex flex-col min-w-0 ${
            pdfUrl ? "" : "container mx-auto px-6 max-w-4xl"
          }`}
        >
          <div
            className={`flex-1 flex flex-col ${pdfUrl ? "px-6 py-6" : "py-6"}`}
          >
            <Card className="flex-1 shadow-lg border-0 flex flex-col">
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl p-4 ${
                          message.role === "user"
                            ? "bg-primary text-white"
                            : "bg-blue-50 text-gray-800"
                        }`}
                      >
                        {message.role === "ai" && (
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                              <Sparkles className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-xs font-medium text-blue-600">
                              AI Tutor
                            </span>
                          </div>
                        )}
                        <p className="leading-relaxed">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>

            {/* Quick Prompts */}
            <div className="mt-4 mb-4">
              <p className="text-sm text-muted-foreground mb-3">
                Quick suggestions:
              </p>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickPrompt(prompt)}
                    className="rounded-full"
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>

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
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
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
      </div>
    </div>
  );
}
