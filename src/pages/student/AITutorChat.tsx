import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Send, ChevronRight, ChevronLeft } from "lucide-react";
import { usePdf } from "../../contexts/PdfContext";
import { useAuth } from "../../contexts/AuthContext";
import { PageHeader } from "../../components/PageHeader";
import { Sparkles } from "lucide-react";

interface Message {
  id: number;
  role: "ai" | "user" | "system";
  content: string;
  mode?: string;
  timestamp?: string;
}

export function AITutorChat() {
  const navigate = useNavigate();
  const { selectedPdfUrl: pdfUrl, selectedPdfTitle: pdfTitle } = usePdf();
  const { userRole } = useAuth();

  // WebSocket configuration
  const getWebSocketUrl = () => {
    try {
      const env = (import.meta as any).env;
      if (env && env.VITE_WS_BASE_URL) {
        return env.VITE_WS_BASE_URL;
      }
    } catch {
      // Fallback
    }
    return "wss://nonzealous-vectorially-adolfo.ngrok-free.dev/ws/";
  };
  const WS_URL = getWebSocketUrl();
  const clientId = useRef(`client_${Math.random().toString(36).substr(2, 9)}`);

  // State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "ai",
      content:
        "Hello! I'm your AI Tuition Master. How can I help you learn today?",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isChatAreaVisible, setIsChatAreaVisible] = useState(() =>
    JSON.parse(localStorage.getItem("chatVisible") || "true")
  );
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [audioStatus, setAudioStatus] = useState("");

  // WebSocket and Audio refs
  const wsRef = useRef<WebSocket | null>(null);
  const audioQueueRef = useRef<HTMLAudioElement[]>([]);
  const isPlayingAudioRef = useRef(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const wasAudioPlayingRef = useRef(false);
  const messageIdCounterRef = useRef(2);

  // WebSocket connection
  useEffect(() => {
    const connect = () => {
      const wsUrl = WS_URL + clientId.current;
      console.log("Connecting to:", wsUrl);

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        addSystemMessage("Connected to teaching agent!");
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleMessage(data);
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        addSystemMessage("Connection error occurred");
      };

      ws.onclose = () => {
        console.log("WebSocket closed");
        setIsConnected(false);
        addSystemMessage("Disconnected from server");

        // Attempt to reconnect after 3 seconds
        setTimeout(connect, 3000);
      };
    };

    connect();

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      cancelAllAudio();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("chatVisible", JSON.stringify(isChatAreaVisible));
  }, [isChatAreaVisible]);

  // Handle incoming messages
  const handleMessage = (data: any) => {
    console.log("Received message:", data.type);

    if (data.type === "response") {
      setIsTyping(false);
      addMessage("ai", data.response, data.mode);
      wasAudioPlayingRef.current = false;
    } else if (data.type === "audio") {
      handleAudio(data);
    } else if (data.type === "audio_error") {
      addSystemMessage(`Audio Error: ${data.message}`);
    } else if (data.type === "system") {
      addSystemMessage(data.message);
    } else if (data.type === "error") {
      setIsTyping(false);
      addSystemMessage(`Error: ${data.message}`);
    }
  };

  // Handle audio data
  const handleAudio = (data: any) => {
    try {
      // Decode base64 audio
      const audioData = atob(data.audio);
      const audioArray = new Uint8Array(audioData.length);
      for (let i = 0; i < audioData.length; i++) {
        audioArray[i] = audioData.charCodeAt(i);
      }

      // Create blob and audio element
      const blob = new Blob([audioArray], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);

      // Add to queue
      audioQueueRef.current.push(audio);
      console.log("Audio queued. Queue length:", audioQueueRef.current.length);

      // Play if not already playing
      if (!isPlayingAudioRef.current) {
        playNextAudio();
      }
    } catch (error) {
      console.error("Error handling audio:", error);
      addSystemMessage("Error processing audio");
    }
  };

  // Play next audio in queue
  const playNextAudio = () => {
    if (audioQueueRef.current.length === 0) {
      isPlayingAudioRef.current = false;
      setAudioStatus("");
      return;
    }

    isPlayingAudioRef.current = true;
    setAudioStatus("🔊 Playing...");

    const audio = audioQueueRef.current.shift();
    if (!audio) return;

    currentAudioRef.current = audio;

    audio.onended = () => {
      console.log("Audio finished");
      URL.revokeObjectURL(audio.src);
      currentAudioRef.current = null;
      playNextAudio();
    };

    audio.onerror = (e) => {
      console.error("Audio playback error:", e);
      URL.revokeObjectURL(audio.src);
      setAudioStatus("❌ Playback error");
      currentAudioRef.current = null;
      playNextAudio();
    };

    audio.play().catch((error) => {
      console.error("Error playing audio:", error);
      URL.revokeObjectURL(audio.src);
      setAudioStatus("❌ Playback failed");
      currentAudioRef.current = null;
      playNextAudio();
    });
  };

  // Cancel all audio playback
  const cancelAllAudio = () => {
    wasAudioPlayingRef.current =
      isPlayingAudioRef.current ||
      audioQueueRef.current.length > 0 ||
      currentAudioRef.current !== null;

    // Stop current audio if playing
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      if (currentAudioRef.current.src) {
        URL.revokeObjectURL(currentAudioRef.current.src);
      }
      currentAudioRef.current = null;
    }

    // Clear audio queue and revoke URLs
    audioQueueRef.current.forEach((audio) => {
      audio.pause();
      if (audio.src) {
        URL.revokeObjectURL(audio.src);
      }
    });
    audioQueueRef.current = [];

    // Reset state
    isPlayingAudioRef.current = false;
    setAudioStatus("");

    console.log(
      "All audio cancelled. Was playing:",
      wasAudioPlayingRef.current
    );
    return wasAudioPlayingRef.current;
  };

  // Add message to chat
  const addMessage = (
    role: "ai" | "user" | "system",
    content: string,
    mode?: string
  ) => {
    const newMessage: Message = {
      id: messageIdCounterRef.current++,
      role,
      content,
      mode,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    scrollToBottom();
  };

  // Add system message
  const addSystemMessage = (message: string) => {
    addMessage("system", message);
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    // Scroll will be handled by ScrollArea component
    setTimeout(() => {
      const scrollArea = document.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollArea) {
        scrollArea.scrollTop = scrollArea.scrollHeight;
      }
    }, 100);
  };

  const handleSendMessage = () => {
    const message = inputMessage.trim();
    if (
      !message ||
      !wsRef.current ||
      wsRef.current.readyState !== WebSocket.OPEN
    ) {
      return;
    }

    // Cancel any playing audio before sending new message
    const audioWasPlaying = cancelAllAudio();

    // Add user message to chat
    addMessage("user", message);

    // Send to server with flag indicating if audio was interrupted
    wsRef.current.send(
      JSON.stringify({
        type: "message",
        content: message,
        audio_interrupted: audioWasPlaying,
      })
    );

    // Clear input and show typing indicator
    setInputMessage("");
    setIsTyping(true);
  };

  return (
    <div className="h-screen bg-paper flex flex-col overflow-hidden">
      <PageHeader
        title="AI Tuition Master"
        subtitle="Your personal AI tutor"
        showBackButton={true}
        backRoute="/student/class-notes"
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
            <div className="flex-1 overflow-hidden bg-gray-100">
              {pdfUrl && (
                <iframe
                  src={`https://docs.google.com/viewer?url=${encodeURIComponent(
                    pdfUrl
                  )}&embedded=true`}
                  className="w-full h-full border-0"
                  title={pdfTitle || "PDF Document"}
                  style={{ minHeight: "100%" }}
                  allow="fullscreen"
                />
              )}
            </div>
          </div>
        )}

        {/* Chat Area - 65% Right (hidden when isChatAreaVisible is false) */}
        {isChatAreaVisible ? (
          <div
            className={`${
              pdfUrl ? "max-h-screen flex-[0_0_65%]" : "mx-auto px-6 max-w-4xl"
            } flex flex-col min-w-0 transition-all duration-300 bg-paper relative`}
          >
            <div
              className={`flex-1 flex flex-col gap-2 ${
                pdfUrl ? "px-6 py-6" : "py-6"
              } overflow-hidden`}
            >
              {/* Chalkboard - AI Messages */}
              <Card className="h-[50vh] max-w-3xl mb-2 mx-auto chalkboard overflow-hidden flex flex-col">
                <CardContent className="p-6 flex-1 overflow-hidden flex flex-col">
                  <ScrollArea className="flex-1 overflow-y-auto">
                    <div className="space-y-4 chalkboard-text">
                      {messages
                        .filter(
                          (msg) => msg.role === "ai" || msg.role === "system"
                        )
                        .map((msg) => (
                          <div
                            key={msg.id}
                            className={`mb-4 ${
                              msg.role === "system"
                                ? "text-center text-sm opacity-70 italic"
                                : ""
                            }`}
                          >
                            {msg.mode && msg.role !== "system" && (
                              <div className="text-xs opacity-70 mb-1">
                                Mode: {msg.mode}
                              </div>
                            )}
                            <div className="whitespace-pre-wrap">
                              {msg.content}
                            </div>
                            {msg.timestamp && msg.role !== "system" && (
                              <div className="text-xs opacity-50 mt-2">
                                {msg.timestamp}
                              </div>
                            )}
                          </div>
                        ))}
                      {isTyping && (
                        <div className="flex gap-2 items-center">
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                          <div
                            className="w-2 h-2 bg-current rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                          <div
                            className="w-2 h-2 bg-current rounded-full animate-bounce"
                            style={{ animationDelay: "0.4s" }}
                          />
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card className="h-[25vh] w-lg mb-4 ml-auto overflow-hidden flex flex-col mt-4">
                <CardContent className="p-4 flex-1 overflow-hidden flex flex-col">
                  <ScrollArea className="flex-1 overflow-y-auto">
                    <div className="space-y-4">
                      {messages
                        .filter((msg) => msg.role === "user")
                        .map((msg) => (
                          <div key={msg.id} className="text-right">
                            <div className="inline-block bg-primary/10 px-4 py-2 rounded-lg">
                              {msg.content}
                            </div>
                            {msg.timestamp && (
                              <div className="text-xs opacity-50 mt-1">
                                {msg.timestamp}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Input Area */}
              <Card className="shadow-lg border-0">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Input
                      placeholder="Ask me anything about your lessons..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && !e.shiftKey && handleSendMessage()
                      }
                      className="flex-1 border-0 bg-muted focus-visible:ring-0"
                      disabled={!isConnected}
                    />
                    <Button
                      onClick={handleSendMessage}
                      size="icon"
                      className="shrink-0"
                      disabled={!isConnected || !inputMessage.trim()}
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
