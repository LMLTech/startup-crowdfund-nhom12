// Mock data for demonstration purposes
// In production, this will be replaced with actual API calls to Java Spring Boot backend

export const mockProjects = [
  {
    id: 1,
    title: 'EcoTech - Ứng dụng quản lý rác thải thông minh',
    description: 'Nền tảng công nghệ kết nối người dân với các đơn vị thu gom rác, giúp tối ưu hóa quy trình tái chế và bảo vệ môi trường.',
    fullDescription: 'EcoTech là giải pháp công nghệ toàn diện giúp quản lý và tối ưu hóa quy trình thu gom, phân loại và tái chế rác thải. Ứng dụng sử dụng AI để nhận diện các loại rác, đưa ra hướng dẫn phân loại và kết nối với đơn vị thu gom gần nhất. Chúng tôi cam kết giảm 40% lượng rác thải đổ ra môi trường trong vòng 2 năm.',
    category: 'Công nghệ - Môi trường',
    targetAmount: 500000000,
    currentAmount: 320000000,
    investorCount: 156,
    daysLeft: 45,
    startupName: 'EcoTech Vietnam',
    founderId: 2,
    founderName: 'Nguyễn Văn A',
    founderEmail: 'startup@ecotech.vn',
    status: 'approved',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800',
    tags: ['Công nghệ', 'Môi trường', 'AI', 'Tái chế'],
    createdAt: '2024-10-15',
    approvedAt: '2024-10-20',
    milestones: [
      { title: 'Phát triển MVP', description: 'Hoàn thành phiên bản beta', amount: 100000000, completed: true },
      { title: 'Marketing & Mở rộng', description: 'Triển khai tại 3 thành phố lớn', amount: 200000000, completed: false },
      { title: 'Nâng cấp AI', description: 'Tích hợp AI nhận diện nâng cao', amount: 200000000, completed: false },
    ],
    team: [
      { name: 'Nguyễn Văn A', role: 'CEO & Founder', bio: '10 năm kinh nghiệm trong lĩnh vực công nghệ môi trường' },
      { name: 'Trần Thị B', role: 'CTO', bio: 'Chuyên gia AI và Machine Learning' },
      { name: 'Lê Văn C', role: 'Head of Operations', bio: 'Quản lý vận hành và logistics' },
      { name: 'Phạm Thị D', role: 'Marketing Director', bio: 'Chuyên gia marketing và phát triển thương hiệu' },
    ],
    faqs: [
      { question: 'Ứng dụng hoạt động như thế nào?', answer: 'EcoTech sử dụng AI để nhận diện loại rác qua camera điện thoại, sau đó hướng dẫn phân loại và kết nối với đơn vị thu gom gần nhất.' },
      { question: 'Tôi sẽ nhận được lợi ích gì khi đầu tư?', answer: 'Nhà đầu tư sẽ nhận cổ phiếu của công ty với tỷ lệ phụ thuộc vào số vốn đầu tư. Khi công ty phát triển, giá trị cổ phiếu sẽ tăng.' },
      { question: 'Kế hoạch mở rộng ra sao?', answer: 'Chúng tôi sẽ triển khai tại Hà Nội, TP.HCM và Đà Nẵng trong năm đầu, sau đó mở rộng ra các tỉnh thành khác.' },
      { question: 'Chi phí sử dụng ứng dụng?', answer: 'Ứng dụng hoàn toàn miễn phí cho người dùng cuối. Chúng tôi thu phí từ các đơn vị thu gom rác và bán dữ liệu phân tích (ẩn danh).' },
    ],
    businessPlan: {
      market: 'Thị trường quản lý rác thải Việt Nam trị giá 2 tỷ USD/năm với tốc độ tăng trưởng 15%/năm.',
      competition: 'Hiện có ít đối thủ cạnh tranh trực tiếp. Các ứng dụng hiện tại chủ yếu tập trung vào thu gom mà thiếu tính năng AI và phân loại thông minh.',
      revenue: 'Thu nhập từ: (1) Phí dịch vụ từ đơn vị thu gom 30%, (2) Quảng cáo trong app 20%, (3) Bán dữ liệu phân tích 30%, (4) Dịch vụ tư vấn doanh nghiệp 20%.',
      growth: 'Năm 1: 10,000 users | Năm 2: 100,000 users | Năm 3: 500,000 users với tỷ lệ chuyển đổi 5% thành người dùng trả phí premium.',
    },
  },
  {
    id: 2,
    title: 'FoodShare - Nền tảng chia sẻ thực phẩm thừa',
    description: 'Kết nối nhà hàng, siêu thị với người tiêu dùng để giảm thiểu lãng phí thực phẩm, tạo giá trị cho cộng đồng.',
    fullDescription: 'FoodShare giúp giảm 60% lượng thực phẩm bị lãng phí từ các nhà hàng, quán ăn và siêu thị. Người dùng có thể mua thực phẩm còn tốt với giá ưu đãi vào cuối ngày. Chúng tôi đã có 200+ đối tác và đã cứu được hơn 50 tấn thực phẩm.',
    category: 'Xã hội - Ẩm thực',
    targetAmount: 300000000,
    currentAmount: 280000000,
    investorCount: 89,
    daysLeft: 12,
    startupName: 'FoodShare Co.',
    founderId: 3,
    founderName: 'Trần Thị B',
    founderEmail: 'contact@foodshare.vn',
    status: 'approved',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    tags: ['Xã hội', 'Ẩm thực', 'Môi trường'],
    createdAt: '2024-09-20',
    approvedAt: '2024-09-25',
    milestones: [
      { title: 'Mở rộng đối tác', description: '500 nhà hàng tham gia', amount: 150000000, completed: true },
      { title: 'Phát triển app mobile', description: 'Ra mắt iOS & Android', amount: 150000000, completed: false },
    ]
  },
  {
    id: 3,
    title: 'EduAI - Trợ lý học tập cá nhân hóa bằng AI',
    description: 'Nền tảng giáo dục sử dụng AI để tạo lộ trình học tập cá nhân hóa, phù hợp với từng học sinh.',
    fullDescription: 'EduAI phân tích điểm mạnh, điểm yếu của học sinh và đề xuất lộ trình học tập tối ưu. Với công nghệ Machine Learning, chúng tôi giúp học sinh cải thiện kết quả học tập lên 35% chỉ sau 3 tháng.',
    category: 'Giáo dục - Công nghệ',
    targetAmount: 800000000,
    currentAmount: 450000000,
    investorCount: 234,
    daysLeft: 60,
    startupName: 'EduAI Learning',
    founderId: 4,
    founderName: 'Lê Văn C',
    founderEmail: 'info@eduai.vn',
    status: 'approved',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    tags: ['Giáo dục', 'AI', 'Machine Learning'],
    createdAt: '2024-11-01',
    approvedAt: '2024-11-05',
    milestones: [
      { title: 'Phát triển nền tảng', description: 'Xây dựng hệ thống AI', amount: 400000000, completed: false },
      { title: 'Pilot program', description: 'Thử nghiệm tại 10 trường', amount: 400000000, completed: false },
    ]
  },
  {
    id: 4,
    title: 'HealthHub - Nền tảng chăm sóc sức khỏe từ xa',
    description: 'Kết nối bệnh nhân với bác sĩ qua video call, đặt lịch khám, quản lý hồ sơ sức khỏe điện tử.',
    fullDescription: 'HealthHub mang dịch vụ y tế chất lượng cao đến tận nhà. Bệnh nhân có thể tư vấn với bác sĩ chuyên khoa 24/7, theo dõi chỉ số sức khỏe và nhận nhắc nhở uống thuốc tự động.',
    category: 'Y tế - Công nghệ',
    targetAmount: 1000000000,
    currentAmount: 650000000,
    investorCount: 312,
    daysLeft: 30,
    startupName: 'HealthHub Vietnam',
    founderId: 5,
    founderName: 'Phạm Thị D',
    founderEmail: 'support@healthhub.vn',
    status: 'approved',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
    tags: ['Y tế', 'Telemedicine', 'HealthTech'],
    createdAt: '2024-10-10',
    approvedAt: '2024-10-15',
    milestones: [
      { title: 'Xây dựng nền tảng', description: 'Phát triển web & app', amount: 500000000, completed: true },
      { title: 'Hợp tác bệnh viện', description: 'Ký kết với 20 bệnh viện', amount: 500000000, completed: false },
    ]
  },
  {
    id: 5,
    title: 'AgriTech - Giải pháp nông nghiệp thông minh',
    description: 'Hệ thống IoT giám sát đất, thời tiết, tưới tiêu tự động giúp nông dân tăng năng suất 40%.',
    fullDescription: 'AgriTech kết hợp IoT, AI và Big Data để tối ưu hóa quy trình canh tác. Hệ thống cảm biến theo dõi độ ẩm đất, nhiệt độ, ánh sáng và tự động điều chỉnh tưới tiêu, bón phân.',
    category: 'Nông nghiệp - IoT',
    targetAmount: 600000000,
    currentAmount: 180000000,
    investorCount: 67,
    daysLeft: 90,
    startupName: 'AgriTech Solutions',
    founderId: 6,
    founderName: 'Hoàng Văn E',
    founderEmail: 'info@agritech.vn',
    status: 'approved',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
    tags: ['Nông nghiệp', 'IoT', 'Smart Farming'],
    createdAt: '2024-11-05',
    approvedAt: '2024-11-08',
    milestones: [
      { title: 'R&D cảm biến', description: 'Phát triển thiết bị IoT', amount: 300000000, completed: false },
      { title: 'Thử nghiệm thực địa', description: 'Triển khai tại 50 trang trại', amount: 300000000, completed: false },
    ]
  },
  {
    id: 6,
    title: 'FinTech Pro - Ví điện tử thế hệ mới',
    description: 'Nền tảng thanh toán di động với bảo mật blockchain, hỗ trợ đa loại tiền tệ và tiết kiệm tự động.',
    fullDescription: 'FinTech Pro cung cấp giải pháp thanh toán an toàn, nhanh chóng với công nghệ blockchain. Tích hợp AI để phân tích chi tiêu và đề xuất kế hoạch tiết kiệm thông minh.',
    category: 'Tài chính - Blockchain',
    targetAmount: 1500000000,
    currentAmount: 890000000,
    investorCount: 456,
    daysLeft: 25,
    startupName: 'FinTech Pro Ltd.',
    founderId: 7,
    founderName: 'Vũ Thị F',
    founderEmail: 'contact@fintechpro.vn',
    status: 'approved',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
    tags: ['FinTech', 'Blockchain', 'Digital Wallet'],
    createdAt: '2024-09-15',
    approvedAt: '2024-09-20',
    milestones: [
      { title: 'Phát triển MVP', description: 'Ra mắt phiên bản beta', amount: 500000000, completed: true },
      { title: 'Giấy phép hoạt động', description: 'Xin phép Ngân hàng NN', amount: 500000000, completed: true },
      { title: 'Mở rộng thị trường', description: 'Triển khai toàn quốc', amount: 500000000, completed: false },
    ]
  },
  {
    id: 7,
    title: 'GreenEnergy - Hệ thống năng lượng mặt trời gia đình',
    description: 'Cung cấp và lắp đặt hệ thống điện mặt trời cho hộ gia đình, giảm 70% hóa đơn tiền điện.',
    fullDescription: 'GreenEnergy giúp các hộ gia đình chuyển đổi sang năng lượng sạch với chi phí hợp lý. Hệ thống pin mặt trời cao cấp, bảo hành 20 năm, hoàn vốn sau 5 năm sử dụng.',
    category: 'Năng lượng - Môi trường',
    targetAmount: 2000000000,
    currentAmount: 1200000000,
    investorCount: 278,
    daysLeft: 50,
    startupName: 'GreenEnergy Vietnam',
    founderId: 8,
    founderName: 'Đỗ Văn G',
    founderEmail: 'info@greenenergy.vn',
    status: 'approved',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800',
    tags: ['Năng lượng sạch', 'Solar', 'Sustainability'],
    createdAt: '2024-10-01',
    approvedAt: '2024-10-05',
    milestones: [
      { title: 'Nhập khẩu thiết bị', description: 'Đặt hàng 1000 bộ pin', amount: 1000000000, completed: true },
      { title: 'Đào tạo kỹ thuật viên', description: 'Đào tạo 50 thợ lắp đặt', amount: 500000000, completed: false },
      { title: 'Marketing', description: 'Chiến dịch quảng bá', amount: 500000000, completed: false },
    ]
  },
  {
    id: 8,
    title: 'SmartHome - Nhà thông minh giá rẻ',
    description: 'Hệ thống thiết bị IoT điều khiển đèn, điều hòa, camera an ninh qua smartphone với giá thành phổ thông.',
    fullDescription: 'SmartHome mang công nghệ nhà thông minh đến với mọi gia đình Việt. Điều khiển mọi thiết bị từ xa, tiết kiệm điện năng và bảo vệ an ninh ngôi nhà với chi phí chỉ bằng 1/3 sản phẩm ngoại.',
    category: 'IoT - Smart Home',
    targetAmount: 700000000,
    currentAmount: 420000000,
    investorCount: 189,
    daysLeft: 40,
    startupName: 'SmartHome Tech',
    founderId: 9,
    founderName: 'Bùi Thị H',
    founderEmail: 'support@smarthome.vn',
    status: 'approved',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    tags: ['IoT', 'Smart Home', 'Automation'],
    createdAt: '2024-10-20',
    approvedAt: '2024-10-25',
    milestones: [
      { title: 'Phát triển sản phẩm', description: 'Hoàn thiện 10 thiết bị', amount: 350000000, completed: false },
      { title: 'Sản xuất hàng loạt', description: 'Đặt hàng 5000 bộ', amount: 350000000, completed: false },
    ]
  },
  {
    id: 9,
    title: 'TravelMate - Trợ lý du lịch AI',
    description: 'Ứng dụng lập kế hoạch du lịch tự động, gợi ý điểm đến, đặt phòng khách sạn và vé máy bay.',
    fullDescription: 'TravelMate sử dụng AI để tạo lịch trình du lịch hoàn hảo dựa trên sở thích, ngân sách và thời gian của bạn. Tích hợp booking khách sạn, vé máy bay với giá tốt nhất.',
    category: 'Du lịch - AI',
    targetAmount: 400000000,
    currentAmount: 125000000,
    investorCount: 52,
    daysLeft: 75,
    startupName: 'TravelMate Inc.',
    founderId: 10,
    founderName: 'Ngô Văn I',
    founderEmail: 'hello@travelmate.vn',
    status: 'approved',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
    tags: ['Du lịch', 'AI', 'Travel Tech'],
    createdAt: '2024-11-01',
    approvedAt: '2024-11-06',
    milestones: [
      { title: 'Xây dựng AI engine', description: 'Huấn luyện mô hình AI', amount: 200000000, completed: false },
      { title: 'Hợp tác đối tác', description: 'Ký kết với khách sạn, hãng bay', amount: 200000000, completed: false },
    ]
  },
  {
    id: 10,
    title: 'FashionAI - Thử đồ ảo bằng AR',
    description: 'Ứng dụng cho phép khách hàng thử quần áo, phụ kiện ảo trước khi mua bằng công nghệ AR.',
    fullDescription: 'FashionAI giúp giảm 80% tỷ lệ trả hàng trong mua sắm online. Khách hàng có thể xem mình mặc trang phục như thế nào trước khi quyết định mua.',
    category: 'Thời trang - AR',
    targetAmount: 900000000,
    currentAmount: 340000000,
    investorCount: 145,
    daysLeft: 55,
    startupName: 'FashionAI Studio',
    founderId: 11,
    founderName: 'Lý Thị K',
    founderEmail: 'info@fashionai.vn',
    status: 'approved',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea1c8c3c?w=800',
    tags: ['Thời trang', 'AR', 'E-commerce'],
    createdAt: '2024-10-25',
    approvedAt: '2024-10-30',
    milestones: [
      { title: 'Phát triển AR technology', description: 'Xây dựng engine AR', amount: 450000000, completed: false },
      { title: 'Hợp tác thương hiệu', description: '50 thương hiệu tham gia', amount: 450000000, completed: false },
    ]
  },
];

