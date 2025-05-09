import React, { useEffect, useRef } from "react";

const DateSelector = ({
  days,
  selectedDate,
  formatDate,
  selectDay,
  getDayStyle,
}) => {
  const scrollContainerRef = useRef(null);
  // Seçili gün değiştiğinde scroll pozisyonunu ayarla
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const selectedElement = container.querySelector(".date-selected");

      if (selectedElement) {
        // Seçili elementi ortala
        const centerPosition =
          selectedElement.offsetLeft -
          container.offsetWidth / 2 +
          selectedElement.offsetWidth / 2;
        container.scrollTo({
          left: centerPosition,
          behavior: "smooth",
        });
      }
    }
  }, [selectedDate]);
  return (
    <div className="relative w-full bg-gray-50 border-b border-gray-200">
      {/* Sol-Sağ Scroll Gradyanları */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>

      {/* Scroll Container */}
      <div
        ref={scrollContainerRef}
        className="flex px-2 py-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div className="flex mx-auto space-x-2 md:space-x-3">
          {days.map((day) => {
            const date = formatDate(day.date);
            return (
              <div
                key={day.date}
                onClick={() => selectDay(day.date)}
                className={`flex-shrink-0 rounded-lg border w-16 sm:w-20 md:w-24 py-2 px-1 flex flex-col items-center cursor-pointer snap-center ${getDayStyle(
                  day
                )} ${
                  day.date === selectedDate
                    ? "ring-2 ring-offset-2 ring-orange-300 date-selected"
                    : ""
                }`} // <-- BURAYA 'date-selected' classı
              >
                <div className="text-xs font-medium uppercase">
                  {date.weekday}
                </div>
                <div className="my-1 text-xl sm:text-2xl font-bold">
                  {date.day}
                </div>
                <div className="text-xs">{date.month}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DateSelector;
