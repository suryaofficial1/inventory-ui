import React from 'react';
import './DashboardCards.css';
import { UserRoundCheck, Users  ,FileText, RefreshCw, Gift, Shield } from 'lucide-react'; // You can replace icons as needed


const cardStats = new Map([
  [-1, { icon: '', label: '' }],
  [0, { icon: <UserRoundCheck size={28} color="#fff" />, bgColor: '#3FB6D9' }],
  [1, { icon: <Users size={28} color="#fff" />, bgColor: '#3EB780', }],
  [2, { icon: <Gift size={28} color="#fff" />, bgColor: '#FFA73B', }],
  [3, { icon: <RefreshCw size={28} color="#fff" />, bgColor: '#0B1C3F' }],
  [4, { icon: <Shield size={28} color="#fff" />, bgColor: '#2563EB' }]
]);

export default function DashboardCards({ data }) {
  console.log(data);
  return (

    <div className="card-container">
      {data && data.map((stat, idx) => {
        const cardStat = cardStats.get(idx) || {};
        return (
          <div
            key={idx}
            className="dashboard-card"
            style={{ backgroundColor: cardStat.bgColor || '#000' }}
          >
            <div className="icon-box">{cardStat.icon || <FileText size={28} color="#fff" />}</div>
            <div className="card-content">
              <h3>{stat.title}</h3>
              <h2>{stat.value}</h2>
            </div>
          </div>
        );
      })}
    </div>
  );
}