// Projects pending review
export const mockPendingProjects = [
  {
    id: 101,
    title: 'VR Classroom - Lớp học thực tế ảo',
    description: 'Nền tảng giáo dục sử dụng VR để tạo trải nghiệm học tập sống động, tương tác cao.',
    fullDescription: 'VR Classroom mang đến trải nghiệm học tập hoàn toàn mới với công nghệ thực tế ảo. Học sinh có thể tham quan Kim Tự Tháp Ai Cập, khám phá lòng núi lửa, hay làm thí nghiệm hóa học nguy hiểm một cách an toàn.',
    category: 'Giáo dục - VR',
    targetAmount: 1200000000,
    currentAmount: 0,
    investorCount: 0,
    daysLeft: 90,
    startupName: 'VR Education Lab',
    founderId: 12,
    founderName: 'Trương Văn L',
    founderEmail: 'contact@vrclass.vn',
    status: 'pending',
    image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800',
    tags: ['Giáo dục', 'VR', 'EdTech'],
    createdAt: '2024-11-08',
    submittedAt: '2024-11-08',
  },
  {
    id: 102,
    title: 'PetCare - Dịch vụ chăm sóc thú cưng toàn diện',
    description: 'Nền tảng kết nối chủ thú cưng với bác sĩ thú y, spa, khách sạn thú cưng.',
    fullDescription: 'PetCare là giải pháp one-stop cho mọi nhu cầu chăm sóc thú cưng. Từ đặt lịch khám bệnh, grooming, đến tìm khách sạn thú cưng uy tín khi đi xa.',
    category: 'Dịch vụ - Thú cưng',
    targetAmount: 350000000,
    currentAmount: 0,
    investorCount: 0,
    daysLeft: 90,
    startupName: 'PetCare Vietnam',
    founderId: 13,
    founderName: 'Mai Thị M',
    founderEmail: 'info@petcare.vn',
    status: 'pending',
    image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800',
    tags: ['Dịch vụ', 'Thú cưng', 'Pet Tech'],
    createdAt: '2024-11-09',
    submittedAt: '2024-11-09',
  },
];

