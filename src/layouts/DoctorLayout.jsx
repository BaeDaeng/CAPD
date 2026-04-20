import React, { useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import useAppStore from '../store/useAppStore';

export default function DoctorLayout() {
  const { user, logout } = useAppStore();
  const navigate = useNavigate();

  // 상태 관리: 좌측 탭, 정렬
  const [patientTab, setPatientTab] = useState('today'); // 'today' | 'all'
  const [sortBy, setSortBy] = useState('name'); // 'name' | 'age'

  // 상태 관리: 실제 캘린더 동작용
  const [currentDate, setCurrentDate] = useState(new Date()); // 달력 이동용 기준 날짜
  const [selectedDate, setSelectedDate] = useState(new Date()); // 사용자가 클릭한 날짜

  // 하드코딩 - 나중에 API 연결
  const patients = [
    { id: 'P007', name: '김환자', age: 62, sex: 'M', time: '09:30', status: 'waiting',  lastDialysis: '2026.04.15 12:00'},
    { id: 'P008', name: '이환자', age: 45, sex: 'F', time: '10:00', status: 'done', lastDialysis: '2026.04.15 12:00'},
    { id: 'P009', name: '박환자', age: 71, sex: 'M', time: '10:30', status: 'waiting', lastDialysis: '2026.04.15 12:00' },
  ];

  // 예약 현황 데이터 (이동할 환자 ID 추가)
  const scheduledPatients = [
    { id: 'P011', time: '14:00', name: '최철수' },
    { id: 'P012', time: '15:30', name: '이순자' },
    { id: 'P013', time: '16:00', name: '정미숙' },
  ];

  // 캘린더 로직 헬퍼 함수
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // 이번 달의 총 일수
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 이번 달 1일의 요일 (0: 일요일 ~ 6: 토요일)

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden font-sans text-slate-900">
      
      {/* 상단 헤더 */}
      <header className="h-14 bg-slate-900 text-white px-4 flex justify-between items-center z-30 shrink-0 shadow-lg">
        <Link to="/doctor" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold text-white text-xl">✚</div>
          <div className="text-lg font-bold tracking-tight">
            CAPD <span className="font-light text-slate-400">EMR System</span>
          </div>
        </Link>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-200">{user?.name || '담당의'} 선생님</span>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          </div>
          <button onClick={handleLogout} className="text-xs text-slate-400 hover:text-white border border-slate-700 px-3 py-1 rounded-md transition-all">
            로그아웃
          </button>
        </div>
      </header>

      {/* 메인 바디 */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* 좌측: 환자 리스트 사이드바 */}
        <aside className="w-72 bg-white border-r border-gray-200 flex flex-col shrink-0 z-20 shadow-sm">
          <div className="p-3 border-b space-y-3 bg-slate-50">
            <div className="flex bg-gray-200 p-1 rounded-lg">
              <button 
                onClick={() => setPatientTab('today')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${patientTab === 'today' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
              >
                오늘 진료
              </button>
              <button 
                onClick={() => setPatientTab('all')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${patientTab === 'all' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
              >
                환자 목록
              </button>
            </div>
            <div className="flex justify-between items-center px-1">
              <span className="text-[11px] font-bold text-gray-400">PATIENT LIST</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="text-[11px] bg-transparent font-bold text-blue-600 cursor-pointer outline-none"
              >
                <option value="name">이름순</option>
                <option value="age">나이순</option>
              </select>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {patients.map((p) => (
              <button 
                key={p.id}
                onClick={() => navigate(`/doctor/${p.id}`)}
                className="w-full text-left p-3 rounded-xl border border-transparent hover:border-blue-100 hover:bg-blue-50 transition-all group"
              >
                <div className="flex justify-between items-start">
                  <span className="font-bold text-gray-800">{p.name}</span>
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono">{p.id}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">{p.sex}/{p.age}세</span>
                    <span className="text-[11px] text-gray-500">최근: {p.lastDialysis}</span>
                  </div>
                  <span className={`text-[11px] font-bold ${p.status === 'waiting' ? 'text-orange-500' : 'text-gray-400'}`}>
                    {p.status === 'waiting' ? `대기 (${p.time})` : '진료완료'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* [중앙] 메인 작업 영역 */}
        <main className="flex-1 overflow-y-auto bg-slate-50 relative">
          <Outlet />
        </main>

        {/* [우측] 진료 예약/스케줄 사이드바 */}
        <aside className="w-80 bg-white border-l border-gray-200 flex flex-col shrink-0 z-10">
          
          {/* 상단: 캘린더 위젯 (동적 구현) */}
          <div className="p-4 border-b">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm text-gray-700">{year}년 {month + 1}월</h3>
              <div className="flex gap-2">
                <button onClick={handlePrevMonth} className="text-gray-400 hover:text-gray-600 px-1">◀</button>
                <button onClick={handleNextMonth} className="text-gray-400 hover:text-gray-600 px-1">▶</button>
              </div>
            </div>
            
            {/* 달력 그리드 */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {['일','월','화','수','목','금','토'].map(d => (
                <span key={d} className="text-[10px] font-bold text-gray-400 mb-2">{d}</span>
              ))}
              
              {/* 1일 이전의 빈 칸 채우기 */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`blank-${i}`} className="h-8"></div>
              ))}
              
              {/* 실제 날짜 렌더링 */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
                const hasAppointment = day % 4 === 0; // 예시용 예약 있는 날짜 점 표시

                return (
                  <div 
                    key={day} 
                    onClick={() => setSelectedDate(new Date(year, month, day))}
                    className={`h-8 flex flex-col items-center justify-center text-[11px] rounded-md cursor-pointer hover:bg-blue-50 transition-colors ${
                      isSelected ? 'bg-blue-600 text-white font-bold shadow-md hover:bg-blue-700' : 'text-gray-700'
                    }`}
                  >
                    {day}
                    {hasAppointment && (
                      <span className={`w-1 h-1 rounded-full mt-0.5 ${isSelected ? 'bg-white' : 'bg-blue-400'}`}></span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 중단: 선택한 날의 예약 리스트 */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b flex justify-between items-center">
              <span className="text-xs font-bold text-gray-600">{selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일 예약 현황</span>
              <span className="text-xs text-blue-600 font-bold">{scheduledPatients.length}건</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {scheduledPatients.map((sch) => (
                <div key={sch.id} className="flex gap-3 items-start border-l-2 border-blue-200 pl-3 py-1">
                  <span className="text-xs font-bold text-gray-400 w-10 mt-0.5">{sch.time}</span>
                  <div>
                    {/* 환자 이름 클릭 시 해당 환자 인사이트 페이지로 이동 */}
                    <button 
                      onClick={() => navigate(`/doctor/${sch.id}`)}
                      className="text-sm font-bold text-gray-800 hover:text-blue-600 hover:underline text-left transition-colors"
                    >
                      {sch.name} 환자
                    </button>
                    <div className="text-[10px] text-gray-500 font-mono mt-0.5">{sch.id}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 하단: 현재 기준 다음 진료 알림 */}
          <div className="p-4 bg-slate-900 text-white rounded-t-3xl shadow-2xl relative z-20">
            <div className="text-[10px] font-bold text-blue-400 mb-1 uppercase tracking-widest">Upcoming Next</div>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-lg font-black">14:00 <span className="text-sm font-normal text-slate-400">최철수 환자</span></div>
                <div className="text-xs text-slate-400 mt-1">대기실에서 준비 중입니다.</div>
              </div>
              {/* ▶ 버튼 클릭 시 해당 환자(최철수, P011) 인사이트 페이지로 이동 */}
              <button 
                onClick={() => navigate('/doctor/P011')}
                className="bg-blue-600 p-3 rounded-full hover:bg-blue-500 transition-colors shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center"
              >
                ▶
              </button>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}