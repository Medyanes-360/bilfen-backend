// mockData.js - Tüm uygulama için güncellenmiş mock veriler

// Kullanıcı rolleri
export const userRoles = {
    STUDENT: "student",
    TEACHER: "teacher",
    ADMIN: "admin"
  };
  
  // Geri bildirim durumları
  export const feedbackStatuses = {
    WAITING: "İnceleme Bekliyor",
    REVIEWED: "Değerlendirildi",
    APPROVED: "Onaylandı",
    REJECTED: "Reddedildi"
  };
  
  // Yaş grupları
  export const ageGroups = ["3-4 yaş", "4-5 yaş", "5-6 yaş"];
  
  // İçerik türleri
  export const contentTypes = ["Video", "Oyun", "Doküman", "Etkileşimli İçerik"];
  
  // Branşlar
  export const branches = ["Okul Öncesi", "İngilizce", "Müzik", "Görsel Sanatlar", "Drama", "Beden Eğitimi"];
  
  // Mock öğrenciler
  export const students = [
    { id: 1, fullName: "Ali Yılmaz", tc: "12345678901", age: 5, completionRate: 85, activeTime: 75, totalTasksCompleted: 120 },
    { id: 2, fullName: "Ayşe Demir", tc: "12345678902", age: 4, completionRate: 92, activeTime: 90, totalTasksCompleted: 150 },
    { id: 3, fullName: "Mehmet Kaya", tc: "12345678903", age: 6, completionRate: 78, activeTime: 60, totalTasksCompleted: 110 },
    { id: 4, fullName: "Zeynep Koç", tc: "12345678904", age: 3, completionRate: 95, activeTime: 85, totalTasksCompleted: 130 },
    { id: 5, fullName: "Mustafa Şahin", tc: "12345678905", age: 5, completionRate: 80, activeTime: 70, totalTasksCompleted: 115 },
    { id: 6, fullName: "Elif Öztürk", tc: "12345678906", age: 4, completionRate: 88, activeTime: 80, totalTasksCompleted: 125 },
    { id: 7, fullName: "Cem Yıldız", tc: "12345678907", age: 6, completionRate: 75, activeTime: 65, totalTasksCompleted: 105 },
    { id: 8, fullName: "Sude Aydın", tc: "12345678908", age: 3, completionRate: 90, activeTime: 85, totalTasksCompleted: 145 },
  ];
  
  // Mock öğretmenler
  export const teachers = [
    { id: 1, fullName: "Fatma Öğretmen", branch: "Okul Öncesi", tc: "98765432101" },
    { id: 2, fullName: "Ahmet Öğretmen", branch: "İngilizce", tc: "98765432102" },
    { id: 3, fullName: "Aylin Öğretmen", branch: "Müzik", tc: "98765432103" },
    { id: 4, fullName: "Serkan Öğretmen", branch: "Görsel Sanatlar", tc: "98765432104" },
    { id: 5, fullName: "Deniz Öğretmen", branch: "Drama", tc: "98765432105" },
  ];
  
  // Mock içerikler
  export const contents = [
    { 
      id: 1, 
      title: "Renkleri Öğreniyorum", 
      type: "Video", 
      ageGroup: "3-4 yaş", 
      branch: "Okul Öncesi", 
      publishDate: "2025-03-20", 
      duration: "00:08:45",
      completed: 42,
      opened: 50,
      description: "Temel renkleri eğlenceli bir şekilde öğreten video içeriği.",
      author: "Fatma Öğretmen",
      thumbnail: "/thumbnails/renkler.jpg"
    },
    { 
      id: 2, 
      title: "İngilizce Sayılar", 
      type: "Etkileşimli İçerik", 
      ageGroup: "4-5 yaş", 
      branch: "İngilizce", 
      publishDate: "2025-03-21", 
      duration: "00:10:20",
      completed: 38,
      opened: 45,
      description: "1'den 10'a kadar sayıları İngilizce olarak öğreten etkileşimli etkinlik.",
      author: "Ahmet Öğretmen",
      thumbnail: "/thumbnails/sayilar.jpg"
    },
    { 
      id: 3, 
      title: "Hayvanlar Alemi", 
      type: "Oyun", 
      ageGroup: "5-6 yaş", 
      branch: "Okul Öncesi", 
      publishDate: "2025-03-22", 
      duration: "00:15:00",
      completed: 35,
      opened: 40,
      description: "Çiftlik ve orman hayvanlarını tanıtan, seslerini öğreten eğlenceli bir oyun.",
      author: "Fatma Öğretmen",
      thumbnail: "/thumbnails/hayvanlar.jpg"
    },
    { 
      id: 4, 
      title: "Şekiller ve Uzamsal Farkındalık", 
      type: "Doküman", 
      ageGroup: "4-5 yaş", 
      branch: "Okul Öncesi", 
      publishDate: "2025-03-23", 
      duration: "00:12:30",
      completed: 28,
      opened: 35,
      description: "Temel geometrik şekilleri ve uzamsal kavramları (üstünde, altında, yanında) öğreten doküman.",
      author: "Fatma Öğretmen",
      thumbnail: "/thumbnails/sekiller.jpg"
    },
    { 
      id: 5, 
      title: "Ritmik Hareketler", 
      type: "Video", 
      ageGroup: "3-4 yaş", 
      branch: "Müzik", 
      publishDate: "2025-03-24", 
      duration: "00:09:15",
      completed: 33,
      opened: 40,
      description: "Müzik eşliğinde basit ritmik hareketlerin gösterildiği video.",
      author: "Aylin Öğretmen",
      thumbnail: "/thumbnails/ritim.jpg"
    },
    { 
      id: 6, 
      title: "El Becerileri Geliştirme", 
      type: "Etkileşimli İçerik", 
      ageGroup: "5-6 yaş", 
      branch: "Görsel Sanatlar", 
      publishDate: "2025-03-19", 
      duration: "00:14:50",
      completed: 30,
      opened: 38,
      description: "İnce motor becerilerini ve el-göz koordinasyonunu geliştirmeye yönelik etkileşimli etkinlikler.",
      author: "Serkan Öğretmen",
      thumbnail: "/thumbnails/elbecerileri.jpg"
    },
    { 
      id: 7, 
      title: "Mevsimler ve Hava Durumu", 
      type: "Video", 
      ageGroup: "4-5 yaş", 
      branch: "Okul Öncesi", 
      publishDate: "2025-03-18", 
      duration: "00:11:25",
      completed: 40,
      opened: 45,
      description: "Mevsimler ve hava durumu konularını tanıtan, mevsimsel değişimleri gösteren video içeriği.",
      author: "Fatma Öğretmen",
      thumbnail: "/thumbnails/mevsimler.jpg"
    },
    { 
      id: 8, 
      title: "Örüntü Oluşturma", 
      type: "Oyun", 
      ageGroup: "5-6 yaş", 
      branch: "Okul Öncesi", 
      publishDate: "2025-03-17", 
      duration: "00:13:10",
      completed: 36,
      opened: 42,
      description: "Temel matematiksel örüntüleri tanıma ve sürdürme becerisini geliştiren oyun.",
      author: "Fatma Öğretmen",
      thumbnail: "/thumbnails/oruntu.jpg"
    },
  ];
  
  // Her gün için ayrı içerikler
  export const dailyContents = {
    "2025-03-16": [
      { 
        id: 101, 
        title: "Ses Tanıma Oyunu", 
        type: "Oyun", 
        ageGroup: "3-4 yaş", 
        branch: "Okul Öncesi", 
        duration: "00:10:30"
      },
      { 
        id: 102, 
        title: "Sayı Tanıma", 
        type: "Video", 
        ageGroup: "3-4 yaş", 
        branch: "Okul Öncesi", 
        duration: "00:07:45"
      },
      { 
        id: 103, 
        title: "Renklerle Boyama", 
        type: "Etkileşimli İçerik", 
        ageGroup: "3-4 yaş", 
        branch: "Görsel Sanatlar", 
        duration: "00:12:00"
      }
    ],
    "2025-03-17": [
      { 
        id: 104, 
        title: "Örüntü Oluşturma", 
        type: "Oyun", 
        ageGroup: "5-6 yaş", 
        branch: "Okul Öncesi", 
        duration: "00:13:10"
      },
      { 
        id: 105, 
        title: "İngilizce Meyve İsimleri", 
        type: "Video", 
        ageGroup: "4-5 yaş", 
        branch: "İngilizce", 
        duration: "00:09:25"
      },
      { 
        id: 106, 
        title: "Çizgi Çalışmaları", 
        type: "Doküman", 
        ageGroup: "4-5 yaş", 
        branch: "Okul Öncesi", 
        duration: "00:10:30"
      }
    ],
    "2025-03-18": [
      { 
        id: 107, 
        title: "Mevsimler ve Hava Durumu", 
        type: "Video", 
        ageGroup: "4-5 yaş", 
        branch: "Okul Öncesi", 
        duration: "00:11:25"
      },
      { 
        id: 108, 
        title: "Duygular Etkinliği", 
        type: "Etkileşimli İçerik", 
        ageGroup: "5-6 yaş", 
        branch: "Drama", 
        duration: "00:14:20"
      },
      { 
        id: 109, 
        title: "Temel Müzik Aletleri", 
        type: "Video", 
        ageGroup: "3-4 yaş", 
        branch: "Müzik", 
        duration: "00:08:35"
      }
    ],
    "2025-03-19": [
      { 
        id: 110, 
        title: "El Becerileri Geliştirme", 
        type: "Etkileşimli İçerik", 
        ageGroup: "5-6 yaş", 
        branch: "Görsel Sanatlar", 
        duration: "00:14:50"
      },
      { 
        id: 111, 
        title: "Günlük Rutinler", 
        type: "Video", 
        ageGroup: "3-4 yaş", 
        branch: "Okul Öncesi", 
        duration: "00:09:40"
      },
      { 
        id: 112, 
        title: "Dikkat Geliştirme Oyunu", 
        type: "Oyun", 
        ageGroup: "4-5 yaş", 
        branch: "Okul Öncesi", 
        duration: "00:12:15"
      }
    ],
    "2025-03-20": [
      { 
        id: 113, 
        title: "Renkleri Öğreniyorum", 
        type: "Video", 
        ageGroup: "3-4 yaş", 
        branch: "Okul Öncesi", 
        duration: "00:08:45"
      },
      { 
        id: 114, 
        title: "El Becerisi Geliştirme", 
        type: "Etkileşimli İçerik", 
        ageGroup: "5-6 yaş", 
        branch: "Görsel Sanatlar", 
        duration: "00:14:50"
      },
      { 
        id: 115, 
        title: "Hayvanlar Alemi", 
        type: "Oyun", 
        ageGroup: "5-6 yaş", 
        branch: "Okul Öncesi", 
        duration: "00:15:00"
      }
    ],
    "2025-03-21": [
      { 
        id: 116, 
        title: "İngilizce Sayılar", 
        type: "Etkileşimli İçerik", 
        ageGroup: "4-5 yaş", 
        branch: "İngilizce", 
        duration: "00:10:20"
      },
      { 
        id: 117, 
        title: "Orman Hayvanları", 
        type: "Video", 
        ageGroup: "3-4 yaş", 
        branch: "Okul Öncesi", 
        duration: "00:09:35"
      },
      { 
        id: 118, 
        title: "Grup Oyunları", 
        type: "Doküman", 
        ageGroup: "5-6 yaş", 
        branch: "Beden Eğitimi", 
        duration: "00:11:45"
      }
    ],
    "2025-03-22": [
      { 
        id: 119, 
        title: "Harfleri Tanıma", 
        type: "Video", 
        ageGroup: "5-6 yaş", 
        branch: "Okul Öncesi", 
        duration: "00:12:10"
      },
      { 
        id: 120, 
        title: "Müzik ve Dans", 
        type: "Etkileşimli İçerik", 
        ageGroup: "4-5 yaş", 
        branch: "Müzik", 
        duration: "00:13:25"
      },
      { 
        id: 121, 
        title: "Nesneleri Sınıflandırma", 
        type: "Oyun", 
        ageGroup: "3-4 yaş", 
        branch: "Okul Öncesi", 
        duration: "00:10:50"
      }
    ],
    "2025-03-23": [
      { 
        id: 122, 
        title: "Şekiller ve Uzamsal Farkındalık", 
        type: "Doküman", 
        ageGroup: "4-5 yaş", 
        branch: "Okul Öncesi", 
        duration: "00:12:30"
      },
      { 
        id: 123, 
        title: "İngilizce Renkler", 
        type: "Video", 
        ageGroup: "4-5 yaş", 
        branch: "İngilizce", 
        duration: "00:09:15"
      },
      { 
        id: 124, 
        title: "Hikaye Oluşturma", 
        type: "Etkileşimli İçerik", 
        ageGroup: "5-6 yaş", 
        branch: "Drama", 
        duration: "00:15:30"
      }
    ],
  "2025-03-24": [
  { 
    id: 125, 
    title: "Ritmik Hareketler", 
    type: "Video", 
    ageGroup: "3-4 yaş", 
    branch: "Müzik", 
    duration: "00:09:15"
  },
  { 
    id: 126, 
    title: "Sayı Sayma Oyunu", 
    type: "Oyun", 
    ageGroup: "4-5 yaş", 
    branch: "Okul Öncesi", 
    duration: "00:11:40"
  },
  { 
    id: 127, 
    title: "Görsel Uyaran Çalışması", 
    type: "Doküman", 
    ageGroup: "5-6 yaş", 
    branch: "Okul Öncesi", 
    duration: "00:13:20"
  },
  { 
    id: 128, 
    title: "Renkleri Öğreniyorum", 
    type: "Video", 
    ageGroup: "2-3 yaş", 
    branch: "Görsel Sanatlar", 
    duration: "00:08:10"
  },
  { 
    id: 129, 
    title: "Şekil Eşleştirme Oyunu", 
    type: "Oyun", 
    ageGroup: "3-4 yaş", 
    branch: "Zeka Gelişimi", 
    duration: "00:10:25"
  },
  { 
    id: 130, 
    title: "Hikaye Zamanı: Küçük Ayı", 
    type: "Video", 
    ageGroup: "4-5 yaş", 
    branch: "Dil Gelişimi", 
    duration: "00:12:00"
  },
  { 
    id: 131, 
    title: "Nesne Tanıma Kartları", 
    type: "Doküman", 
    ageGroup: "2-3 yaş", 
    branch: "Okul Öncesi", 
    duration: "00:07:45"
  },
  { 
    id: 132, 
    title: "Hayvan Sesleriyle Tanışma", 
    type: "Video", 
    ageGroup: "3-4 yaş", 
    branch: "Fen Bilgisi", 
    duration: "00:09:50"
  },
  { 
    id: 133, 
    title: "Duygu Eşleştirme Oyunu", 
    type: "Oyun", 
    ageGroup: "5-6 yaş", 
    branch: "Psikolojik Gelişim", 
    duration: "00:14:30"
  }
]

  };
  
  // Mock öğretmen geri bildirimleri
  export const teacherFeedbacks = [
    { 
      id: 1, 
      teacherId: 1, 
      teacherName: "Fatma Öğretmen", 
      contentId: 1, 
      contentTitle: "Renkleri Öğreniyorum", 
      message: "Video çok eğitici olmuş, ancak bazı renklerin daha net gösterilmesi gerekiyor.", 
      date: "2025-03-19 14:30:25", 
      status: "İnceleme Bekliyor", 
      adminResponse: "" 
    },
    { 
      id: 2, 
      teacherId: 2, 
      teacherName: "Ahmet Öğretmen", 
      contentId: 2, 
      contentTitle: "İngilizce Sayılar", 
      message: "Etkileşimli içerik çok başarılı, öğrenciler için uygun seviyede.", 
      date: "2025-03-20 10:15:40", 
      status: "Onaylandı", 
      adminResponse: "Teşekkürler, yorumunuz için. İçeriği bu şekilde devam ettireceğiz." 
    },
    { 
      id: 3, 
      teacherId: 3, 
      teacherName: "Aylin Öğretmen", 
      contentId: 5, 
      contentTitle: "Ritmik Hareketler", 
      message: "Müzik parçaları daha ritimli olabilir, öğrencilerin takip etmesi zorlaşıyor.", 
      date: "2025-03-20 15:45:10", 
      status: "Değerlendirildi", 
      adminResponse: "Müzik parçalarının temposunu ayarlayacağız." 
    },
    { 
      id: 4, 
      teacherId: 1, 
      teacherName: "Fatma Öğretmen", 
      contentId: 4, 
      contentTitle: "Şekiller ve Uzamsal Farkındalık", 
      message: "Doküman içeriği çok yoğun, daha sade hazırlanabilir.", 
      date: "2025-03-21 09:30:15", 
      status: "Reddedildi", 
      adminResponse: "İçerik yaş grubuna uygun olarak hazırlandı, düzenlemeye gerek yok." 
    },
    { 
      id: 5, 
      teacherId: 4, 
      teacherName: "Serkan Öğretmen", 
      contentId: 6, 
      contentTitle: "El Becerileri Geliştirme", 
      message: "Etkinlik çok başarılı, öğrenciler için uygun zorluk seviyesinde.", 
      date: "2025-03-22 13:20:30", 
      status: "İnceleme Bekliyor", 
      adminResponse: "" 
    },
  ];
  
  // Zaman çizelgesi için günler
  export const timelineDays = [
    { date: "2025-03-16", isActive: false, isPast: true },
    { date: "2025-03-17", isActive: false, isPast: true },
    { date: "2025-03-18", isActive: false, isPast: true },
    { date: "2025-03-19", isActive: false, isPast: true },
    { date: "2025-03-20", isActive: true, isPast: false },
    { date: "2025-03-21", isActive: false, isPast: false },
    { date: "2025-03-22", isActive: false, isPast: false },
    { date: "2025-03-23", isActive: false, isPast: false },
    { date: "2025-03-24", isActive: false, isPast: false },
  ];
  
  // Öğrenci günlük ilerleme verileri
  export const studentProgress = [
    { date: "2025-03-16", completionRate: 85, totalTasks: 6, completedTasks: 5 },
    { date: "2025-03-17", completionRate: 100, totalTasks: 4, completedTasks: 4 },
    { date: "2025-03-18", completionRate: 75, totalTasks: 8, completedTasks: 6 },
    { date: "2025-03-19", completionRate: 90, totalTasks: 5, completedTasks: 4.5 },
    { date: "2025-03-20", completionRate: 60, totalTasks: 5, completedTasks: 3 },
  ];
  
  // İstatistik verileri
  export const statistics = {
    dailyCompletionRate: 82,
    dailyActiveStudents: 85,
    totalStudents: 100,
    mostCompletedContent: "Renkleri Öğreniyorum",
    leastCompletedContent: "Şekiller ve Uzamsal Farkındalık",
    averageTimePerContent: "00:08:30",
    mostActiveHour: "10:00 - 11:00",
    mostActiveDay: "Salı",
    contentTypeStats: [
      { type: "Video", completionRate: 85, count: 12 },
      { type: "Oyun", completionRate: 92, count: 8 },
      { type: "Doküman", completionRate: 70, count: 6 },
      { type: "Etkileşimli İçerik", completionRate: 88, count: 10 },
    ],
    dailyStats: [
      { day: "Pazartesi", activeStudents: 80, completionRate: 75 },
      { day: "Salı", activeStudents: 90, completionRate: 85 },
      { day: "Çarşamba", activeStudents: 85, completionRate: 82 },
      { day: "Perşembe", activeStudents: 88, completionRate: 80 },
      { day: "Cuma", activeStudents: 95, completionRate: 90 },
    ],
  };