// Projects Manager - handles dynamic project state with localStorage
// This replaces mock data with actual state management

const STORAGE_KEY = 'starfund_projects';

export interface Project {
  id: number;
  title: string;
  description: string;
  fullDescription: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  investorCount: number;
  daysLeft: number;
  startupName: string;
  founderId: number;
  founderName: string;
  founderEmail: string;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed';
  image: string;
  tags: string[];
  createdAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  reviewFeedback?: string;
  milestones?: Array<{
    title: string;
    description: string;
    amount: number;
    completed: boolean;
  }>;
  team?: Array<{
    name: string;
    role: string;
    bio: string;
  }>;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  businessPlan?: {
    market: string;
    competition: string;
    revenue: string;
    growth: string;
  };
}

// Initialize projects in localStorage if not exists
export const initializeProjects = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    const initialProjects: Project[] = [
      {
        id: 1,
        title: 'EcoTech - Ứng dụng quản lý rác thải thông minh',
        description: 'Nền tảng công nghệ kết nối người dân với các đơn vị thu gom rác, giúp tối ưu hóa quy trình tái chế và bảo vệ môi trường.',
        fullDescription: 'EcoTech là giải pháp công nghệ toàn diện giúp quản lý và tối ưu hóa quy trình thu gom, phân loại và tái chế rác thải. Ứng dụng sử dụng AI để nhận diện các loại rác, đưa ra hướng dẫn phân loại và kết nối với đơn vị thu gom gần nhất.',
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
      },
      {
        id: 2,
        title: 'FoodShare - Nền tảng chia sẻ thực phẩm thừa',
        description: 'Kết nối nhà hàng, siêu thị với người tiêu dùng để giảm thiểu lãng phí thực phẩm, tạo giá trị cho cộng đồng.',
        fullDescription: 'FoodShare giúp giảm 60% lượng thực phẩm bị lãng phí từ các nhà hàng, quán ăn và siêu thị. Người dùng có thể mua thực phẩm còn tốt với giá ưu đãi vào cuối ngày.',
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
      },
      {
        id: 101,
        title: 'SmartFarm - Nông nghiệp thông minh với IoT',
        description: 'Hệ thống IoT giúp nông dân giám sát và quản lý trang trại từ xa, tối ưu hóa năng suất.',
        fullDescription: 'SmartFarm cung cấp giải pháp IoT toàn diện với các cảm biến thông minh theo dõi độ ẩm, nhiệt độ, ánh sáng. Hệ thống AI phân tích dữ liệu và đưa ra khuyến nghị canh tác tối ưu.',
        category: 'Nông nghiệp - Công nghệ',
        targetAmount: 600000000,
        currentAmount: 0,
        investorCount: 0,
        daysLeft: 90,
        startupName: 'SmartFarm Tech',
        founderId: 5,
        founderName: 'Phạm Văn D',
        founderEmail: 'info@smartfarm.vn',
        status: 'pending',
        image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
        tags: ['Nông nghiệp', 'IoT', 'AI', 'Smart Tech'],
        createdAt: new Date().toISOString(),
      },
      {
        id: 102,
        title: 'MediBot - Chatbot tư vấn sức khỏe AI',
        description: 'Trợ lý ảo sử dụng AI để tư vấn sức khỏe ban đầu, hỗ trợ bác sĩ trong chẩn đoán.',
        fullDescription: 'MediBot là chatbot thông minh có thể trả lời các câu hỏi về sức khỏe, đưa ra lời khuyên ban đầu và đề xuất việc gặp bác sĩ khi cần thiết.',
        category: 'Y tế - AI',
        targetAmount: 400000000,
        currentAmount: 0,
        investorCount: 0,
        daysLeft: 60,
        startupName: 'MediBot AI',
        founderId: 6,
        founderName: 'Nguyễn Thị E',
        founderEmail: 'contact@medibot.vn',
        status: 'pending',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
        tags: ['Y tế', 'AI', 'Chatbot', 'HealthTech'],
        createdAt: new Date().toISOString(),
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProjects));
  }
};

// Get all projects
export const getAllProjects = (): Project[] => {
  initializeProjects();
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Get projects by status
export const getProjectsByStatus = (status: string): Project[] => {
  const projects = getAllProjects();
  return projects.filter(p => p.status === status);
};

// Get approved projects (for Explore page)
export const getApprovedProjects = (): Project[] => {
  return getProjectsByStatus('approved');
};

// Get pending projects (for CVA review)
export const getPendingProjects = (): Project[] => {
  return getProjectsByStatus('pending');
};

// Get project by ID
export const getProjectById = (id: number): Project | undefined => {
  const projects = getAllProjects();
  return projects.find(p => p.id === id);
};

// Get projects by founder ID
export const getProjectsByFounderId = (founderId: number): Project[] => {
  const projects = getAllProjects();
  return projects.filter(p => p.founderId === founderId);
};

// Create new project
export const createProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'currentAmount' | 'investorCount'>): Project => {
  const projects = getAllProjects();
  const newId = Math.max(...projects.map(p => p.id), 0) + 1;
  
  const newProject: Project = {
    ...projectData,
    id: newId,
    currentAmount: 0,
    investorCount: 0,
    createdAt: new Date().toISOString(),
  };
  
  projects.push(newProject);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  return newProject;
};

// Update project
export const updateProject = (id: number, updates: Partial<Project>): Project | null => {
  const projects = getAllProjects();
  const index = projects.findIndex(p => p.id === id);
  
  if (index === -1) return null;
  
  projects[index] = { ...projects[index], ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  return projects[index];
};

// Approve project (CVA action)
export const approveProject = (id: number, feedback?: string): Project | null => {
  return updateProject(id, {
    status: 'approved',
    approvedAt: new Date().toISOString(),
    reviewFeedback: feedback,
  });
};

// Reject project (CVA action)
export const rejectProject = (id: number, feedback: string): Project | null => {
  return updateProject(id, {
    status: 'rejected',
    rejectedAt: new Date().toISOString(),
    reviewFeedback: feedback,
  });
};

// Delete project (Admin action)
export const deleteProject = (id: number): boolean => {
  const projects = getAllProjects();
  const filtered = projects.filter(p => p.id !== id);
  
  if (filtered.length === projects.length) return false;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
};

// Add investment to project
export const addInvestment = (projectId: number, amount: number): Project | null => {
  const project = getProjectById(projectId);
  if (!project) return null;
  
  return updateProject(projectId, {
    currentAmount: project.currentAmount + amount,
    investorCount: project.investorCount + 1,
  });
};

// Format currency helper
export const formatCurrency = (amount: number): string => {
  if (amount >= 1000000000) {
    return `${(amount / 1000000000).toFixed(1)} tỷ VNĐ`;
  } else if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(0)} triệu VNĐ`;
  }
  return `${amount.toLocaleString('vi-VN')} VNĐ`;
};
