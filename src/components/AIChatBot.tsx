import React, { useState, useRef, useEffect } from 'react';
import { X, Bot } from 'lucide-react';

// 메시지 객체 타입을 정의합니다.
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

interface ChatWindowProps {
  messages: Message[];
  onSend: (text: string) => void;
  onClose: () => void;
}

/**
 * 챗봇 창 컴포넌트 (UI 분리)
 */
const ChatWindow = ({ messages, onSend, onClose }: ChatWindowProps) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null); // 타입 명시

  // 새 메시지가 오면 항상 맨 아래로 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-24 right-8 w-96 h-[600px] bg-[#2C2C3A] rounded-2xl shadow-2xl flex flex-col border-2 border-[#3A3A4A] z-40">
      {/* 1. 헤더 */}
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

      {/* 2. 메시지 영역 */}
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
        {/* 스크롤을 위한 빈 div */}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. 입력 영역 */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-[#3A3A4A] relative"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지 입력..."
          className="w-full px-4 py-2 pr-12 bg-[#1E1E2E] text-primary-text rounded-full border border-gray-600 focus:outline-none focus:border-accent-primary1"
        />
      </form>
    </div>
  );
};

/**
 * 메인 챗봇 컴포넌트 (상태 관리)
 */
export default function AIChatBot() {
  // 1. 챗봇창 열림/닫힘 상태
  const [isOpen, setIsOpen] = useState(false);

  // 2. 채팅 메시지 목록 상태
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "안녕하세요! 'Hack n Learn'의 AI 코치 'n'입니다. 무엇을 도와드릴까요?",
      sender: 'bot',
    },
  ]);

  // 3. 메시지 전송 핸들러
  const handleSend = (text: string) => {
    // 사용자 메시지 추가
    const newUserMessage: Message = {
      id: messages.length + 1,
      text,
      sender: 'user',
    };
    setMessages((prev) => [...prev, newUserMessage]);

    // (시뮬레이션) 봇 응답
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: `'${text}'에 대한 힌트를 검색 중입니다...`,
        sender: 'bot',
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <>
      {/* 챗봇 창 (isOpen이 true일 때만 렌더링) */}
      {isOpen && (
        <ChatWindow
          messages={messages}
          onSend={handleSend}
          onClose={() => setIsOpen(false)}
        />
      )}

      {/* 챗봇 토글 버튼 (기존 코드 활용) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        // z-index로 항상 위에, transition으로 부드러운 효과 추가
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
