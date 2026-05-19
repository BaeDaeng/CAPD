import React, { useEffect, useRef, useState } from 'react';

export default function DoctorChatPage({ currentPatient }) {
  // 챗봇 패널 열림/닫힘 상태 관리
  const [isOpen, setIsOpen] = useState(false);

  // 의사 챗봇 대화 메시지 상태 관리
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: '안녕하세요. 환자 기록, 설문, 예약 정보를 바탕으로 진료에 필요한 내용을 도와드릴게요.',
    },
  ]);

  // 입력창 상태 관리
  const [inputValue, setInputValue] = useState('');

  // 메시지 자동 스크롤 참조
  const messagesEndRef = useRef(null);

  // 현재 선택 환자 여부에 따라 챗봇 컨텍스트 문구 구성
  const contextLabel = currentPatient
    ? `${currentPatient.name} 환자 컨텍스트`
    : '전체 진료 컨텍스트';

  const contextDescription = currentPatient
    ? `${currentPatient.sex}/${currentPatient.age}세 · 최근 기록 ${currentPatient.lastDialysis}`
    : '담당 환자, 예약, 설문 데이터를 기준으로 대화합니다.';

  // 메시지가 추가될 때마다 하단으로 스크롤하는 기능
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // 챗봇 패널 열기/닫기 기능
  const handleToggleChat = () => {
    setIsOpen(prev => !prev);
  };

  // 의사 질문 전송 기능
  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputValue,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // TODO: 백엔드 의사용 챗봇 API 연결
    // 예시 요청 데이터:
    // {
    //   message: inputValue,
    //   patientId: currentPatient?.id || null,
    //   contextType: currentPatient ? 'patient' : 'global'
    // }
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: currentPatient
          ? `${currentPatient.name} 환자의 기록, 설문, 예약 정보를 기반으로 답변이 생성될 예정입니다.`
          : '전체 담당 환자, 예약, 설문 데이터를 기반으로 답변이 생성될 예정입니다.',
      };

      setMessages(prev => [...prev, botMessage]);
    }, 700);
  };

  return (
    <div className="relative">
      {/* 챗봇 진입 버튼 영역 */}
      <button
        type="button"
        onClick={handleToggleChat}
        className="w-full rounded-t-3xl bg-slate-900 px-4 py-4 text-left text-white shadow-2xl transition-all hover:bg-slate-800 active:scale-[0.99]"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-blue-400">
              Doctor Assistant
            </div>
            <div className="mt-1 text-lg font-black">AI 진료 도우미</div>
            <div className="mt-1 text-xs font-medium text-slate-400">
              환자 기록, 설문, 예약을 바탕으로 질문
            </div>
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-black shadow-lg">
            AI
          </div>
        </div>
      </button>

      {/* 오른쪽 사이드바 위로 뜨는 챗봇 패널 */}
      {isOpen && (
        <section className="absolute bottom-full right-0 z-40 mb-3 flex h-130 w-90 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
          {/* 챗봇 패널 상단 헤더 */}
          <div className="shrink-0 border-b border-slate-100 bg-slate-900 px-4 py-4 text-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-blue-300">
                  AI 진료 도우미
                </div>
                <h2 className="mt-1 text-base font-black">{contextLabel}</h2>
                <p className="mt-1 text-xs font-medium leading-relaxed text-slate-400">
                  {contextDescription}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sm font-black text-slate-300 transition-colors hover:bg-white/20 hover:text-white"
              >
                X
              </button>
            </div>
          </div>

          {/* 현재 대화 컨텍스트 요약 영역 */}
          <div className="shrink-0 border-b border-slate-100 bg-blue-50 px-4 py-3">
            <div className="text-[10px] font-black text-blue-600">현재 참조 범위</div>
            <div className="mt-1 text-xs font-bold leading-relaxed text-blue-800">
              {currentPatient
                ? `${currentPatient.name} 환자의 기록, 설문, 예약 정보를 우선 참조합니다.`
                : '특정 환자 선택 없이 전체 담당 환자 흐름을 참조합니다.'}
            </div>
          </div>

          {/* 메시지 목록 영역 */}
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-slate-50/70 p-4 custom-scrollbar">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'bot' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-[10px] font-black text-white">
                    AI
                  </div>
                )}

                <div
                  className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm font-medium leading-relaxed shadow-sm ${
                    message.sender === 'user'
                      ? 'rounded-br-none bg-blue-600 text-white'
                      : 'rounded-bl-none border border-slate-100 bg-white text-slate-700'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* 메시지 입력 영역 */}
          <form onSubmit={handleSendMessage} className="shrink-0 border-t border-slate-100 bg-white p-3">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={currentPatient ? `${currentPatient.name} 환자에 대해 질문` : '전체 진료 흐름에 대해 질문'}
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
              />

              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="shrink-0 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-black text-white transition-colors hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                전송
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
