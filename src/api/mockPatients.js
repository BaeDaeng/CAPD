// 환자 10명의 통합 Mock 데이터
export const patientsData = [
  { 
    id: 'P001', name: '김환자', age: 62, sex: 'M', 
    record: 4, uf: 1120, weight: 74.6, bp: '155/93', fbs: 142, ai: '혈압 상승, 제수량 감소 경고', trend: [1300, 1250, 1280, 1150, 1100, 1100, 1120], isWarning: true,
    time: '09:30', status: 'waiting', lastDialysis: '2026.04.15 12:00'
  },
  { 
    id: 'P002', name: '이환자', age: 45, sex: 'F', 
    record: 4, uf: 1450, weight: 55.2, bp: '120/80', fbs: 95, ai: '-', trend: [1400, 1420, 1450, 1430, 1440, 1460, 1450], isWarning: false,
    time: '10:00', status: 'done', lastDialysis: '2026.04.15 12:00'
  },
  { 
    id: 'P003', name: '최환자', age: 71, sex: 'M', 
    record: 2, uf: 650, weight: 68.1, bp: '135/85', fbs: 110, ai: '오후 기록 2건 누락', trend: [1100, 1150, 1120, 1180, 1100, 650, 650], isWarning: true,
    time: '10:30', status: 'waiting', lastDialysis: '2026.04.15 12:00'
  },
  { 
    id: 'P004', name: '박환자', age: 58, sex: 'F', 
    record: 4, uf: 1200, weight: 60.5, bp: '125/82', fbs: 105, ai: '-', trend: [1180, 1190, 1200, 1210, 1190, 1200, 1200], isWarning: false,
    time: '11:00', status: 'done', lastDialysis: '2026.04.15 13:30'
  },
  { 
    id: 'P005', name: '정환자', age: 52, sex: 'M', 
    record: 5, uf: 1350, weight: 72.0, bp: '130/85', fbs: 125, ai: '-', trend: [1300, 1320, 1310, 1350, 1340, 1330, 1350], isWarning: false,
    time: '13:30', status: 'waiting', lastDialysis: '2026.04.15 08:00'
  },
  { 
    id: 'P006', name: '배환자', age: 66, sex: 'F', 
    record: 4, uf: 950, weight: 63.8, bp: '145/90', fbs: 155, ai: '공복혈당 150 초과 (3일째)', trend: [1000, 980, 950, 970, 960, 940, 950], isWarning: true,
    time: '14:00', status: 'waiting', lastDialysis: '2026.04.15 12:30'
  },
  { 
    id: 'P007', name: '임환자', age: 48, sex: 'M', 
    record: 1, uf: 300, weight: 78.2, bp: '128/84', fbs: 100, ai: '아침 기록 확인 요망', trend: [1200, 1220, 1190, 1210, 1200, 300, 300], isWarning: true,
    time: '14:30', status: 'done', lastDialysis: '2026.04.15 07:00'
  },
  { 
    id: 'P008', name: '윤환자', age: 55, sex: 'F', 
    record: 4, uf: 1250, weight: 58.9, bp: '118/78', fbs: 92, ai: '-', trend: [1230, 1240, 1260, 1250, 1240, 1250, 1250], isWarning: false,
    time: '15:00', status: 'waiting', lastDialysis: '2026.04.15 12:00'
  },
  { 
    id: 'P009', name: '오환자', age: 69, sex: 'M', 
    record: 4, uf: 1500, weight: 70.4, bp: '122/80', fbs: 108, ai: '-', trend: [1480, 1490, 1510, 1500, 1480, 1490, 1500], isWarning: false,
    time: '15:30', status: 'done', lastDialysis: '2026.04.15 12:00'
  },
  { 
    id: 'P010', name: '신환자', age: 41, sex: 'F', 
    record: 3, uf: 980, weight: 52.1, bp: '115/75', fbs: 88, ai: '야간 기록 지연', trend: [1300, 1280, 1310, 1290, 1300, 980, 980], isWarning: true,
    time: '16:00', status: 'waiting', lastDialysis: '2026.04.15 12:00'
  },
];