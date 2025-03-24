// DashboardContext.jsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  timelineDays, 
  dailyContents, 
  contents, 
  students, 
  teachers, 
  teacherFeedbacks 
} from './mockData';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  // Tüm dashboard state'leri burada yönetilecek
  const [allContents, setAllContents] = useState(contents);
  const [allStudents, setAllStudents] = useState(students);
  const [allTeachers, setAllTeachers] = useState(teachers);
  const [allFeedbacks, setAllFeedbacks] = useState(teacherFeedbacks);
  const [timeline, setTimeline] = useState(timelineDays);
  const [selectedDate, setSelectedDate] = useState(timelineDays.find(day => day.isActive)?.date);
  const [dailyContent, setDailyContent] = useState([]);
  
  // Seçilen tarihe göre içerikleri güncelle
  useEffect(() => {
    if (selectedDate && dailyContents[selectedDate]) {
      setDailyContent(dailyContents[selectedDate]);
    } else {
      setDailyContent([]);
    }
  }, [selectedDate]);
  
  // İçerik ekleme fonksiyonu
  const addContent = (newContent) => {
    const updatedContents = [...allContents, { 
      id: allContents.length + 1, 
      ...newContent 
    }];
    setAllContents(updatedContents);
    
    // Eğer bugün için ise günlük içeriklere de ekle
    if (newContent.publishDate === selectedDate) {
      setDailyContent([...dailyContent, { id: allContents.length + 1, ...newContent }]);
    }
  };
  
  // İçerik düzenleme fonksiyonu
  const editContent = (id, updatedContent) => {
    const updatedContents = allContents.map(content => 
      content.id === id ? { ...content, ...updatedContent } : content
    );
    setAllContents(updatedContents);
    
    // Günlük içerikleri de güncelle
    setDailyContent(dailyContent.map(content => 
      content.id === id ? { ...content, ...updatedContent } : content
    ));
  };
  
  // İçerik silme fonksiyonu
  const deleteContent = (id) => {
    setAllContents(allContents.filter(content => content.id !== id));
    setDailyContent(dailyContent.filter(content => content.id !== id));
  };
  
  // Öğretmen geri bildirimi onay/red fonksiyonu
  const updateFeedbackStatus = (id, status, response) => {
    const updatedFeedbacks = allFeedbacks.map(feedback => 
      feedback.id === id ? { ...feedback, status, adminResponse: response } : feedback
    );
    setAllFeedbacks(updatedFeedbacks);
  };
  
  // Context'in değerleri
  const contextValue = {
    allContents,
    allStudents,
    allTeachers,
    allFeedbacks,
    timeline,
    selectedDate,
    dailyContent,
    setSelectedDate,
    addContent,
    editContent, 
    deleteContent,
    updateFeedbackStatus,
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);

export default DashboardContext;