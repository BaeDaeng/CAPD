import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DailyRecordPage() {
  const navigate = useNavigate();

  // 오늘 날짜 생성
  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const displayDate = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

  // 게으른 초기화(Lazy Initialization) 적용
  // useEffect 대신 useState 내부에서 바로 로컬 스토리지를 읽어와서 초기값을 세팅합니다.
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem(`capd_daily_info_${formattedDate}`);
    const parsed = savedData ? JSON.parse(savedData) : {};

    return {
      time: '08:00',
      concentration: '1.5',
      infused: 2000,
      drained: '',
      // 저장된 데이터가 있으면 우선 사용, 없으면 기본값 사용
      turbidity: parsed.turbidity || '맑음',
      urineCount: parsed.urineCount || '',
      weight: parsed.weight || '',
      bpSystolic: parsed.bpSystolic || '',
      bpDiastolic: parsed.bpDiastolic || '',
      fbs: parsed.fbs || '',
      memo: parsed.memo || '',
    };
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 백엔드 연결 전까지는 로컬스토리지에 오늘 정보를 저장하여 유지시킴
    localStorage.setItem(`capd_daily_info_${formattedDate}`, JSON.stringify(formData));
    
    console.log('제출 데이터:', formData);
    alert('오늘의 기록이 성공적으로 제출되었습니다!');
    navigate('/patient/record_list');
  };

  const ufValue = (formData.drained && formData.infused) 
    ? Number(formData.drained) - Number(formData.infused) 
    : 0;

  return (
    <div className="max-w-2xl mx-auto pb-20 animate-in fade-in duration-500">
      
      <div className="mb-8">
        <div className="text-blue-600 font-bold mb-2 flex items-center gap-2">
          <span>📅</span> {displayDate}
        </div>
        <h1 className="text-3xl font-black text-gray-900">투석 기록 입력</h1>
        <p className="text-gray-500 mt-2">상태 정보를 입력하면 오늘 하루 동안 기록이 유지됩니다.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 투석 및 액 상태 정보 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-5 pb-3 border-b border-gray-100 flex items-center gap-2">
            <span className="text-blue-500">💧</span> 투석 정보
          </h2>
          
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">교환 시각</label>
                <input type="time" name="time" value={formData.time} onChange={handleChange} required className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">복막액 혼탁도</label>
                <div className="grid grid-cols-2 gap-2">
                  {['맑음', '혼탁'].map((v) => (
                    <button
                      key={v} type="button"
                      onClick={() => setFormData(prev => ({ ...prev, turbidity: v }))}
                      className={`py-3 rounded-xl font-bold border transition-all ${formData.turbidity === v ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-500 border-gray-200'}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">투석액 농도 (%)</label>
              <div className="grid grid-cols-3 gap-3">
                {['1.5', '2.5', '4.25'].map((val) => (
                  <button key={val} type="button" onClick={() => setFormData(prev => ({ ...prev, concentration: val }))} className={`py-3 rounded-xl font-bold border ${formData.concentration === val ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-500 border-gray-200'}`}>{val}%</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">주입량 (mL)</label>
                <input type="number" name="infused" value={formData.infused} onChange={handleChange} required className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">배액량 (mL)</label>
                <input type="number" name="drained" value={formData.drained} onChange={handleChange} required className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            <div className={`p-4 rounded-xl border flex justify-between items-center ${ufValue < 0 ? 'bg-red-50 border-red-200 text-red-700' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
              <div className="font-bold text-sm">제수량 (자동 계산)</div>
              <div className="text-xl font-black">{ufValue > 0 ? `+${ufValue}` : ufValue} <span className="text-sm font-medium">mL</span></div>
            </div>
          </div>
        </div>

        {/* 건강 수치 (Daily 정보) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-5 pb-3 border-b border-gray-100 flex items-center gap-2">
            <span className="text-emerald-500">❤️</span> 건강 수치
          </h2>
          
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">체중 (kg)</label>
                <input type="number" step="0.1" name="weight" value={formData.weight} onChange={handleChange} placeholder="00.0" className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">소변 횟수 (회)</label>
                <input type="number" name="urineCount" value={formData.urineCount} onChange={handleChange} placeholder="0" className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">혈압 (mmHg)</label>
              <div className="flex items-center gap-3">
                <input type="number" name="bpSystolic" value={formData.bpSystolic} onChange={handleChange} placeholder="수축기" className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" />
                <span className="text-gray-300">/</span>
                <input type="number" name="bpDiastolic" value={formData.bpDiastolic} onChange={handleChange} placeholder="이완기" className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">공복혈당 (mg/dL)</label>
              <input type="number" name="fbs" value={formData.fbs} onChange={handleChange} placeholder="000" className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
        </div>

        {/* 메모 섹션 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-yellow-500">📝</span> 메모
          </h2>
          <textarea
            name="memo"
            value={formData.memo}
            onChange={handleChange}
            placeholder="특이사항이나 컨디션을 적어주세요."
            className="w-full h-32 bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-5 rounded-2xl shadow-lg transition-all active:scale-95">
          기록 제출하기
        </button>

      </form>
    </div>
  );
}