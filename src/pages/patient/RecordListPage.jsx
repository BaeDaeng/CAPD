import React, { useState } from 'react';
import Card from '../../components/Card';

export default function RecordListPage() {
  const [navDate, setNavDate] = useState(new Date()); 
  const [selectedDate, setSelectedDate] = useState(new Date()); 

  // 1. 기존에는 고정된 변수였던 데이터를, '수정'이 가능하도록 useState(상태)로 변경했습니다.
  const [recordsData, setRecordsData] = useState([
    {
      date: '2026-04-20',
      totalUf: 1250,
      avgBp: '128/84',
      exchanges: [
        { time: '08:30', concentration: '1.5%', infused: 2000, drained: 2250, uf: 250, bp: '125/80', weight: 65.2 },
        { time: '13:00', concentration: '2.5%', infused: 2000, drained: 2400, uf: 400, bp: '130/85', weight: 65.0 },
        { time: '18:15', concentration: '1.5%', infused: 2000, drained: 2300, uf: 300, bp: '128/82', weight: 65.3 },
        { time: '22:40', concentration: '2.5%', infused: 2000, drained: 2300, uf: 300, bp: '132/88', weight: 65.5 },
      ]
    },
    {
      date: '2026-04-19',
      totalUf: 950,
      avgBp: '142/95',
      exchanges: [
        { time: '08:00', concentration: '1.5%', infused: 2000, drained: 2150, uf: 150, bp: '145/95', weight: 66.1 },
        { time: '12:30', concentration: '2.5%', infused: 2000, drained: 2300, uf: 300, bp: '140/92', weight: 65.8 },
        { time: '17:00', concentration: '1.5%', infused: 2000, drained: 2250, uf: 250, bp: '142/96', weight: 65.9 },
        { time: '22:00', concentration: '2.5%', infused: 2000, drained: 2250, uf: 250, bp: '141/97', weight: 66.2 },
      ]
    }
  ]);

  // --- 캘린더 관련 로직 ---
  const year = navDate.getFullYear();
  const month = navDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setNavDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setNavDate(new Date(year, month + 1, 1));

  const formatDate = (d) => {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const handleRecordClick = (dateStr) => {
    const [y, m, d] = dateStr.split('-');
    setSelectedDate(new Date(y, m - 1, d));
    setNavDate(new Date(y, m - 1, 1));
  };

  const selectedDateStr = formatDate(selectedDate);
  const activeRecord = recordsData.find(r => r.date === selectedDateStr);

  // --- 수정(Edit) 모달 관련 상태 및 함수 ---
  const [editForm, setEditForm] = useState(null); // null이면 닫힘, 데이터가 있으면 열림

  // 수정 버튼 클릭 시 폼에 기존 데이터 채우기
  const openEditModal = (dateStr, exIndex, exData) => {
    setEditForm({ dateStr, exIndex, ...exData });
  };

  // 입력값 변경 시 상태 업데이트
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  // 수정 완료(저장) 처리
  const saveEdit = () => {
    setRecordsData(prevRecords => prevRecords.map(dayRecord => {
      // 1. 현재 수정 중인 날짜를 찾음
      if (dayRecord.date === editForm.dateStr) {
        const newExchanges = [...dayRecord.exchanges];
        // 2. 제수량(uf) 다시 계산
        const newUf = Number(editForm.drained) - Number(editForm.infused);
        
        // 3. 해당 회차 데이터 업데이트
        newExchanges[editForm.exIndex] = {
          ...newExchanges[editForm.exIndex],
          time: editForm.time,
          concentration: editForm.concentration,
          infused: Number(editForm.infused),
          drained: Number(editForm.drained),
          uf: newUf,
          bp: editForm.bp,
          weight: Number(editForm.weight)
        };

        // 4. 그 날의 총 제수량(totalUf)도 다시 계산
        const newTotalUf = newExchanges.reduce((sum, ex) => sum + ex.uf, 0);

        return { ...dayRecord, exchanges: newExchanges, totalUf: newTotalUf };
      }
      return dayRecord;
    }));
    
    setEditForm(null); // 모달 닫기
    alert('기록이 수정되었습니다.'); // 나중에는 토스트 메시지 등으로 교체 가능
  };

  return (
    <div className="max-w-6xl mx-auto pb-10 animate-in fade-in duration-500 relative">
      
      {/* 타이틀 영역 */}
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900">투석 기록 확인</h1>
        <p className="text-gray-500 mt-2">달력에서 날짜를 선택하여 과거의 기록을 확인하고 수정할 수 있습니다.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* === 좌측: 상세 기록 섹션 === */}
        <div className="lg:col-span-2 space-y-6">
          {activeRecord ? (
            <>
              {/* 날짜 요약 헤더 */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                  <div className="text-xs font-bold text-blue-600 uppercase mb-1">{selectedDateStr}</div>
                  <div className="text-2xl font-black text-gray-900">총 제수량 {activeRecord.totalUf}mL</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-gray-400 mb-1">평균 혈압</div>
                  <div className="text-xl font-bold text-gray-800">{activeRecord.avgBp}</div>
                </div>
              </div>

              {/* 상세 기록 표 */}
              <Card className="p-0 overflow-hidden border-none shadow-md">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-4">교환 시각</th>
                        <th className="px-6 py-4">농도</th>
                        <th className="px-6 py-4 text-right">주입/배액 (mL)</th>
                        <th className="px-6 py-4 text-right text-blue-600">제수량</th>
                        <th className="px-6 py-4 text-right">혈압/체중</th>
                        <th className="px-4 py-4 text-center">관리</th> {/* 관리 열 추가 */}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 bg-white">
                      {activeRecord.exchanges.map((ex, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-gray-800">{ex.time}</td>
                          <td className="px-6 py-4">
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-bold text-gray-600">{ex.concentration}</span>
                          </td>
                          <td className="px-6 py-4 text-right text-sm text-gray-500 font-mono">
                            {ex.infused} / {ex.drained}
                          </td>
                          <td className="px-6 py-4 text-right font-black text-blue-600 font-mono">
                            {ex.uf > 0 ? `+${ex.uf}` : ex.uf}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="text-sm font-bold text-gray-700">{ex.bp}</div>
                            <div className="text-[10px] text-gray-400 font-medium">{ex.weight}kg</div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            {/* 수정 버튼 */}
                            <button 
                              onClick={() => openEditModal(selectedDateStr, idx, ex)}
                              className="text-[11px] font-bold text-slate-400 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-200 transition-all"
                            >
                              수정
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          ) : (
            /* 데이터 없는 경우 */
            <div className="bg-white rounded-3xl p-20 border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedDateStr}</h3>
              <p className="text-gray-400 font-medium">선택한 날짜에 기록된 투석 데이터가 없습니다.</p>
            </div>
          )}
        </div>

        {/* === 우측: 동적 캘린더 사이드바 === */}
        <aside className="sticky top-6">
          <Card className="p-5 border-none shadow-md bg-white">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-gray-900 text-lg">{year}년 {month + 1}월</h3>
              <div className="flex gap-2">
                <button onClick={handlePrevMonth} className="p-1 hover:bg-slate-50 rounded text-gray-400">◀</button>
                <button onClick={handleNextMonth} className="p-1 hover:bg-slate-50 rounded text-gray-400">▶</button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {['일','월','화','수','목','금','토'].map(d => (
                <div key={d} className="text-[10px] font-bold text-gray-300 mb-3">{d}</div>
              ))}
              
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`blank-${i}`} className="h-10"></div>
              ))}
              
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
                const currentStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                const hasRecord = recordsData.some(r => r.date === currentStr);

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(new Date(year, month, day))}
                    className={`h-10 flex flex-col items-center justify-center rounded-2xl text-sm transition-all relative ${
                      isSelected ? 'bg-blue-600 text-white font-bold shadow-lg scale-105 z-10' : 'text-gray-600 hover:bg-blue-50'
                    }`}
                  >
                    {day}
                    {hasRecord && (
                      <span className={`w-1 h-1 rounded-full absolute bottom-1.5 ${isSelected ? 'bg-white' : 'bg-blue-400'}`}></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* 하단 최근 기록 리스트 */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">최근 기록 내역</span>
              </div>
              
              <div className="space-y-2">
                {recordsData.map(r => {
                  const isRecordSelected = r.date === selectedDateStr;
                  return (
                    <button 
                      key={r.date}
                      onClick={() => handleRecordClick(r.date)}
                      className={`w-full flex justify-between items-center p-3 rounded-xl border transition-all ${
                        isRecordSelected ? 'border-blue-400 bg-blue-50 shadow-sm' : 'border-gray-100 hover:border-blue-200 hover:bg-blue-50/50'
                      }`}
                    >
                      <span className={`text-sm font-bold ${isRecordSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                        {r.date}
                      </span>
                      <span className="text-xs font-black text-blue-500">+{r.totalUf}mL</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>
        </aside>
      </div>

      {/* ==========================================
          [모달창] 수정 모드 (editForm에 값이 있을 때만 렌더링)
      ========================================== */}
      {editForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="font-black text-xl text-gray-900 mb-6 flex justify-between items-center">
              기록 수정하기
              <button onClick={() => setEditForm(null)} className="text-gray-400 hover:text-red-500">✕</button>
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">교환 시각</label>
                  <input type="time" name="time" value={editForm.time} onChange={handleEditChange} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">투석액 농도</label>
                  <select name="concentration" value={editForm.concentration} onChange={handleEditChange} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="1.5%">1.5%</option>
                    <option value="2.5%">2.5%</option>
                    <option value="4.25%">4.25%</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">주입량 (mL)</label>
                  <input type="number" name="infused" value={editForm.infused} onChange={handleEditChange} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">배액량 (mL)</label>
                  <input type="number" name="drained" value={editForm.drained} onChange={handleEditChange} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">혈압 (mmHg)</label>
                  <input type="text" name="bp" value={editForm.bp} onChange={handleEditChange} placeholder="예: 120/80" className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">체중 (kg)</label>
                  <input type="number" step="0.1" name="weight" value={editForm.weight} onChange={handleEditChange} className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              {/* 하단 버튼 */}
              <div className="flex gap-3 mt-8">
                <button onClick={() => setEditForm(null)} className="flex-1 py-3 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors">취소</button>
                <button onClick={saveEdit} className="flex-1 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">저장하기</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}