import React from "react";

const StatCard = ({ icon: Icon, label, value, color = "text-blue-500" }) => {
  return (
    <div className="p-4 rounded-2xl border accent-border accent-bg-mode shadow-sm space-y-1">
      <span className={`text-xs font-bold flex items-center gap-1.5 ${color}`}>
        <Icon className="w-3.5 h-3.5" /> {label}
      </span>
      <p className="text-2xl font-extrabold accent-text">{value ?? 0}</p>
    </div>
  );
};

export default StatCard;
