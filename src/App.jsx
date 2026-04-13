import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import useAppStore from './store/useAppStore';

// 페이지 컴포넌트 호출
import LoginPage from './pages/LoginPage';
import DoctorRegister from './pages/DoctorRegister';
import PatientRegister from './pages/PatientRegister';

// 환자용 페이지 (나중에 실제 파일 생성 후 연결)
import PatientDashboard from './pages/patient/Dashboard';
import PatientChat from './pages/patient/ChatSymptom';

// 의사용 페이지 (나중에 실제 파일 생성 후 연결)
import DoctorDashboard from './pages/doctor/Dashboard';

// 레이아웃 컴포넌트
import PatientLayout from './components/PatientLayout';
import DoctorLayout from './components/DoctorLayout';

function App() {
  // 현재 로그인한 사용자의 정보를 가져옵니다.
  // const { user } = useAppStore();

  return (
    <Router>
      <Routes>
        {/* [공통] 첫 화면: 로그인 페이지 */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* [회원가입] 권한별 가입 페이지 */}
        <Route path="/register/doctor" element={<DoctorRegister />} />
        <Route path="/register/patient" element={<PatientRegister />} />

        {/* [환자용 경로] /patient 로 시작하는 모든 경로는 PatientLayout을 따름 */}
        <Route path="/patient" element={<PatientLayout />}>
          <Route index element={<PatientDashboard />} />
          <Route path="survey" element={<PatientChat />} />
        </Route>

        {/* [의사용 경로] /doctor 로 시작하는 모든 경로는 DoctorLayout을 따름 */}
        <Route path="/doctor" element={<DoctorLayout />}>
          <Route index element={<DoctorDashboard />} />
          {/* 환자 상세 페이지도 동일한 대시보드 구조 내에서 처리 */}
          <Route path=":patientId" element={<DoctorDashboard />} />
        </Route>

        {/* 초기 접속 시 /login으로 리다이렉트 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* 정의되지 않은 모든 경로는 로그인 페이지로 이동 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;