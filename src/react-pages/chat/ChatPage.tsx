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

const SESSION_KEY = "bawi_chat_session_id"; // 세션 스토리지에 채팅 세션 ID를 저장하는 키

// 입력창 위에 항상 표시되는 고정 CTA 버튼 목록
const STATIC_CTA: CtaButtonData[] = [
  { label: "무료 견적 받기", link: "/quote?from=chatbot-fixed" },
  { label: "1:1 상담 신청", link: "/inquiry?from=chatbot-fixed" },
];

const TURNSTILE_SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? ""; // Cloudflare Turnstile 사이트 키

// AI 상담 채팅 페이지
// SSE 스트리밍, Turnstile 봇 방지, 세션 스토리지 대화 이력 유지
function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null); // 서버 대화 이력 식별자
  const [isLoading, setIsLoading] = useState(false); // AI 응답 스트리밍 중 여부
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null); // 자동 스크롤 앵커
  const hasInitialized = useRef(false); // React Strict Mode 이중 실행 방지
  const prevMessageLenRef = useRef(0); // 새 메시지 추가 시에만 스크롤하기 위해 이전 메시지 수 기억
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null); // 1회용 봇 방지 토큰
  const turnstileRef = useRef<TurnstileInstance | null>(null); // 위젯 리셋 제어용
  const pendingInitialQuery = useRef<string | null>(null); // Turnstile 토큰 준비 전까지 대기하는 초기 질문

  // 최초 마운트: ?q= 초기 질문 처리 또는 기존 세션 복원
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const searchParams = new URLSearchParams(window.location.search);
    const initialQuery = searchParams.get("q");

    if (initialQuery) {
      sessionStorage.removeItem(SESSION_KEY); // 홈에서 넘어온 경우 기존 세션 초기화
      window.history.replaceState(null, "", "/chat"); // URL에서 ?q= 제거
      pendingInitialQuery.current = initialQuery; // 토큰 준비 후 자동 전송
      return;
    }

    const savedSessionId = sessionStorage.getItem(SESSION_KEY);
    if (savedSessionId) {
      restoreSession(savedSessionId);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 기존 채팅 세션의 대화 이력을 서버에서 불러와 복원
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
      sessionStorage.removeItem(SESSION_KEY); // 세션 만료 또는 빈 경우 삭제
    }
  }

  // 메시지 전송 및 SSE 스트리밍 응답 처리
  // text: 텍스트 누적, components: 어학원 카드, cta: CTA 버튼, done: 세션 ID 저장
  const handleSendWithValue = useCallback(
    async (value: string) => {
      if (!value.trim() || isLoading) return;
      if (TURNSTILE_SITE_KEY && !turnstileToken) return; // 토큰 미준비 시 전송 불가

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: value.trim(),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
      setIsLoading(true);

      // AI 응답을 스트리밍으로 채울 빈 플레이스홀더
      const aiMessageId = crypto.randomUUID();
      const aiMessage: ChatMessage = {
        id: aiMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      // setState가 비동기이므로 스냅샷으로 직접 계산
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
              // 텍스트 청크가 도착할 때마다 플레이스홀더에 누적
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === aiMessageId
                    ? { ...msg, content: msg.content + event.content }
                    : msg
                )
              );
              break;
            case "components":
              // 추천 어학원 카드 데이터 추가
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
              // CTA 버튼 추가
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
              // 스트리밍 완료 시 세션 ID 저장
              if (event.session_id) {
                setSessionId(event.session_id);
                sessionStorage.setItem(SESSION_KEY, event.session_id);
              }
              break;
          }
        }
      );

      if (error) {
        // 오류 시 플레이스홀더를 오류 메시지로 교체
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId ? { ...msg, content: error } : msg
          )
        );
      }

      setIsLoading(false);
      turnstileRef.current?.reset(); // 토큰은 1회용 — 전송 후 리셋
      setTurnstileToken(null);
    },
    [isLoading, messages, sessionId, turnstileToken]
  );

  // Turnstile 토큰이 준비되면 대기 중인 초기 질문을 자동 전송
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

  // 새 메시지 추가 시에만 맨 아래로 자동 스크롤
  useEffect(() => {
    if (messages.length > 0 && messages.length !== prevMessageLenRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMessageLenRef.current = messages.length;
  }, [messages]);

  // AI의 빈 플레이스홀더 메시지인지 확인 (타이핑 애니메이션 표시 여부)
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

      {/* 메시지 목록 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-32">
        <div className="max-w-[720px] mx-auto flex flex-col gap-4">
          {messages.map((message, index) => {
            // 빈 AI 플레이스홀더는 렌더링하지 않음 (바운스 점 애니메이션이 대신)
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

          {/* AI 응답 대기 중: 바운스 점 세 개 애니메이션 */}
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
                {/* 순차적으로 튀기는 타이핑 애니메이션 */}
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

          <div ref={messagesEndRef} /> {/* 자동 스크롤 앵커 */}
        </div>
      </div>

      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSend}
        disabled={isLoading || (!!TURNSTILE_SITE_KEY && !turnstileToken)} // 토큰 미준비 시 비활성화
        ctaButtons={STATIC_CTA}
        onCtaClick={(ctaType) => trackCtaClick(sessionId, ctaType, "chatbot-fixed")}
      />

      {/* Cloudflare Turnstile 봇 방지 위젯 (invisible 모드) */}
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
