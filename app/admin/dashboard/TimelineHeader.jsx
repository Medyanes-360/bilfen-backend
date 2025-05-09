import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react'

const TimelineHeader = ({goToPreviousWeek,selectedDate,goToNextWeek,onDateChange }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 md:p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
      Zaman Çizelgesi
    </h2>
    <div className="flex items-center gap-2">
      <button
        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
        onClick={goToPreviousWeek}
      >
        <ChevronLeft size={20} className="text-gray-700" />
      </button>
      <div className="relative items-center">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="cursor-pointer pl-3 pr-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 bg-white text-orange-500 hover:bg-gray-50 transition-colors duration-200"
        />
      </div>

      <button
        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
        onClick={goToNextWeek}
      >
        <ChevronRight size={20} className="text-gray-700" />
      </button>
    </div>
  </div>
  )
}

export default TimelineHeader