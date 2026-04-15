// 임시 페이지
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import useAppStore from '../../store/useAppStore';

export default function PatientDashboard() {
  const navigate = useNavigate();
  // Zustand 스토어에서 로그인한 환자 정보를 가져옵니다.
  const { user } = useAppStore(); 

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* 1. 환자 요약 정보 헤더 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            안녕하세요, <span className="text-blue-600">{user?.name || '김환자'}</span> 님!
          </h1>
          {/* 하드코딩된 예시 정보 - 나중에 API 데이터로 교체 */}
          <p className="text-gray-500 mt-1 font-medium">남자, 54세 | 담당의: 김의사 선생님</p>
        </div>
        <div className="mt-4 md:mt-0 md:text-right bg-slate-50 p-3 rounded-xl border border-gray-100">
          <div className="text-sm text-gray-500 font-semibold">마지막 투석 기록</div>
          <div className="font-bold text-gray-800 text-lg">오늘 오후 2:30 <span className="text-blue-600 text-sm ml-1">(2시간 전)</span></div>
        </div>
      </div>

      {/* 2. 주요 액션 버튼 (3개의 큰 핵심 기능) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 가장 중요한 기능이므로 Primary 컬러(Blue) 사용 */}
        <button
          onClick={() => navigate('/patient/survey')} // 임시로 survey로 연결
          className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-2xl shadow-sm transition-all flex flex-col items-center justify-center gap-3 group"
        >
          <div className="text-4xl group-hover:scale-110 transition-transform">📝</div>
          <div className="text-lg font-bold">투석 기록 입력</div>
          <div className="text-blue-200 text-sm font-medium">오늘의 투석/상태를 기록하기</div>
        </button>

        <button
          onClick={() => navigate('/patient/survey')}
          className="bg-white hover:bg-purple-50 border border-gray-200 text-gray-800 p-6 rounded-2xl shadow-sm transition-all flex flex-col items-center justify-center gap-3 group"
        >
          <div className="text-4xl group-hover:scale-110 transition-transform">🤖</div>
          <div className="text-lg font-bold text-purple-700">챗봇 증상 상담</div>
          <div className="text-gray-500 text-sm font-medium">증상을 설명해 진료에 도움받기</div>
        </button>

        <button
          onClick={() => navigate('/patient/survey')}
          className="bg-white hover:bg-emerald-50 border border-gray-200 text-gray-800 p-6 rounded-2xl shadow-sm transition-all flex flex-col items-center justify-center gap-3 group"
        >
          <div className="text-4xl group-hover:scale-110 transition-transform">📋</div>
          <div className="text-lg font-bold text-emerald-700">건강 설문 조사</div>
          <div className="text-gray-500 text-sm font-medium">진료전 설문조사를 통해 진료에 도움받기</div>
        </button>
      </div>

      {/* 3. 하단 정보 패널 (2단 그리드 구조) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* === 좌측 열 === */}
        <div className="space-y-6">
          <button
          onClick={() => navigate('/patient/survey')}
          className="bg-white hover:bg-purple-50 border border-gray-200 text-gray-800 p-6 rounded-2xl shadow-sm transition-all flex flex-col items-center justify-center gap-3 group"
        >
          <div className="text-4xl group-hover:scale-110 transition-transform">🤖</div>
          <div className="text-lg font-bold text-purple-700">투석 기록 보기</div>
          <div className="text-gray-500 text-sm font-medium">이전 기록을 목록/기간별로 확인하기</div>
        </button>

          
        </div>

        {/* === 우측 열 === */}
        <div className="space-y-6">
          <button
          onClick={() => navigate('/patient/survey')}
          className="bg-white hover:bg-purple-50 border border-gray-200 text-gray-800 p-6 rounded-2xl shadow-sm transition-all flex flex-col items-center justify-center gap-3 group"
        >
          <div className="text-4xl group-hover:scale-110 transition-transform">🤖</div>
          <div className="text-lg font-bold text-purple-700">방문 일정 확인하기</div>
          <div className="text-gray-500 text-sm font-medium">예정된 방문 일정을 확인하기</div>
        </button>

        </div>

      </div>
    </div>
  );
}