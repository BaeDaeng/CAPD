import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { patientsData } from '../../api/mockPatients';
import BackToPatientButton from '../../components/BackToPatientButton';
import Card from '../../components/Card';

// TODO: 예약별 설문 응답 조회 API 연결 후 응답 데이터로 교체
const appointmentSurveyGroups = [
  {
    appointmentId: 'A015',
    date: '2026-05-15',
    time: '14:30',
    type: '증상 확인',
    aiConversationSummary: '환자가 AI 증상 상담에서 "아침부터 배가 콕콕 쑤시고 몸이 무겁다"고 표현했습니다.',
    surveys: {
      before: {
        title: '응답 전 설문',
        submittedAt: '2026-05-14 20:10',
        answers: [
          {
            question: '최근 1주일 내에 투석액이 평소보다 심하게 탁하거나 피가 섞여 나온 적이 있습니까?',
            options: ['예', '아니오'],
            answer: '예',
          },
          {
            question: '최근 발열(37.5도 이상)이나 오한 증상이 있었습니까?',
            options: ['예', '아니오'],
            answer: '아니오',
          },
          {
            question: '투석 시 복부 통증이나 불편함의 정도는 어떠신가요?',
            options: ['전혀 없음', '약간 있음', '보통', '심한 편', '매우 심함'],
            answer: '심한 편',
          },
        ],
      },
      after: {
        title: '응답 후 설문',
        submittedAt: '2026-05-15 15:20',
        answers: [
          {
            question: '진료 후 안내받은 주의사항을 이해하셨나요?',
            options: ['예', '아니오'],
            answer: '예',
          },
          {
            question: '다음 방문 전까지 관찰해야 할 증상을 알고 계신가요?',
            options: ['예', '아니오'],
            answer: '예',
          },
        ],
      },
    },
  },
  {
    appointmentId: 'A008',
    date: '2026-05-10',
    time: '09:00',
    type: '투석관 점검 및 소독',
    aiConversationSummary: '',
    surveys: {
      before: {
        title: '응답 전 설문',
        submittedAt: '2026-05-09 19:30',
        answers: [
          {
            question: '어제 저녁 식사로 주로 어떤 종류의 음식을 드셨나요?',
            options: ['국물류', '튀김/볶음류', '육류 구이', '채소 위주의 식단', '기타'],
            answer: '국물류',
          },
          {
            question: '최근 3일간 발목이나 얼굴에 붓기가 느껴지셨나요?',
            options: ['예', '아니오'],
            answer: '아니오',
          },
        ],
      },
      after: {
        title: '응답 후 설문',
        submittedAt: '2026-05-10 10:15',
        answers: [
          {
            question: '투석관 소독 후 통증이나 불편감이 있었나요?',
            options: ['예', '아니오'],
            answer: '아니오',
          },
          {
            question: '소독 부위 관리 방법을 이해하셨나요?',
            options: ['예', '아니오'],
            answer: '예',
          },
        ],
      },
    },
  },
  {
    appointmentId: 'A001',
    date: '2026-05-08',
    time: '09:00',
    type: '정기 검진',
    aiConversationSummary: '환자가 AI 증상 상담에서 "숨이 조금 차고 밤에 잠을 설쳤다"고 말했습니다.',
    surveys: {
      before: {
        title: '응답 전 설문',
        submittedAt: '2026-05-07 21:00',
        answers: [
          {
            question: '최근 밤에 숨이 차서 잠에서 깬 적이 있습니까?',
            options: ['예', '아니오'],
            answer: '예',
          },
          {
            question: '최근 체중이 평소보다 빠르게 증가했다고 느끼셨나요?',
            options: ['예', '아니오'],
            answer: '아니오',
          },
          {
            question: '최근 일주일 동안 느끼는 전반적인 피로도는 어느 정도인가요?',
            options: ['아주 좋음', '좋은 편', '보통', '피로함', '매우 피로함'],
            answer: '피로함',
          },
        ],
      },
      after: {
        title: '응답 후 설문',
        submittedAt: '2026-05-08 10:05',
        answers: [
          {
            question: '진료 후 처방 또는 생활 관리 안내를 확인하셨나요?',
            options: ['예', '아니오'],
            answer: '예',
          },
        ],
      },
    },
  },
];

const surveyTypeLabels = {
  before: '응답 전 설문',
  after: '응답 후 설문',
};

