// "use client";
// // CustomerOverview.jsx - Öğrenci ve Öğretmen istatistikleri bileşeni
// import React from "react";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   Legend,
//   Tooltip,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
// } from "recharts";
// import { ageGroups, students, contents, statistics } from "./mockData";

// const CustomerOverview = () => {
//   // Yaş gruplarına göre öğrenci dağılımı
//   const studentAgeDistribution = ageGroups.map((ageGroup) => {
//     const count = students.filter((s) => {
//       if (ageGroup === "3-4 yaş") return s.age >= 3 && s.age < 4;
//       if (ageGroup === "4-5 yaş") return s.age >= 4 && s.age < 5;
//       if (ageGroup === "5-6 yaş") return s.age >= 5 && s.age <= 6;
//       return false;
//     }).length;

//     return {
//       name: ageGroup,
//       value: count,
//     };
//   });

//   // İçerik türlerine göre dağılım
//   const contentDistribution = statistics.contentTypeStats.map((stat) => ({
//     name: stat.type,
//     value: stat.count,
//   }));

//   // Pie chart için renkler
//   const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

//   // İçerik türlerine göre tamamlanma oranları
//   const completionByType = statistics.contentTypeStats.map((stat) => ({
//     name: stat.type,
//     Oran: stat.completionRate,
//   }));

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//       <div className="bg-white p-6 rounded-lg shadow">
//         <h3 className="text-lg font-medium text-gray-900 mb-4">
//           Yaş Gruplarına Göre Dağılım
//         </h3>
//         <div className="h-64">
//           <ResponsiveContainer width="100%" height="100%">
//             <PieChart>
//               <Pie
//                 data={studentAgeDistribution}
//                 cx="50%"
//                 cy="50%"
//                 labelLine={false}
//                 outerRadius={80}
//                 fill="#8884d8"
//                 dataKey="value"
//                 label={({ name, percent }) =>
//                   `${name}: ${(percent * 100).toFixed(0)}%`
//                 }
//               >
//                 {studentAgeDistribution.map((entry, index) => (
//                   <Cell
//                     key={`cell-${index}`}
//                     fill={COLORS[index % COLORS.length]}
//                   />
//                 ))}
//               </Pie>
//               <Legend layout="vertical" verticalAlign="middle" align="right" />
//               <Tooltip formatter={(value) => [`${value} öğrenci`, "Toplam"]} />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//         <div className="mt-4 grid grid-cols-3 gap-4">
//           {studentAgeDistribution.map((item, index) => (
//             <div key={index} className="text-center">
//               <div className="text-2xl font-bold">{item.value}</div>
//               <div className="text-xs text-gray-500">{item.name}</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="bg-white p-6 rounded-lg shadow">
//         <h3 className="text-lg font-medium text-gray-900 mb-4">
//           İçerik Türlerine Göre Dağılım
//         </h3>
//         <div className="h-64">
//           <ResponsiveContainer width="100%" height="100%">
//             <PieChart>
//               <Pie
//                 data={contentDistribution}
//                 cx="50%"
//                 cy="50%"
//                 labelLine={false}
//                 outerRadius={80}
//                 fill="#8884d8"
//                 dataKey="value"
//                 label={({ name, percent }) =>
//                   `${name}: ${(percent * 100).toFixed(0)}%`
//                 }
//               >
//                 {contentDistribution.map((entry, index) => (
//                   <Cell
//                     key={`cell-${index}`}
//                     fill={COLORS[index % COLORS.length]}
//                   />
//                 ))}
//               </Pie>
//               <Legend layout="vertical" verticalAlign="middle" align="right" />
//               <Tooltip formatter={(value) => [`${value} içerik`, "Toplam"]} />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//         <div className="mt-4">
//           <h4 className="text-sm font-medium text-gray-700 mb-2">
//             İçerik Türlerine Göre Tamamlanma Oranı
//           </h4>
//           <div className="h-32">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart
//                 data={completionByType}
//                 margin={{
//                   top: 5,
//                   right: 30,
//                   left: 20,
//                   bottom: 5,
//                 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip
//                   formatter={(value) => [`${value}%`, "Tamamlanma Oranı"]}
//                 />
//                 <Bar dataKey="Oran" fill="#8884d8" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CustomerOverview;
import React from 'react'

function CustomerOverview() {
  return (
    <div>
      
    </div>
  )
}

export default CustomerOverview
