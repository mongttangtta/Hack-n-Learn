import React, { useState, useRef, useEffect } from 'react';
import { X, Bot } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore'; // authStore 임포트

// 메시지 객체 타입 정의
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

interface ChatWindowProps {
  messages: Message[];
  onSend: (text: string) => void;
  onClose: () => void;
  isLoading: boolean;
}

/**
 * 챗봇 창 컴포넌트 (UI)
 */
const ChatWindow = ({
  messages,
  onSend,
  onClose,
  isLoading,
}: ChatWindowProps) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // 메시지 추가 시 스크롤 하단 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-24 right-8 w-96 h-[600px] bg-[#2C2C3A] rounded-2xl shadow-2xl flex flex-col border-2 border-[#3A3A4A] z-40">
      {/* 헤더 */}
      <div className="flex justify-between items-center p-4 border-b border-[#3A3A4A]">
        <h3 className="text-primary-text font-bold text-lg flex items-center ">
          AI Coach
          <p className="text-accent-primary2 ml-2">'n'</p>
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-primary-text"
        >
          <X size={20} />
        </button>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg: Message) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'justify-end' : ''
            }`}
          >
            {msg.sender === 'bot' && (
              <div className="flex-shrink-0 p-2 bg-[#1E1E2E] rounded-full">
                <Bot className="w-5 h-5 text-accent-primary2" />
              </div>
            )}
            <div
              className={`max-w-xs p-3 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-primary-text'
                  : 'bg-[#3A3A4A] text-primary-text'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* 로딩 표시 */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 p-2 bg-[#1E1E2E] rounded-full">
              <Bot className="w-5 h-5 text-accent-primary2" />
            </div>
            <div className="bg-[#3A3A4A] text-primary-text p-3 rounded-lg">
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-[#3A3A4A] relative"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isLoading ? '답변을 생성 중입니다...' : '메시지 입력...'}
          disabled={isLoading}
          className="w-full px-4 py-2 pr-12 bg-[#1E1E2E] text-primary-text rounded-full border border-gray-600 focus:outline-none focus:border-accent-primary1 disabled:opacity-50"
        />
      </form>
    </div>
  );
};

/**
 * 메인 챗봇 컴포넌트 (로직 관리)
 */
export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);

  // useAuthStore에서 현재 로그인한 유저 정보 가져오기
  const { user } = useAuthStore(); //

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "안녕하세요! 'Hack n Learn'의 AI 코치 'n'입니다. 무엇을 도와드릴까요?",
      sender: 'bot',
    },
  ]);

  const handleSend = async (text: string) => {
    // 1. 사용자 메시지 즉시 화면에 표시
    const userMsg: Message = { id: Date.now(), text, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // 2. 요청 데이터 구성 (message, threadId, userId)
      const requestData: {
        message: string;
        threadId?: string;
        userId?: string;
      } = {
        message: text,
      };

      // 스레드 ID가 있으면 추가
      if (threadId) {
        requestData.threadId = threadId;
      }

      // 로그인한 유저가 있으면 userId 추가
      if (user && user.id) {
        requestData.userId = user.id;
        console.log(user.id);
      }

      // 3. API 호출
      const response = await axios.post('/api/chatbot/ask', requestData);

      // 4. 응답 처리
      const { success, data } = response.data;

      if (success && data) {
        const botMsg: Message = {
          id: Date.now() + 1,
          text: data.answer,
          sender: 'bot',
        };
        setMessages((prev) => [...prev, botMsg]);

        // threadId 업데이트 (대화 맥락 유지)
        if (data.threadId) {
          setThreadId(data.threadId);
        }
      }
    } catch (error) {
      console.error('Chatbot API Error:', error);
      const errorMsg: Message = {
        id: Date.now() + 1,
        text: '오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        sender: 'bot',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <ChatWindow
          messages={messages}
          onSend={handleSend}
          onClose={() => setIsOpen(false)}
          isLoading={isLoading}
        />
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-50 bg-card-background border-2 border-edge w-[70px] h-[70px] rounded-[20px] flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 hover:border-accent-primary2"
      >
        <h1 className="text-accent-primary2 font-bold mr-2 mb-2 relative text-h1">
          'n{''}
          <div className="absolute -right-[10px] top-6">'</div>
        </h1>
      </button>
    </>
  );
}