export default function QuestionCheckPage() {
  const { id } = useParams();
  const patient = patientsData.find(p => p.id === id) || patientsData[0];

  const [openAppointmentId, setOpenAppointmentId] = useState(appointmentSurveyGroups[0]?.appointmentId);
  const [activeSurveyTypeByAppointment, setActiveSurveyTypeByAppointment] = useState({});

  // 예약별 설문 문항 수 계산 기능
  const totalSurveyCount = useMemo(() => {
    return appointmentSurveyGroups.reduce((sum, group) => (
      sum + group.surveys.before.answers.length + group.surveys.after.answers.length
    ), 0);
  }, []);

  // 특정 예약에서 현재 선택된 응답 전/후 설문 구분을 가져오는 기능
  const getActiveSurveyType = (appointmentId) => {
    return activeSurveyTypeByAppointment[appointmentId] || 'before';
  };

  // 예약별 응답 전/후 설문 탭 변경 기능
  const handleSurveyTypeChange = (appointmentId, surveyType) => {
    setActiveSurveyTypeByAppointment(prev => ({
      ...prev,
      [appointmentId]: surveyType,
    }));
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-slate-50 p-4 animate-in fade-in duration-500 md:p-6">
      <div className="mb-5 shrink-0">
        <BackToPatientButton />

        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-black text-gray-900">
              <span className="rounded-xl bg-blue-100 p-2 text-xl text-blue-600">✓</span>
              설문 응답 확인
            </h1>
            <p className="mt-2 text-sm font-medium text-gray-500">
              <span className="font-bold text-blue-600">{patient.name}</span> 환자의 예약별 응답 전/후 설문 답변입니다.
            </p>
          </div>

          <div className="grid w-full grid-cols-2 gap-3 md:w-auto">
            <HeaderStat label="예약 묶음" value={`${appointmentSurveyGroups.length}건`} color="blue" />
            <HeaderStat label="전체 답변" value={`${totalSurveyCount}개`} color="emerald" />
          </div>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 xl:grid-cols-12">
        <aside className="flex min-h-0 flex-col gap-4 overflow-y-auto pr-1 custom-scrollbar xl:col-span-3">
          <Card className="shrink-0 border-none p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-black text-gray-800">환자 요약</h3>
            <div className="space-y-1">
              <InfoRow label="환자명" value={patient.name} />
              <InfoRow label="환자번호" value={patient.id} />
              <InfoRow label="성별/나이" value={`${patient.sex} / ${patient.age}세`} />
              <InfoRow label="CAPD 시작일" value={patient.capdStartDate} />
              <InfoRow label="담당의" value={patient.doctor} />
            </div>
          </Card>

          <Card className="shrink-0 border-none p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-black text-gray-800">예약별 설문</h3>
            <div className="flex flex-col gap-2">
              {appointmentSurveyGroups.map(group => {
                const isActive = openAppointmentId === group.appointmentId;
                const answerCount = group.surveys.before.answers.length + group.surveys.after.answers.length;

                return (
                  <button
                    key={group.appointmentId}
                    type="button"
                    onClick={() => setOpenAppointmentId(group.appointmentId)}
                    className={`rounded-xl border px-4 py-3 text-left transition-all ${
                      isActive
                        ? 'border-blue-300 bg-blue-50 shadow-sm'
                        : 'border-gray-100 bg-slate-50 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-black text-gray-900">{group.appointmentId}</span>
                      <span className="text-[10px] font-bold text-gray-400">{answerCount}답변</span>
                    </div>
                    <div className="mt-1 text-[11px] font-bold text-gray-500">
                      {group.date} {group.time}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </aside>

        <main className="flex min-h-0 flex-col xl:col-span-9">
          <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
            <div className="shrink-0 border-b border-gray-100 bg-slate-50 px-5 py-4">
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-blue-500">
                  Appointment Survey Responses
                </div>
                <h2 className="mt-1 text-lg font-black text-gray-900">예약별 설문 내역</h2>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50/50 p-4 custom-scrollbar md:p-6">
              <div className="flex flex-col gap-4">
                {appointmentSurveyGroups.map(group => {
                  const isOpen = openAppointmentId === group.appointmentId;
                  const activeSurveyType = getActiveSurveyType(group.appointmentId);
                  const currentSurvey = group.surveys[activeSurveyType];

                  return (
                    <section
                      key={group.appointmentId}
                      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenAppointmentId(isOpen ? null : group.appointmentId)}
                        className={`flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors ${
                          isOpen ? 'bg-blue-50' : 'bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-black text-white">
                              {group.appointmentId}
                            </span>
                            <span className="text-sm font-black text-gray-900">{group.type}</span>
                            {group.aiConversationSummary && (
                              <span className="rounded-full bg-purple-100 px-2.5 py-1 text-[10px] font-black text-purple-700">
                                AI 대화 감지
                              </span>
                            )}
                          </div>
                          <div className="mt-2 text-xs font-bold text-gray-400">
                            {group.date} {group.time} · 응답 전 {group.surveys.before.answers.length}개 / 응답 후 {group.surveys.after.answers.length}개
                          </div>
                        </div>

                        <span className={`shrink-0 text-lg font-black transition-transform ${isOpen ? 'rotate-180 text-blue-600' : 'text-gray-300'}`}>
                          ˅
                        </span>
                      </button>

                      {isOpen && (
                        <div className="border-t border-gray-100 p-5">
                          {group.aiConversationSummary && (
                            <div className="mb-5 rounded-2xl border border-purple-100 bg-purple-50 p-4">
                              <h4 className="mb-1 text-xs font-black text-purple-800">AI 대화한 내용</h4>
                              <p className="text-sm font-medium leading-relaxed text-purple-900/80">
                                {group.aiConversationSummary}
                              </p>
                            </div>
                          )}

                          <div className="mb-5 flex gap-6 border-b border-gray-100">
                            {Object.entries(surveyTypeLabels).map(([surveyType, label]) => (
                              <button
                                key={surveyType}
                                type="button"
                                onClick={() => handleSurveyTypeChange(group.appointmentId, surveyType)}
                                className={`border-b-2 pb-3 text-sm font-bold transition-colors ${
                                  activeSurveyType === surveyType
                                    ? surveyType === 'before'
                                      ? 'border-blue-600 text-blue-600'
                                      : 'border-emerald-600 text-emerald-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                              >
                                {label} ({group.surveys[surveyType].answers.length})
                              </button>
                            ))}
                          </div>

                          <div className="mb-4 flex items-start justify-between gap-4">
                            <div>
                              <div className={`text-[10px] font-black uppercase tracking-widest ${
                                activeSurveyType === 'before' ? 'text-blue-500' : 'text-emerald-500'
                              }`}>
                                SURVEY RESPONSE
                              </div>
                              <h3 className="mt-1 text-lg font-black text-gray-900">{currentSurvey.title}</h3>
                              <p className="mt-1 font-mono text-xs text-gray-400">{currentSurvey.submittedAt}</p>
                            </div>

                            <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-black ${
                              activeSurveyType === 'before'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}>
                              {currentSurvey.answers.length}문항
                            </span>
                          </div>

                          <div className="flex flex-col gap-4">
                            {currentSurvey.answers.map((item, index) => (
                              <AnswerCard
                                key={`${group.appointmentId}-${activeSurveyType}-${index}`}
                                item={item}
                                index={index}
                                tone={activeSurveyType}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </section>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function AnswerCard({ item, index, tone }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex gap-3">
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
          tone === 'before'
            ? 'bg-blue-50 text-blue-700'
            : 'bg-emerald-50 text-emerald-700'
        }`}>
          {index + 1}
        </span>
        <h3 className="text-base font-black leading-relaxed text-gray-900">
          {item.question}
        </h3>
      </div>

      {item.options.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {item.options.map(option => {
            const selected = option === item.answer;

            return (
              <div
                key={option}
                className={`rounded-xl border px-3 py-2 text-xs font-black ${
                  selected
                    ? tone === 'before'
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                      : 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                    : 'border-gray-200 bg-slate-50 text-gray-500'
                }`}
              >
                {option}
              </div>
            );
          })}
        </div>
      ) : (
        <div className={`rounded-xl border px-4 py-3 text-sm font-black ${
          tone === 'before'
            ? 'border-blue-100 bg-blue-50 text-blue-700'
            : 'border-emerald-100 bg-emerald-50 text-emerald-700'
        }`}>
          {item.answer}
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-2.5 text-sm last:border-b-0 last:pb-0">
      <span className="font-bold text-gray-400">{label}</span>
      <span className="font-black text-gray-800">{value}</span>
    </div>
  );
}

function HeaderStat({ label, value, color }) {
  const styles = {
    blue: 'border-blue-100 bg-blue-50 text-blue-800',
    emerald: 'border-emerald-100 bg-emerald-50 text-emerald-800',
  };

  const valueStyles = {
    blue: 'text-blue-600',
    emerald: 'text-emerald-600',
  };

  return (
    <div className={`rounded-xl border px-4 py-3 text-right shadow-sm ${styles[color]}`}>
      <div className="text-[10px] font-black">{label}</div>
      <div className={`mt-1 text-lg font-black ${valueStyles[color]}`}>{value}</div>
    </div>
  );
}
