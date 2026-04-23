import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { patientsData } from '../../api/mockPatients';
import Sparkline from '../../components/Sparkline';

// 바로가기 버튼 아이콘 (SVG)
const ShortcutIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

export default function PatientInsightPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // 1. 환자 데이터 매칭
  const patient = patientsData.find(p => p.id === id) || patientsData[0];
  const history = patient.history; // index 0이 오늘, 29가 30일 전

  // 2. 상단 요약 데이터 추출 (오늘, 7일전, 30일전)
  const currentWeight = history[0].weight;
  const lastWeekWeight = history[7].weight;
  const weightDiff = (currentWeight - lastWeekWeight).toFixed(1);
  const isWeightDecreased = weightDiff <= 0;

  // 꺾은선 그래프용 데이터 (최근 7일치를 과거->현재 순으로 뒤집음)
  const weightHistory7Days = history.slice(0, 7).reverse().map(h => h.weight);
  const bpHistory7Days = history.slice(0, 7).reverse().map(h => h.bpSystolic);
  const ufHistory7Days = history.slice(0, 7).reverse().map(h => h.uf);

  // 최근 3일간의 하단 상세 표 데이터 추출
  const recent3DaysExchanges = [];
  for (let i = 0; i < 3; i++) {
    history[i].exchanges.forEach(ex => {
      recent3DaysExchanges.push({ dateStr: history[i].displayDate, ...ex });
    });
  }

  // AI 3일 평균 계산
  const avgUf3Days = Math.floor((history[0].uf + history[1].uf + history[2].uf) / 3);
  const weightDiff3Days = (history[0].weight - history[3].weight).toFixed(1);

  return (
    <div className="p-6 md:p-8 animate-in fade-in duration-500 h-full overflow-y-auto">

      {/* --- TOP: 4열 구조 --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        
        {/* 1. 환자 기본 정보 */}
        <div className="bg-slate-800 text-white p-5 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden">
          <button 
            onClick={() => navigate(`/doctor/${id}/info`)} 
            className="absolute top-5 right-5 text-gray-400 hover:text-blue-600 p-2 bg-slate-800 rounded-lg transition-colors z-20"
            title="환자 정보 보기"
          >
            <ShortcutIcon />
          </button>
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          <div className="flex items-center gap-3 mb-4 z-10">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold">
              {patient.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-black">{patient.name}</h2>
              <p className="text-xs text-slate-300 font-mono">{patient.id}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm z-10">
            <div className="text-slate-400">나이/성별</div><div className="font-medium text-right">{patient.age}세 / {patient.sex}</div>
            <div className="text-slate-400">투석 시작일</div><div className="font-medium text-right">{patient.capdStartDate}</div>
            <div className="text-slate-400">담당의</div><div className="font-medium text-right">{patient.doctor}</div>
          </div>
        </div>

        {/* 2. 체중 요약 */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between group">
          <div>
            <div className="text-sm font-bold text-gray-500 mb-2">최근 체중 (kg)</div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-3xl font-black text-gray-900">{currentWeight}</span>
              <span className={`text-sm font-bold mb-1 ${isWeightDecreased ? 'text-blue-500' : 'text-red-500'}`}>
                ({weightDiff > 0 ? '+' : ''}{weightDiff}kg)
              </span>
            </div>
            <div className="text-xs text-gray-400 font-medium">최초 투석 시: {history[29].weight} kg</div>
          </div>
          <div className="mt-4 flex flex-col items-end">
            <div className="text-[10px] text-gray-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">최근 7일</div>
            <Sparkline data={weightHistory7Days} color={isWeightDecreased ? '#3b82f6' : '#ef4444'} />
          </div>
        </div>

        {/* 3. 혈압 요약 */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between group">
          <div>
            <div className="text-sm font-bold text-gray-500 mb-2">최근 혈압 (mmHg)</div>
            <div className="text-3xl font-black text-gray-900 mb-4">{history[0].bp}</div>
          </div>
          <div className="mt-4 flex flex-col items-end">
            <div className="text-[10px] text-gray-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">최근 7일</div>
            <Sparkline data={bpHistory7Days} color="#8b5cf6" />
          </div>
        </div>

        {/* 4. 평균 제수량 요약 */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between group">
          <div>
            <div className="text-sm font-bold text-gray-500 mb-2">최근 평균 제수량 (mL)</div>
            <div className="text-3xl font-black text-blue-600 mb-4">+{history[0].uf}</div>
          </div>
          <div className="mt-4 flex flex-col items-end">
            <div className="text-[10px] text-gray-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">최근 7일</div>
            <Sparkline data={ufHistory7Days} color="#0ea5e9" />
          </div>
        </div>

      </div>

      {/* --- MIDDLE: 2열 구조 (차트, AI 분석) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* 5. 텍스트 겹침이 방지된 주요 활력 징후 및 제수량 혼합 그래프 */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative min-h-95 flex flex-col">
          <button 
            onClick={() => navigate(`/doctor/${id}/charts`)} 
            className="absolute top-5 right-5 text-gray-400 hover:text-blue-600 p-2 bg-slate-50 rounded-lg transition-colors z-20"
            title="차트 상세 보기"
          >
            <ShortcutIcon />
          </button>
          
          <h3 className="text-lg font-bold text-gray-800 mb-2">주요 활력 징후 및 제수량 추이</h3>
          
          {/* 차트 범례 */}
          <div className="flex gap-4 text-xs font-bold mb-4">
            <span className="flex items-center gap-1.5 text-purple-600"><div className="w-3 h-3 bg-purple-200 rounded-sm border border-purple-300"></div>체중 (kg)</span>
            <span className="flex items-center gap-1.5 text-red-500"><div className="w-3 h-1 bg-red-500 rounded-full"></div>수축기 혈압 (mmHg)</span>
            <span className="flex items-center gap-1.5 text-blue-500"><div className="w-3 h-1 bg-blue-500 rounded-full"></div>제수량 (mL)</span>
          </div>

          {/* SVG 혼합 차트 영역 */}
          <div className="flex-1 relative w-full h-full mt-4 min-h-62.5">
            {(() => {
              const chartData = history.slice(0, 7).reverse();
              
              const vW = 1000; 
              const vH = 240; 
              
              const minWeight = 40, maxWeight = 100;
              const minBp = 80, maxBp = 180;
              const minUf = 500, maxUf = 2500;

              const getX = (i) => (i / (chartData.length - 1)) * (vW - 100) + 50; 
              const getY = (val, min, max) => vH - ((val - min) / (max - min)) * vH;

              const bpPoints = chartData.map((d, i) => `${getX(i)},${getY(d.bpSystolic, minBp, maxBp)}`).join(' ');
              const ufPoints = chartData.map((d, i) => `${getX(i)},${getY(d.uf, minUf, maxUf)}`).join(' ');

              return (
                <svg viewBox={`0 0 ${vW} ${vH + 60}`} className="w-full h-full absolute inset-0 overflow-visible">
                  
                  {/* 배경 가이드라인 */}
                  {[0, 0.33, 0.66, 1].map(ratio => (
                    <line key={ratio} x1="0" y1={vH * ratio} x2={vW} y2={vH * ratio} stroke="#f1f5f9" strokeWidth="2" strokeDasharray={ratio !== 1 ? "6 6" : "0"} />
                  ))}

                  {/* 1. 체중 막대 그래프 (먼저 그려서 선 그래프 뒤에 깔리게 배치) */}
                  {chartData.map((d, i) => {
                    const safeWeight = Math.min(Math.max(d.weight, minWeight), maxWeight);
                    const barH = ((safeWeight - minWeight) / (maxWeight - minWeight)) * vH;
                    return (
                      <g key={`bar-${i}`} className="group cursor-pointer">
                        <rect x={getX(i) - 35} y={vH - barH} width="70" height={barH} rx="8" fill="#e9d5ff" className="group-hover:fill-[#d8b4fe] transition-colors" />
                        {/* X축 날짜 */}
                        <text x={getX(i)} y={vH + 40} textAnchor="middle" fill="#9ca3af" fontSize="15" fontWeight="bold">
                          {d.displayDate}
                        </text>
                      </g>
                    );
                  })}

                  {/* 2. 제수량 & 혈압 선 그래프 */}
                  <polyline points={ufPoints} fill="none" stroke="#3b82f6" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points={bpPoints} fill="none" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />

                  {/* 3. 점과 텍스트 (최상단 레이어로 올려서 겹침 방지 로직 적용) */}
                  {chartData.map((d, i) => {
                    const x = getX(i);
                    
                    const safeWeight = Math.min(Math.max(d.weight, minWeight), maxWeight);
                    const barH = ((safeWeight - minWeight) / (maxWeight - minWeight)) * vH;
                    
                    const weightY = vH - barH;
                    const ufY = getY(d.uf, minUf, maxUf);
                    const bpY = getY(d.bpSystolic, minBp, maxBp);

                    // 텍스트 기본 위치 설정 (체중:막대 위, 제수량:점 위, 혈압:점 아래)
                    let textY_weight = weightY - 12;
                    let textY_uf = ufY - 15;
                    let textY_bp = bpY + 25;

                    // [충돌 방지 1] 제수량과 혈압 점이 너무 가까울 경우 (위아래로 벌려줌)
                    if (Math.abs(textY_uf - textY_bp) < 24 || Math.abs(ufY - bpY) < 20) {
                      if (ufY < bpY) { 
                        // 제수량이 화면상 더 위쪽에 있을 때
                        textY_uf = ufY - 15;
                        textY_bp = bpY + 25;
                      } else {
                        textY_uf = ufY + 25;
                        textY_bp = bpY - 15;
                      }
                    }

                    // [충돌 방지 2] 체중 텍스트가 다른 선이나 텍스트와 겹칠 경우
                    if (Math.abs(textY_weight - textY_uf) < 20 || Math.abs(textY_weight - textY_bp) < 20) {
                      // 겹치면 체중 텍스트를 막대 그래프 안쪽으로 내림
                      textY_weight = weightY + 20; 
                    }

                    // [후광 효과] 글자 가독성을 위해 흰색 테두리 적용
                    const textStyle = { 
                      paintOrder: 'stroke', 
                      stroke: 'white', 
                      strokeWidth: 4, 
                      strokeLinecap: 'round', 
                      strokeLinejoin: 'round' 
                    };

                    return (
                      <g key={`points-text-${i}`}>
                        {/* 꺾은선 점(원) */}
                        <circle cx={x} cy={ufY} r="7" fill="#3b82f6" stroke="#fff" strokeWidth="3" className="hover:r-9 transition-all cursor-pointer" />
                        <circle cx={x} cy={bpY} r="7" fill="#ef4444" stroke="#fff" strokeWidth="3" className="hover:r-9 transition-all cursor-pointer" />
                        
                        {/* 체중 수치 텍스트 */}
                        <text x={x} y={textY_weight} textAnchor="middle" fill="#9333ea" fontSize="14" fontWeight="900" style={textStyle}>
                          {d.weight}
                        </text>
                        
                        {/* 제수량 수치 텍스트 */}
                        <text x={x} y={textY_uf} textAnchor="middle" fill="#2563eb" fontSize="14" fontWeight="900" style={textStyle}>
                          {d.uf}
                        </text>
                        
                        {/* 혈압 수치 텍스트 */}
                        <text x={x} y={textY_bp} textAnchor="middle" fill="#dc2626" fontSize="14" fontWeight="900" style={textStyle}>
                          {d.bpSystolic}
                        </text>
                      </g>
                    );
                  })}
                  
                </svg>
              );
            })()}
          </div>
        </div>

        {/* 6. AI 건강 상태 알림 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative flex flex-col">
          <button 
            onClick={() => navigate(`/doctor/${id}/ai_report`)} 
            className="absolute top-5 right-5 text-gray-400 hover:text-blue-600 p-2 bg-slate-50 rounded-lg transition-colors"
            title="AI 리포트 보기"
          >
            <ShortcutIcon />
          </button>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xl">🤖</span>
            <h3 className="text-lg font-bold text-gray-800">AI 건강 상태 분석</h3>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <div className="text-xs font-bold text-gray-500 mb-1">최근 3일 제수량</div>
                <div className="text-sm font-black text-gray-900">평균 +{avgUf3Days} mL</div>
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${avgUf3Days > 800 ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}`}>
                <div className={`w-2 h-2 rounded-full ${avgUf3Days > 800 ? 'bg-emerald-500' : 'bg-yellow-500 animate-pulse'}`}></div> 
                {avgUf3Days > 800 ? '안정적' : '주의 필요'}
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-yellow-200/50">
              <div>
                <div className="text-xs font-bold text-gray-500 mb-1">최근 3일 혈압</div>
                <div className="text-sm font-black text-gray-900">평균 {history[0].bp}</div>
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${history[0].bpSystolic > 140 ? 'bg-yellow-100 text-yellow-700' : 'bg-emerald-100 text-emerald-700'}`}>
                <div className={`w-2 h-2 rounded-full ${history[0].bpSystolic > 140 ? 'bg-yellow-500 animate-pulse' : 'bg-emerald-500'}`}></div> 
                {history[0].bpSystolic > 140 ? '주의 필요' : '안정적'}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <div className="text-xs font-bold text-gray-500 mb-1">최근 3일 체중</div>
                <div className="text-sm font-black text-gray-900">{weightDiff3Days > 0 ? '지속적 증가' : '지속적 감소'} ({weightDiff3Days > 0 ? '+' : ''}{weightDiff3Days}kg)</div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div> 안정적
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 하단: 기록 표, 설문 관리 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 7. 최근 3일 투석 상세 기록 표 (동적 데이터 매핑) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative">
          <button 
            onClick={() => navigate(`/doctor/${id}/logs`)} 
            className="absolute top-5 right-5 text-gray-400 hover:text-blue-600 p-2 bg-slate-50 rounded-lg transition-colors"
            title="기록 전체 보기"
          >
            <ShortcutIcon />
          </button>
          <h3 className="text-lg font-bold text-gray-800 mb-6">최근 3일 투석 상세 기록</h3>
          
          <div className="overflow-x-auto max-h-48 overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-gray-500 font-bold border-b border-gray-100 sticky top-0">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">날짜 / 시간</th>
                  <th className="px-4 py-3">농도</th>
                  <th className="px-4 py-3">주입량(mL)</th>
                  <th className="px-4 py-3">배액량(mL)</th>
                  <th className="px-4 py-3 rounded-tr-lg">제수량</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recent3DaysExchanges.map((ex, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-medium text-gray-900">{ex.dateStr} {ex.time}</td>
                    <td className="px-4 py-3"><span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-bold text-gray-600">{ex.concentration}%</span></td>
                    <td className="px-4 py-3 text-gray-500 font-mono">{ex.infused}</td>
                    <td className="px-4 py-3 text-gray-500 font-mono">{ex.drained}</td>
                    <td className="px-4 py-3 font-bold text-blue-600 font-mono">+{ex.uf}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 8. 환자 설문 승인 관리 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative flex flex-col justify-between">
          <button 
            onClick={() => navigate(`/doctor/${id}/questions`)} 
            className="absolute top-5 right-5 text-gray-400 hover:text-blue-600 p-2 bg-slate-50 rounded-lg transition-colors"
            title="설문 관리 바로가기"
          >
            <ShortcutIcon />
          </button>
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">설문 승인 및 현황</h3>
            <p className="text-xs text-gray-500 mb-6 line-clamp-2">AI가 환자 상태를 분석하여 생성한 맞춤형 질문을 확인하고 승인하세요.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl text-center cursor-pointer hover:bg-rose-100 transition-colors">
              <div className="text-3xl font-black text-rose-600 mb-1">{Math.floor(Math.random() * 5) + 1}</div>
              <div className="text-xs font-bold text-rose-800">승인 대기 질문</div>
            </div>
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-center cursor-pointer hover:bg-blue-100 transition-colors">
              <div className="text-3xl font-black text-blue-600 mb-1">{Math.floor(Math.random() * 20) + 5}</div>
              <div className="text-xs font-bold text-blue-800">응답 완료 설문</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}