// Mock users
export const mockUsers = [
  {
    id: 1,
    email: 'investor@test.com',
    password: '123456',
    name: 'Nguyễn Đầu Tư',
    role: 'investor',
    phone: '0901234567',
    address: 'Hà Nội',
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    email: 'startup@test.com',
    password: '123456',
    name: 'Trần Khởi Nghiệp',
    role: 'startup',
    company: 'Startup ABC',
    phone: '0912345678',
    address: 'TP.HCM',
    createdAt: '2024-02-20',
  },
  {
    id: 3,
    email: 'cva@test.com',
    password: 'cva123',
    name: 'Hội đồng CVA',
    role: 'cva',
    createdAt: '2024-01-01',
  },
  {
    id: 4,
    email: 'admin@test.com',
    password: 'admin@123',
    name: 'Quản trị viên',
    role: 'admin',
    createdAt: '2024-01-01',
  },
];

// Mock investments
export const mockInvestments = [
  {
    id: 1,
    investorId: 1,
    investorName: 'Nguyễn Đầu Tư',
    projectId: 1,
    projectTitle: 'EcoTech - Ứng dụng quản lý rác thải thông minh',
    amount: 5000000,
    paymentMethod: 'VNPay',
    status: 'success',
    transactionId: 'VNP2024110100001',
    createdAt: '2024-11-01 14:30:00',
  },
  {
    id: 2,
    investorId: 1,
    investorName: 'Nguyễn Đầu Tư',
    projectId: 4,
    projectTitle: 'HealthHub - Nền tảng chăm sóc sức khỏe từ xa',
    amount: 10000000,
    paymentMethod: 'Bank Card',
    status: 'success',
    transactionId: 'CARD2024110200002',
    createdAt: '2024-11-02 09:15:00',
  },
  {
    id: 3,
    investorId: 1,
    investorName: 'Nguyễn Đầu Tư',
    projectId: 6,
    projectTitle: 'FinTech Pro - Ví điện tử thế hệ mới',
    amount: 20000000,
    paymentMethod: 'VNPay',
    status: 'success',
    transactionId: 'VNP2024110500003',
    createdAt: '2024-11-05 16:45:00',
  },
];

