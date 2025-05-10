 // components/Dashboard/hooks/useContentFilters.js

import { useEffect, useState } from "react";

const useContentFilters = (contents) => {
  // Filtreleme ile ilgili state'ler
  const [searchTerm, setSearchTerm] = useState("");
  const [activeType, setActiveType] = useState("all");
  const [advancedFilterOptions, setAdvancedFilterOptions] = useState({
    ageGroup: "",
    status: "",
    publishDateStudent: "",
    publishDateTeacher: "",
    weeklyContent: false,
  });
  const [filteredContents, setFilteredContents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Filtreleme işlemi
  useEffect(() => {
    const filtered = contents.data?.filter((content) => {
      const title = (content.title || "").toLowerCase();

      const matchesSearch =
        searchTerm === "" || title.includes(searchTerm.toLowerCase());

      const matchesType =
        activeType === "all" ||
        !activeType ||
        (content.type && content.type === activeType);

      const matchesStatus =
        !advancedFilterOptions.status ||
        (content.status && content.status === advancedFilterOptions.status);

      const matchesAgeGroup =
        !advancedFilterOptions.ageGroup ||
        (content.ageGroup &&
          content.ageGroup === advancedFilterOptions.ageGroup);

      const studentDateFilter = advancedFilterOptions.publishDateStudent
        ? new Date(advancedFilterOptions.publishDateStudent)
        : null;
      const contentStudentDate = content.publishDateStudent
        ? new Date(content.publishDateStudent)
        : null;
      const matchesStudentDate = (() => {
        if (!studentDateFilter) return true;
        if (content.isWeeklyContent) return false;
        if (!contentStudentDate) return false;
        return (
          contentStudentDate.toDateString() === studentDateFilter.toDateString()
        );
      })();

      const teacherDateFilter = advancedFilterOptions.publishDateTeacher
        ? new Date(advancedFilterOptions.publishDateTeacher)
        : null;
      const matchesWeeklyContent =
        !advancedFilterOptions.weeklyContent ||
        content.isWeeklyContent === true;

      const matchesTeacherDate = (() => {
        if (!teacherDateFilter) return true;
        if (advancedFilterOptions.weeklyContent) {
          const weeklyDate = content.weeklyContentStartDate
            ? new Date(content.weeklyContentStartDate)
            : null;
          return (
            weeklyDate &&
            weeklyDate.toDateString() === teacherDateFilter.toDateString()
          );
        } else {
          const teacherDate = content.publishDateTeacher
            ? new Date(content.publishDateTeacher)
            : null;
          return (
            teacherDate &&
            teacherDate.toDateString() === teacherDateFilter.toDateString()
          );
        }
      })();

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus &&
        matchesAgeGroup &&
        matchesStudentDate &&
        matchesTeacherDate &&
        matchesWeeklyContent
      );
    });

    setFilteredContents(filtered);
    setCurrentPage(1); // Filtre değişince sayfa başa alınır
  }, [contents, searchTerm, activeType, advancedFilterOptions]);

  return {
    searchTerm,
    setSearchTerm,
    activeType,
    setActiveType,
    advancedFilterOptions,
    setAdvancedFilterOptions,
    filteredContents,
    setFilteredContents,
    currentPage,
    setCurrentPage,
  };
};

export default useContentFilters;
