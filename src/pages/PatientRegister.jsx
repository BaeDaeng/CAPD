import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

export default function PatientRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    doctorName: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    alert("환자 회원가입이 완료되었습니다. 로그인해주세요.");
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">환자 회원가입</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="이름" name="name" placeholder="성함을 입력하세요" onChange={handleChange} required />
          <Input label="이메일" name="email" type="email" placeholder="example@mail.com" onChange={handleChange} required />
          <Input label="전화번호" name="phone" placeholder="010-0000-0000" onChange={handleChange} required />
          <Input label="담당의사 성함" name="doctorName" placeholder="담당 선생님 성함을 입력" onChange={handleChange} required />
          <Input label="비밀번호" name="password" type="password" placeholder="8자 이상 입력" onChange={handleChange} required />
          <Input label="비밀번호 확인" name="confirmPassword" type="password" placeholder="비밀번호 재입력" onChange={handleChange} required />
          
          <div className="pt-4 flex flex-col gap-3">
            <Button type="submit" className="w-full py-3">가입 완료</Button>
            <Button variant="secondary" onClick={() => navigate('/login')} className="w-full">이전으로</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}