/// Helper functions – ĐÃ FIX TYPE 100%
export const getProjectById = (id: number) => {
  return mockProjects.find(p => p.id === id) || mockPendingProjects.find(p => p.id === id);
};

export const getProjectsByStatus = (status: string) => {
  if (status === 'pending') {
    return mockPendingProjects;
  }
  return mockProjects.filter(p => p.status === status);
};

export const getUserByEmail = (email: string) => {
  return mockUsers.find(u => u.email === email);
};

export const getInvestmentsByUserId = (userId: number) => {
  return mockInvestments.filter(i => i.investorId === userId);
};

export const getProjectsByFounderId = (founderId: number) => {
  return [...mockProjects, ...mockPendingProjects].filter(p => p.founderId === founderId);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

export const calculateProgress = (current: number, target: number): number => {
  return Math.min((current / target) * 100, 100);
};

// Mock blog posts
export const mockBlogPosts = [
  {
    id: 1,
    title: '10 Bí quyết để tạo ra một chiến dịch gọi vốn thành công',
    excerpt: 'Khám phá những chiến lược và mẹo hữu ích giúp startup của bạn thu hút được sự chú ý của nhà đầu tư và đạt mục tiêu gọi vốn.',
    content: `Gọi vốn cộng đồng không chỉ là việc đăng dự án lên platform và chờ đợi. Để thành công, bạn cần một chiến lược rõ ràng và sự chuẩn bị kỹ lưỡng.

1. Câu chuyện hấp dẫn: Kể câu chuyện về lý do bạn khởi nghiệp, vấn đề bạn giải quyết và tác động bạn muốn tạo ra. Nhà đầu tư không chỉ đầu tư vào sản phẩm mà còn vào con người và sứ mệnh.

2. Video giới thiệu chuyên nghiệp: Video là công cụ mạnh mẽ nhất để truyền tải thông điệp. Đầu tư vào một video chất lượng cao, ngắn gọn (2-3 phút), thể hiện đội ngũ, sản phẩm và tầm nhìn.

3. Mục tiêu vốn thực tế: Đặt mục tiêu có thể đạt được. Nghiên cứu các dự án tương tự và đặt target hợp lý. Quá cao có thể làm nhà đầu tư nản lòng, quá thấp có thể không đủ để phát triển.

4. Phần thưởng hấp dẫn: Tạo các mức đầu tư với phần thưởng phù hợp. Early bird rewards luôn thu hút được sự quan tâm đầu tiên.

5. Marketing trước khi launch: Xây dựng danh sách email, tạo buzz trên mạng xã hội trước khi chiến dịch bắt đầu. 30-40% target nên được huy động trong tuần đầu tiên.

6. Cập nhật thường xuyên: Giữ liên lạc với nhà đầu tư thông qua updates. Chia sẻ milestone, thành tựu, và challenges.

7. Minh bạch tài chính: Công khai cách bạn sử dụng vốn. Nhà đầu tư cần thấy kế hoạch chi tiết và rõ ràng.

8. Đội ngũ mạnh: Giới thiệu team với background và expertise. Investor đầu tư vào con người trước, ý tưởng sau.

9. Social proof: Testimonials, press coverage, awards, partnerships - tất cả đều giúp tăng độ tin cậy.

10. Kế hoạch dài hạn: Không chỉ nói về sản phẩm hiện tại mà vẽ ra roadmap 3-5 năm tới. Nhà đầu tư muốn thấy tiềm năng tăng trưởng.`,
    category: 'Hướng dẫn',
    author: 'Nguyễn Minh Anh',
    authorBio: 'Chuyên gia tư vấn startup với 8 năm kinh nghiệm trong lĩnh vực crowdfunding',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    tags: ['Startup', 'Gọi vốn', 'Chiến lược'],
    publishedAt: '2024-11-15',
    readTime: 8,
  },
  {
    id: 2,
    title: 'Xu hướng đầu tư vào Startup công nghệ năm 2024',
    excerpt: 'Phân tích các lĩnh vực công nghệ đang thu hút nhiều vốn đầu tư nhất và dự đoán xu hướng trong tương lai gần.',
    content: `Năm 2024 đánh dấu sự chuyển mình mạnh mẽ trong cách nhà đầu tư tiếp cận với startup công nghệ tại Việt Nam.

AI và Machine Learning tiếp tục dẫn đầu với 35% tổng vốn đầu tư vào công nghệ. Các ứng dụng AI trong giáo dục, y tế và nông nghiệp đặc biệt được ưa chuộng.

FinTech giữ vững vị thế với 25% thị phần. Ví điện tử, blockchain, và các giải pháp thanh toán số đang bùng nổ.

GreenTech và CleanTech tăng trưởng 200% so với năm trước. Các giải pháp năng lượng sạch, quản lý rác thải, và nông nghiệp bền vững đang thu hút mạnh vốn đầu tư impact.

HealthTech với telemedicine và health monitoring chiếm 15%. Đại dịch đã thay đổi cách người dùng tiếp cận y tế.

EdTech cá nhân hóa với AI là xu hướng mới, chiếm 10% tổng vốn. Học tập thích ứng và online learning platforms đang phát triển mạnh.`,
    category: 'Phân tích',
    author: 'Trần Quốc Bảo',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    tags: ['Xu hướng', 'Công nghệ', 'Đầu tư'],
    publishedAt: '2024-11-10',
    readTime: 6,
  },
  {
    id: 3,
    title: 'Câu chuyện thành công: EcoTech từ ý tưởng đến 500 triệu',
    excerpt: 'Hành trình gọi vốn thành công của EcoTech - startup quản lý rác thải thông minh và những bài học quý giá.',
    content: `EcoTech bắt đầu từ một ý tưởng đơn giản: làm sao để việc phân loại rác trở nên dễ dàng hơn?

Founder Nguyễn Văn A chia sẻ: "Chúng tôi nhận ra rằng người dân muốn bảo vệ môi trường nhưng không biết bắt đầu từ đâu. AI có thể giải quyết vấn đề này."

Quá trình chuẩn bị mất 3 tháng. Team tạo MVP, test với 100 users, và thu thập feedback. Kết quả: 85% user hài lòng và sẵn sàng giới thiệu cho bạn bè.

Chiến dịch crowdfunding được launch với video chất lượng cao, câu chuyện cảm động về môi trường, và roadmap rõ ràng.

Tuần đầu tiên đạt 40% target nhờ marketing trước launch. Email marketing và Facebook ads đóng vai trò quan trọng.

Sau 45 ngày, EcoTech vượt target 64%, huy động được 320 triệu từ 156 nhà đầu tư.

Bài học: Chuẩn bị kỹ, có product-market fit, và xây dựng community trước khi gọi vốn.`,
    category: 'Case Study',
    author: 'Lê Thu Hà',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800',
    tags: ['Success Story', 'Case Study', 'EcoTech'],
    publishedAt: '2024-11-08',
    readTime: 5,
  },
  {
    id: 4,
    title: 'Làm thế nào để đánh giá một dự án startup đáng đầu tư',
    excerpt: 'Hướng dẫn chi tiết cho nhà đầu tư cá nhân về các tiêu chí quan trọng khi đánh giá một startup trên nền tảng crowdfunding.',
    content: `Đầu tư vào startup luôn có rủi ro, nhưng bạn có thể giảm thiểu bằng cách đánh giá kỹ lưỡng.

1. Đội ngũ (Team): Background, experience, commitment. Check LinkedIn profiles, previous ventures.

2. Thị trường (Market): Quy mô TAM, tốc độ tăng trưởng, barriers to entry. Market phải đủ lớn để scale.

3. Sản phẩm (Product): MVP có chưa? Users feedback? Product-market fit evidence?

4. Traction: KPIs quan trọng - số user, revenue, growth rate, retention. Hard numbers không thể chối cãi.

5. Business Model: Làm sao kiếm tiền? Unit economics có hợp lý không? Customer acquisition cost vs lifetime value.

6. Cạnh tranh (Competition): Ai là competitors? Competitive advantage là gì? Moat có bền vững không?

7. Tài chính: Burn rate, runway, revenue projection có realistic không?

8. Legal & IP: Ownership structure, IP protection, regulatory compliance.

9. Use of Funds: Vốn huy động sẽ dùng vào đâu? Có chi tiết và hợp lý không?

10. Exit Strategy: IPO, acquisition, hay gì? Timeline bao lâu?

Đa dạng hóa portfolio. Đừng bao giờ bỏ tất cả trứng vào một giỏ.`,
    category: 'Hướng dẫn',
    author: 'Phạm Đức Minh',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800',
    tags: ['Đầu tư', 'Đánh giá', 'Due Diligence'],
    publishedAt: '2024-11-05',
    readTime: 7,
  },
  {
    id: 5,
    title: 'Pháp lý crowdfunding tại Việt Nam - Những điều cần biết',
    excerpt: 'Tổng quan về khung pháp lý điều chỉnh hoạt động gọi vốn cộng đồng tại Việt Nam và quyền lợi của các bên.',
    content: `Crowdfunding tại Việt Nam đang trong giai đoạn phát triển và dần được hoàn thiện về mặt pháp lý.

Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân áp dụng cho platforms.

Luật Doanh nghiệp 2020 và Luật Chứng khoán điều chỉnh việc huy động vốn.

Equity crowdfunding cần giấy phép từ SSC (Ủy ban Chứng khoán Nhà nước).

Reward-based và donation-based tương đối tự do nhưng phải tuân thủ thuế và BVDLCN.

Quyền của nhà đầu tư: Được cung cấp đầy đủ thông tin, quyền rút vốn trong cooling-off period (nếu có), quyền khởi kiện nếu bị lừa đảo.

Nghĩa vụ của startup: Minh bạch thông tin, sử dụng vốn đúng mục đích, báo cáo định kỳ cho nhà đầu tư.

Trách nhiệm của platform: Thẩm định dự án, bảo mật thông tin, xử lý tranh chấp.

Khuyến nghị: Luôn đọc kỹ Terms & Conditions, tìm hiểu pháp lý trước khi tham gia.`,
    category: 'Pháp lý',
    author: 'Vũ Minh Tuấn',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
    tags: ['Pháp lý', 'Quy định', 'Compliance'],
    publishedAt: '2024-11-01',
    readTime: 6,
  },
  {
    id: 6,
    title: 'Impact Investing: Đầu tư vì lợi nhuận và tác động xã hội',
    excerpt: 'Khám phá xu hướng impact investing - đầu tư không chỉ để kiếm lời mà còn để tạo ra giá trị cho cộng đồng.',
    content: `Impact investing đang trở thành xu hướng toàn cầu và Việt Nam không ngoại lệ.

Định nghĩa: Đầu tư vào các doanh nghiệp, tổ chức tạo ra tác động xã hội hoặc môi trường tích cực đồng thời mang lại lợi nhuận tài chính.

Tại sao impact investing? Gen Z và Millennials quan tâm đến sustainability. Họ muốn đầu tư align với values.

Lĩnh vực hot: Clean energy, affordable healthcare, quality education, sustainable agriculture, financial inclusion.

Measurement: Impact cần được đo lường. UN SDGs (Sustainable Development Goals) là framework phổ biến.

Tại Việt Nam: GreenTech, EdTech phục vụ vùng sâu vùng xa, HealthTech cho người thu nhập thấp đang thu hút impact investors.

Returns: Không nhất thiết phải hy sinh returns. Nhiều impact investments có performance tương đương traditional investments.

StarFund prioritize các dự án có positive impact. Check "impact score" khi browse projects.

Future: ESG (Environmental, Social, Governance) sẽ là standard, không phải nice-to-have.`,
    category: 'Xu hướng',
    author: 'Hoàng Thị Mai',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800',
    tags: ['Impact', 'ESG', 'Sustainability'],
    publishedAt: '2024-10-28',
    readTime: 6,
  },
];

// Mock project comments
export const mockProjectComments = [
  {
    id: 1,
    projectId: 1,
    userId: 1,
    userName: 'Nguyễn Đầu Tư',
    userRole: 'investor',
    content: 'Dự án rất tiềm năng! Tôi đã đầu tư 5 triệu và mong chờ sự phát triển của EcoTech.',
    rating: 5,
    createdAt: '2024-11-02 10:00:00',
  },
  {
    id: 2,
    projectId: 1,
    userId: 15,
    userName: 'Trần Văn B',
    userRole: 'investor',
    content: 'Team rất nhiệt tình và chuyên nghiệp. Ứng dụng đã test thử rất tốt.',
    rating: 5,
    createdAt: '2024-11-03 14:30:00',
  },
  {
    id: 3,
    projectId: 1,
    userId: 16,
    userName: 'Lê Thị C',
    userRole: 'investor',
    content: 'Công nghệ AI nhận diện rác rất ấn tượng. Đã giới thiệu cho nhiều bạn bè.',
    rating: 4,
    createdAt: '2024-11-05 09:15:00',
  },
];

// CHỈ CHẠY TRONG BROWSER – KHÔNG BAO GIỜ CHẠY TRONG SSR
if (typeof window !== 'undefined') {
  const initMockData = () => {
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      const key = 'starfund_projects';
      const existing = localStorage.getItem(key);
      if (!existing || JSON.parse(existing).length === 0) {
        localStorage.setItem(key, JSON.stringify(mockProjects));
        console.log('%c MOCK DATA ĐÃ ĐƯỢC KHỞI TẠO VÀO LOCALSTORAGE!', 'color: #10b981; font-size: 16px; font-weight: bold;');
      }
    }
  };

  // Chạy ngay khi file được load (an toàn 100%)
  initMockData();

  // Và chạy lại mỗi khi storage thay đổi (bonus)
  window.addEventListener('storage', initMockData);
}