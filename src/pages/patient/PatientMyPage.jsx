import React from 'react';
import useAppStore from '../../store/useAppStore';
import { patientsData } from '../../api/mockPatients';

// TODO: 로그인 API 연결 후 현재 로그인한 환자 ID로 교체
const MOCK_CURRENT_PATIENT_ID = 'P001';

// TODO: 환자 상세 정보 조회 API 연결 후 응답 데이터로 교체
const mockPatientDetail = {
  email: 'patient001@example.com',
  phone: '010-1234-5678',
  height: 158,
};

export default function PatientMyPage() {
  const { user } = useAppStore();

  // TODO: 환자 목록 mock 제거 후 환자 단건 조회 API 응답 사용
  const patient = patientsData.find(item => item.id === MOCK_CURRENT_PATIENT_ID) || patientsData[0];

  // 최근 체중 기록 표시 기능
  const latestRecord = patient.history?.[0];

  // 로그인 사용자명 우선 표시 기능
  const displayName = user?.name || patient.name;

  // 최근 체중과 키를 기반으로 BMI 계산 기능
  const latestWeight = latestRecord?.weight;
  const bmi = calculateBmi(latestWeight, mockPatientDetail.height);

  return (
    <div className="mx-auto max-w-4xl space-y-5 pb-24 animate-in fade-in duration-500 md:pb-8">
      {/* 상단 프로필 요약 영역 */}
      <section className="overflow-hidden rounded-4xl border border-blue-100 bg-white shadow-sm">
        <div className="relative bg-linear-to-br from-blue-500 to-indigo-600 p-6 text-white md:p-8">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>

          <div className="relative flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl border border-white/20 bg-white/20 text-3xl font-black shadow-lg backdrop-blur-md md:h-20 md:w-20">
              {displayName.slice(0, 1)}
            </div>

            <div>
              <div className="text-sm font-black text-blue-100">PATIENT MY PAGE</div>
              <h1 className="mt-1 text-3xl font-black tracking-tight md:text-4xl">
                {displayName}님
              </h1>
              <p className="mt-2 text-sm font-medium text-blue-100">
                내 정보를 확인할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 핵심 건강 지표 요약 영역 */}
        <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-4 md:p-5">
          <ProfileStat label="담당의사" value={`${patient.doctor} 선생님`} />
          <ProfileStat label="최근 체중" value={latestWeight ? `${latestWeight} kg` : '-'} />
          <ProfileStat label="키" value={`${mockPatientDetail.height} cm`} />
          <ProfileStat label="BMI" value={bmi || '-'} />
        </div>
      </section>

      {/* 환자 기본 정보 표시 영역 */}
      <section className="rounded-4xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
        <div className="mb-5 flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 font-black text-blue-600">
            i
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">내 정보</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              병원에 등록된 환자 기본 정보입니다.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          <InfoRow label="이름" value={displayName} />
          <InfoRow label="이메일" value={mockPatientDetail.email} />
          <InfoRow label="전화번호" value={mockPatientDetail.phone} />
          <InfoRow label="담당의사" value={`${patient.doctor} 선생님`} />
          <InfoRow label="성별" value={patient.sex} />
          <InfoRow label="나이" value={`${patient.age}세`} />
          <InfoRow label="키" value={`${mockPatientDetail.height} cm`} />
          <InfoRow label="최근 체중" value={latestWeight ? `${latestWeight} kg` : '-'} />
          <InfoRow label="BMI" value={bmi || '-'} />
        </div>
      </section>
    </div>
  );
}

// 상단의 핵심 정보를 카드 형태로 표시하는 기능
function ProfileStat({ label, value }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-slate-50 px-4 py-4 text-center">
      <div className="text-[11px] font-black text-slate-400">{label}</div>
      <div className="mt-1 text-sm font-black text-slate-800 md:text-base">{value}</div>
    </div>
  );
}

// 라벨과 값을 한 줄로 표시하는 기능
function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 text-sm">
      <span className="shrink-0 font-bold text-slate-400">{label}</span>
      <span className="text-right font-black text-slate-800">{value}</span>
    </div>
  );
}

// 키와 체중으로 BMI를 계산하는 기능
function calculateBmi(weight, heightCm) {
  if (!weight || !heightCm) return null;

  const heightM = heightCm / 100;
  return (weight / (heightM * heightM)).toFixed(1);
}
