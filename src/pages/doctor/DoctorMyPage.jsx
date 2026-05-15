import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../../store/useAppStore';
import { patientsData } from '../../api/mockPatients';

// TODO: 의사 상세 정보 조회 API 연결 후 응답 데이터로 교체
const mockDoctorProfile = {
  doctorId: 'D001',
  name: '김의사',
  email: 'doctor@example.com',
  phone: '010-2468-1357',
  department: '신장내과',
  licenseNo: 'MD-2026-001',
  position: '전문의',
};

export default function DoctorMyPage() {
  const navigate = useNavigate();

  const {
    user,
    currentDoctorId,
    patientAssignments,
  } = useAppStore();

  // 담당 환자 목록 계산 기능
  const assignedPatients = patientsData.filter(patient => (
    patientAssignments[patient.id]?.doctorId === currentDoctorId
  ));

  // 로그인 사용자명 우선 표시 기능
  const displayName = user?.name || mockDoctorProfile.name;

  return (
    <div className="h-full overflow-hidden bg-slate-50 p-4 md:p-6 animate-in fade-in duration-500">
      <div className="grid h-full min-h-0 grid-cols-12 gap-4">
        {/* 좌측 의사 프로필 영역 */}
        <section className="col-span-12 flex min-h-0 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 text-white shadow-sm xl:col-span-4">
          <div className="relative p-6">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl"></div>

            <div className="relative">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-3xl font-black shadow-lg">
                {displayName.slice(0, 1)}
              </div>

              <div className="text-[10px] font-black uppercase tracking-widest text-blue-300">
                Doctor My Page
              </div>
              <h1 className="mt-1 text-3xl font-black tracking-tight">
                {displayName} 선생님
              </h1>
              <p className="mt-2 text-sm font-medium leading-relaxed text-slate-300">
                진료 계정 정보와 담당 환자 현황을 확인합니다.
              </p>
            </div>
          </div>

          {/* 담당 환자 수 요약 영역 */}
          <div className="px-5">
            <DarkStat label="담당 환자" value={`${assignedPatients.length}명`} />
          </div>

          {/* 의사 계정 상세 정보 영역 */}
          <div className="mt-5 min-h-0 flex-1 px-5 pb-5">
            <div className="grid h-full grid-rows-[auto_1fr] gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div>
                <div className="mb-3 text-xs font-black text-slate-400">기본 정보</div>
                <div className="space-y-3">
                  <ProfileLine label="의사번호" value={mockDoctorProfile.doctorId} dark />
                  <ProfileLine label="진료과" value={mockDoctorProfile.department} dark />
                  <ProfileLine label="직책" value={mockDoctorProfile.position} dark />
                  <ProfileLine label="면허번호" value={mockDoctorProfile.licenseNo} dark />
                </div>
              </div>

              <div className="grid content-end gap-3">
                <ContactBox label="이메일" value={mockDoctorProfile.email} />
                <ContactBox label="전화번호" value={mockDoctorProfile.phone} />
              </div>
            </div>
          </div>
        </section>

        {/* 우측 담당 환자 목록 영역 */}
        <main className="col-span-12 min-h-0 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm xl:col-span-8">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-blue-500">
                Assigned Patients
              </div>
              <h2 className="mt-1 text-2xl font-black text-slate-900">담당 환자 요약</h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/doctor')}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-black text-slate-500 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-800 active:scale-[0.99]"
              >
                메인으로
              </button>

              <div className="rounded-2xl bg-blue-50 px-4 py-3 text-right text-blue-700">
                <div className="text-[10px] font-black">담당 환자</div>
                <div className="text-lg font-black">{assignedPatients.length}명</div>
              </div>
            </div>
          </div>

          <div className="grid h-[calc(100%-76px)] min-h-0 grid-cols-1 gap-3 overflow-hidden md:grid-cols-2 xl:grid-cols-3">
            {assignedPatients.slice(0, 9).map(patient => (
              <PatientMiniCard key={patient.id} patient={patient} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

// 어두운 프로필 카드 안의 핵심 수치를 표시하는 기능
function DarkStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-center">
      <div className="text-[10px] font-black text-slate-400">{label}</div>
      <div className="mt-1 text-2xl font-black text-white">{value}</div>
    </div>
  );
}

// 프로필 라벨과 값을 한 줄로 표시하는 기능
function ProfileLine({ label, value, dark = false }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className={dark ? 'font-bold text-slate-400' : 'font-bold text-slate-400'}>{label}</span>
      <span className={dark ? 'font-black text-slate-100' : 'font-black text-slate-800'}>{value}</span>
    </div>
  );
}

// 연락 정보를 어두운 프로필 카드 안에서 표시하는 기능
function ContactBox({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3">
      <div className="text-[10px] font-black text-blue-300">{label}</div>
      <div className="mt-1 truncate text-sm font-black text-white">{value}</div>
    </div>
  );
}

// 담당 환자 미니 카드를 표시하는 기능
function PatientMiniCard({ patient }) {
  const isWaiting = patient.status === 'waiting';

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-lg font-black text-slate-900">{patient.name}</div>
          <div className="mt-1 text-xs font-medium text-slate-500">
            {patient.sex} / {patient.age}세 · {patient.id}
          </div>
        </div>

        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black ${
          isWaiting
            ? 'bg-orange-100 text-orange-700'
            : 'bg-slate-200 text-slate-500'
        }`}>
          {isWaiting ? '대기' : '완료'}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <PatientMetric label="예약" value={patient.time} />
        <PatientMetric label="최근 기록" value={patient.lastDialysis} />
      </div>
    </div>
  );
}

// 환자 카드 안의 작은 지표를 표시하는 기능
function PatientMetric({ label, value }) {
  return (
    <div className="rounded-xl bg-white px-3 py-2">
      <div className="text-[10px] font-black text-slate-400">{label}</div>
      <div className="mt-0.5 truncate text-xs font-black text-slate-700">{value}</div>
    </div>
  );
}
