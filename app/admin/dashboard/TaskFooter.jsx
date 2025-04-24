"use client";

import { Check, Clock } from "lucide-react";

const FooterStats = ({ tasks }) => {
    const completedCount = tasks.filter((t) => t.isCompleted).length;
    const ongoingCount = tasks.filter((t) => !t.isCompleted).length;

    return (
        <div className="flex flex-wrap items-center gap-4 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-2 bg-green-100 text-green-800 text-xs font-medium px-4 py-2 rounded-full">
                <Check size={12} />
                <span>{completedCount} tamamlandı</span>
            </div>
            <div className="flex items-center space-x-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-4 py-2 rounded-full">
                <Clock size={12} />
                <span>{ongoingCount} devam ediyor</span>
            </div>
        </div>
    );
};

export default FooterStats;