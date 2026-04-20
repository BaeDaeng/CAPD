import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';

export default function DoctorHome() {
  const navigate = useNavigate();

  // 상단 압축형 요약 데이터
  const summaryStats = {
    total: 10,
    normal: 7,
    delayed: 3
  };

  // 10명의 환자 모의 데이터 (최근 7일 제수량 추이 데이터 포함)
  const patientList = [
    { id: 'P001', name: '김환자', age: 62, sex: 'M', record: 4, uf: 1120, weight: 74.6, bp: '155/93', fbs: 142, ai: '혈압 상승, 제수량 감소 경고', trend: [1300, 1250, 1280, 1150, 1100, 1100, 1120], isWarning: true },
    { id: 'P002', name: '이환자', age: 45, sex: 'F', record: 4, uf: 1450, weight: 55.2, bp: '120/80', fbs: 95, ai: '-', trend: [1400, 1420, 1450, 1430, 1440, 1460, 1450], isWarning: false },
    { id: 'P003', name: '최환자', age: 71, sex: 'M', record: 2, uf: 650, weight: 68.1, bp: '135/85', fbs: 110, ai: '오후 기록 2건 누락', trend: [1100, 1150, 1120, 1180, 1100, 650, 650], isWarning: true },
    { id: 'P004', name: '박환자', age: 58, sex: 'F', record: 4, uf: 1200, weight: 60.5, bp: '125/82', fbs: 105, ai: '-', trend: [1180, 1190, 1200, 1210, 1190, 1200, 1200], isWarning: false },
    { id: 'P005', name: '정환자', age: 52, sex: 'M', record: 5, uf: 1350, weight: 72.0, bp: '130/85', fbs: 125, ai: '-', trend: [1300, 1320, 1310, 1350, 1340, 1330, 1350], isWarning: false },
    { id: 'P006', name: '배환자', age: 66, sex: 'F', record: 4, uf: 950, weight: 63.8, bp: '145/90', fbs: 155, ai: '공복혈당 150 초과 (3일째)', trend: [1000, 980, 950, 970, 960, 940, 950], isWarning: true },
    { id: 'P007', name: '임환자', age: 48, sex: 'M', record: 1, uf: 300, weight: 78.2, bp: '128/84', fbs: 100, ai: '아침 기록 확인 요망', trend: [1200, 1220, 1190, 1210, 1200, 300, 300], isWarning: true },
    { id: 'P008', name: '윤환자', age: 55, sex: 'F', record: 4, uf: 1250, weight: 58.9, bp: '118/78', fbs: 92, ai: '-', trend: [1230, 1240, 1260, 1250, 1240, 1250, 1250], isWarning: false },
    { id: 'P009', name: '오환자', age: 69, sex: 'M', record: 4, uf: 1500, weight: 70.4, bp: '122/80', fbs: 108, ai: '-', trend: [1480, 1490, 1510, 1500, 1480, 1490, 1500], isWarning: false },
    { id: 'P010', name: '신환자', age: 41, sex: 'F', record: 3, uf: 980, weight: 52.1, bp: '115/75', fbs: 88, ai: '야간 기록 지연', trend: [1300, 1280, 1310, 1290, 1300, 980, 980], isWarning: true },
  ];

  return (
    <div className="h-full flex flex-col p-6 animate-in fade-in duration-500 bg-slate-100">
      
      {/* 상단 슬림 헤더 */}
      <div className="bg-white px-5 py-3 rounded-xl shadow-sm border border-gray-200 flex flex-wrap justify-between items-center shrink-0 mb-4">
        <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
          📊 전체 환자 모니터링
        </h1>
        <div className="flex items-center gap-6 text-sm">
          <div className="font-medium text-slate-500">
            전체 환자: <span className="font-bold text-slate-900 text-base ml-1">{summaryStats.total}</span>명
          </div>
          <div className="w-px h-4 bg-gray-300"></div>
          <div className="font-medium text-emerald-600">
            정상 제출: <span className="font-bold text-base ml-1">{summaryStats.normal}</span>명
          </div>
          <div className="w-px h-4 bg-gray-300"></div>
          <div className="font-medium text-red-500">
            제출 지연/누락: <span className="font-bold text-base ml-1">{summaryStats.delayed}</span>명
          </div>
        </div>
      </div>

      {/* 메인 고밀도 데이터 테이블 영역 */}
      <Card className="flex-1 flex flex-col p-0 overflow-hidden border-none shadow-md bg-white">
        <div className="overflow-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            {/* Sticky Header: 스크롤을 내려도 제목행이 고정됨 */}
            <thead className="bg-slate-50 border-b border-gray-200 text-xs font-bold text-slate-500 uppercase tracking-wider sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-5 py-4">환자 정보</th>
                <th className="px-5 py-4 text-center">일일 기록</th>
                <th className="px-5 py-4 text-right">총 제수량</th>
                <th className="px-5 py-4 text-right">체중</th>
                <th className="px-5 py-4 text-right">혈압</th>
                <th className="px-5 py-4 text-right">공복혈당</th>
                <th className="px-5 py-4">AI 특이사항</th>
                <th className="px-5 py-4 text-center">미니 추이 (7일)</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-100">
              {patientList.map((patient) => (
                <tr 
                  key={patient.id} 
                  onClick={() => navigate(`/doctor/${patient.id}`)}
                  className={`cursor-pointer transition-colors group ${
                    patient.isWarning ? 'bg-red-50/30 hover:bg-red-50/80' : 'hover:bg-blue-50/50'
                  }`}
                >
                  {/* 환자 정보 */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${patient.isWarning ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                        {patient.name[0]}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{patient.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{patient.id} | {patient.sex}/{patient.age}세</div>
                      </div>
                    </div>
                  </td>
                  
                  {/* 일일 기록 상태 */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-center gap-1.5">
                      {[...Array(5)].map((_, i) => (
                        // shrink-0 : 작아져도 아이콘이 작아지지 않음
                        <div key={i} className="shrink-0">
                         {/* {i < patient.record ? (  초록색 체크  ) : (  빈 동그라미  )} */}
                          {i < patient.record ? (
                            // 제출 완료 (초록색 체크 아이콘)
                            <svg className="w-4.5 h-4.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            // 미제출 (빈 동그라미)
                            <div className="w-4 h-4 rounded-full border-2 border-slate-200 bg-slate-50 m-px"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* 총 제수량 */}
                  <td className="px-5 py-3.5 text-right">
                    <span className={`font-mono font-bold ${patient.uf < 800 ? 'text-red-600' : 'text-slate-700'}`}>
                      {patient.uf} <span className="text-[10px] text-slate-400 font-sans font-normal">mL</span>
                    </span>
                  </td>

                  {/* 체중 */}
                  <td className="px-5 py-3.5 text-right font-medium text-slate-700">
                    {patient.weight} <span className="text-[10px] text-slate-400">kg</span>
                  </td>

                  {/* 혈압 */}
                  <td className="px-5 py-3.5 text-right">
                    <span className={`font-bold ${parseInt(patient.bp.split('/')[0]) >= 140 ? 'text-red-600' : 'text-slate-700'}`}>
                      {patient.bp}
                    </span>
                  </td>

                  {/* 공복 혈당 */}
                  <td className="px-5 py-3.5 text-right">
                    <span className={`font-bold ${patient.fbs >= 126 ? 'text-orange-600' : 'text-slate-700'}`}>
                      {patient.fbs}
                    </span>
                  </td>

                  {/* AI 특이사항 */}
                  <td className="px-5 py-3.5">
                    <div className={`text-xs font-bold truncate max-w-50 ${patient.isWarning ? 'text-red-600' : 'text-slate-400 font-medium'}`}>
                      {patient.ai}
                    </div>
                  </td>

                  {/* 미니 추이 (Sparkline) */}
                  <td className="px-5 py-3.5 w-32">
                    <div className="flex items-center justify-center h-8 w-24 mx-auto bg-slate-50 rounded border border-slate-100 p-1">
                      <Sparkline data={patient.trend} color={patient.isWarning ? '#ef4444' : '#3b82f6'} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
    </div>
  );
}

// === 미니 추이 그래프(Sparkline) 컴포넌트 ===
function Sparkline({ data, color }) {
  if (!data || data.length === 0) return null;

  // 데이터 정규화 (Y축 0~20, X축 0~60 픽셀에 맞춤)
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1; // 0으로 나누기 방지
  const height = 20;
  const width = 80;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        className="opacity-80 group-hover:opacity-100 transition-opacity"
      />
    </svg>
  );
}