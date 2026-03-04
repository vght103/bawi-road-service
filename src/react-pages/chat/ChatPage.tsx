import { useState, useEffect, useRef, useCallback } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { MessageCircle } from "lucide-react";
import { createIsland } from "@/lib/createIsland";
import type { ChatMessage, CtaButtonData, SSEEvent, AcademyCardData } from "@/types/chat";
import { sendChatStream, loadChatSession, trackCtaClick } from "@/api/chat/chatApi";
import ChatHeader from "./components/ChatHeader";
import AiDisclaimer from "./components/AiDisclaimer";
import MessageBubble from "./components/MessageBubble";
import ChatInput from "./components/ChatInput";

const SESSION_KEY = "bawi_chat_session_id";

const STATIC_CTA: CtaButtonData[] = [
  { label: "무료 견적 받기", link: "/quote?from=chatbot-fixed" },
  { label: "1:1 상담 신청", link: "/inquiry?from=chatbot-fixed" },
];

const TURNSTILE_SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? "";

function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);
  const prevMessageLenRef = useRef(0);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const pendingInitialQuery = useRef<string | null>(null);

  // Restore session from DB or handle ?q= query
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const searchParams = new URLSearchParams(window.location.search);
    const initialQuery = searchParams.get("q");

    if (initialQuery) {
      // New conversation from home page — clear any stale session
      sessionStorage.removeItem(SESSION_KEY);
      // Remove ?q= from URL without adding a history entry
      window.history.replaceState(null, "", "/chat");
      // Turnstile 토큰이 준비되면 자동 전송 (pendingInitialQuery 패턴)
      pendingInitialQuery.current = initialQuery;
      return;
    }

    // Try to restore an existing session
    const savedSessionId = sessionStorage.getItem(SESSION_KEY);
    if (savedSessionId) {
      restoreSession(savedSessionId);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function restoreSession(savedSessionId: string) {
    const { data } = await loadChatSession(savedSessionId);
    if (data?.messages && data.messages.length > 0) {
      setSessionId(savedSessionId);
      setMessages(
        data.messages.map((msg) => ({
          id: crypto.randomUUID(),
          role: msg.role,
          content: msg.content,
          components: msg.components,
          timestamp: new Date(msg.timestamp),
        }))
      );
    } else {
      // Session not found or empty — clear storage
      sessionStorage.removeItem(SESSION_KEY);
    }
  }

  const handleSendWithValue = useCallback(
    async (value: string) => {
      if (!value.trim() || isLoading) return;
      if (TURNSTILE_SITE_KEY && !turnstileToken) return;

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: value.trim(),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
      setIsLoading(true);

      // Create a placeholder AI message for streaming
      const aiMessageId = crypto.randomUUID();
      const aiMessage: ChatMessage = {
        id: aiMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      // Snapshot current messages + new user message for API payload
      const apiMessages = [...messages, userMessage].map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const { error } = await sendChatStream(
        {
          session_id: sessionId ?? undefined,
          messages: apiMessages,
          turnstile_token: turnstileToken ?? "",
        },
        (event: SSEEvent) => {
          switch (event.type) {
            case "text":
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === aiMessageId
                    ? { ...msg, content: msg.content + event.content }
                    : msg
                )
              );
              break;
            case "components":
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === aiMessageId
                    ? {
                        ...msg,
                        components: [
                          ...(msg.components ?? []),
                          {
                            type: "academy_cards" as const,
                            data: event.data as AcademyCardData[],
                          },
                        ],
                      }
                    : msg
                )
              );
              break;
            case "cta":
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === aiMessageId
                    ? {
                        ...msg,
                        components: [
                          ...(msg.components ?? []),
                          { type: "cta_button" as const, data: event.data },
                        ],
                      }
                    : msg
                )
              );
              break;
            case "done":
              if (event.session_id) {
                setSessionId(event.session_id);
                sessionStorage.setItem(SESSION_KEY, event.session_id);
              }
              break;
          }
        }
      );

      if (error) {
        // Replace placeholder content with the error message
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId ? { ...msg, content: error } : msg
          )
        );
      }

      setIsLoading(false);
      // Turnstile 토큰은 1회용 — 전송 후 리셋
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    },
    [isLoading, messages, sessionId, turnstileToken]
  );

  // Turnstile 토큰 준비 시 대기 중인 초기 쿼리 자동 전송
  useEffect(() => {
    if (turnstileToken && pendingInitialQuery.current) {
      const query = pendingInitialQuery.current;
      pendingInitialQuery.current = null;
      handleSendWithValue(query);
    }
  }, [turnstileToken, handleSendWithValue]);

  function handleSend() {
    handleSendWithValue(inputValue);
  }

  useEffect(() => {
    if (messages.length > 0 && messages.length !== prevMessageLenRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMessageLenRef.current = messages.length;
  }, [messages]);

  const lastMessage = messages[messages.length - 1];
  const isWaitingForFirstToken =
    isLoading &&
    lastMessage?.role === "assistant" &&
    lastMessage?.content === "";

  return (
    <div className="min-h-dvh bg-cream flex flex-col">
      <ChatHeader />
      <div className="pt-14">
        <AiDisclaimer />
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-32">
        <div className="max-w-[720px] mx-auto flex flex-col gap-4">
          {messages.map((message, index) => {
            // Hide the empty placeholder AI message while waiting for the first
            // token — the bounce dots below replace it visually.
            if (
              isLoading &&
              message.role === "assistant" &&
              message.content === "" &&
              index === messages.length - 1
            ) {
              return null;
            }
            return (
              <MessageBubble
                key={message.id}
                message={message}
                onCtaClick={(ctaType) => trackCtaClick(sessionId, ctaType, "chatbot-message")}
              />
            );
          })}

          {isWaitingForFirstToken && (
            <div className="flex gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-terracotta to-amber-400 flex items-center justify-center shrink-0">
                <MessageCircle
                  size={14}
                  strokeWidth={2.5}
                  className="text-white"
                />
              </div>
              <div>
                <span className="text-[0.75rem] font-semibold text-brown mb-1 block">
                  AI 상담
                </span>
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 border border-beige-dark inline-flex gap-1.5">
                  <span className="w-2 h-2 bg-brown-light rounded-full animate-bounce" />
                  <span
                    className="w-2 h-2 bg-brown-light rounded-full animate-bounce"
                    style={{ animationDelay: "0.15s" }}
                  />
                  <span
                    className="w-2 h-2 bg-brown-light rounded-full animate-bounce"
                    style={{ animationDelay: "0.3s" }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>
      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSend}
        disabled={isLoading || (!!TURNSTILE_SITE_KEY && !turnstileToken)}
        ctaButtons={STATIC_CTA}
        onCtaClick={(ctaType) => trackCtaClick(sessionId, ctaType, "chatbot-fixed")}
      />
      {TURNSTILE_SITE_KEY && (
        <Turnstile
          ref={turnstileRef}
          siteKey={TURNSTILE_SITE_KEY}
          options={{ size: "invisible" }}
          onSuccess={setTurnstileToken}
        />
      )}
    </div>
  );
}

export default createIsland(ChatPage);
