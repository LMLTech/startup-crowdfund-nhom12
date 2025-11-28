/// <reference types="vite/client" />
import axios from 'axios';

let mockInvestments: any[] = [];
let mockPendingProjects: any[] = [];
let mockProjects: any[] = [];
let mockUsers: any[] = [];

// ==================== MOCK MODE SWITCH - CHỈ THÊM ĐOẠN NÀY ====================
const USE_MOCK = (() => {
  const val = import.meta.env.VITE_USE_MOCK;
  return (typeof val === 'boolean' && val) || (typeof val === 'string' && val.trim().toLowerCase() === 'true');
})();

// FIX MOCK DATA LOADING - CHỈ THÊM ĐOẠN NÀY
let mockDataPromise: Promise<any> | null = null;
if (USE_MOCK) {
  mockDataPromise = import('../utils/mockData').then(module => {
    mockProjects = module.mockProjects || [];
    mockPendingProjects = module.mockPendingProjects || [];
    mockUsers = module.mockUsers || [];
    mockInvestments = module.mockInvestments || [];
    console.log('%c MOCK DATA ĐÃ LOAD XONG – SẴN SÀNG CHIẾN!', 'color: #10b981; font-size: 16px; font-weight: bold;');
  });
}
const awaitMockData = async () => {
  if (USE_MOCK && mockDataPromise) await mockDataPromise;
};

const delay = (ms = 500) => new Promise(r => setTimeout(r, ms));

// API Service Layer - Đã sửa khớp với Backend StarFund
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    // Backend trả về token nằm cùng cấp với user trong object login response, 
    // hoặc bạn đã lưu riêng key 'token' ở useAuth.
    return localStorage.getItem('token') || userData.token;
  }
  return null;
};

// Helper function to create headers
const createHeaders = (includeAuth = true, isMultipart = false): HeadersInit => {
  const headers: any = {};

  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
    headers['Accept'] = 'application/json';
  }

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};


// Helper function to handle responses
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    // Nếu lỗi 401 (Unauthorized) -> Token hết hạn -> Clear storage & Redirect
    if (response.status === 401) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  const resData = await response.json();
  // Backend trả về dạng { success: true, message: "...", data: ... }
  // Ta trả về data để component sử dụng
  return resData.data !== undefined ? resData.data : resData; 
};

// ============================================
// DEFINITIONS (Interfaces) - PHẦN BẠN ĐANG THIẾU
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: string;
  company?: string;
  phone?: string;
}

export interface AuthResponse {
  id: number;
  email: string;
  name: string;
  role: string;
  token: string;
  status?: string;
  company?: string;
  phone?: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  fullDescription?: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  investorCount: number;
  daysLeft: number;
  status: string;
  image: string;
  imageUrl?: string; // Support real API url
  tags?: any[];
  milestones?: any[];
  startupName?: string;
  founderName?: string;
  founderEmail?: string;
  createdAt: string;
  submittedAt?: string;
  founder?: {
      id: number;
      name: string;
      company?: string;
      email: string;
  };
}

export interface Investment {
  id: number;
  amount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  transactionCode?: string;
  transactionId?: string; // Support mock
  projectTitle?: string; // Support mock
  project?: {
      id: number;
      title: string;
  };
  investorName?: string;
  user?: {
      name: string;
  }
}

export interface Transaction {
    id: number;
    transactionCode: string;
    amount: number;
    type: string;
    status: string;
    paymentMethod: string;
    createdAt: string;
    user?: {
        name: string;
        email: string;
    };
    investment?: {
        project?: {
            title: string;
        }
    };
    description?: string;
}

// ============================================
// AUTHENTICATION APIs
// ============================================
export const authAPI = {
  login: async (data: LoginRequest) => {
  if (USE_MOCK) {
    await awaitMockData();
    await delay(800);
    const user = mockUsers.find(u => u.email === data.email && u.password === data.password);
    if (!user) throw new Error('Sai email hoặc mật khẩu!');
    const { password: _, ...safeUser } = user;
    localStorage.setItem('user', JSON.stringify(safeUser));
    localStorage.setItem('token', 'mock-jwt-starfund-2025');
    return { user: safeUser, token: 'mock-jwt-starfund-2025' };
  }

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
  method: 'POST',
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  body: JSON.stringify(data),
});
  return handleResponse<{user: AuthResponse, token: string}>(response);
},

  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: createHeaders(),
    });
    return handleResponse<AuthResponse>(response);
  },

  // THÊM VÀO TRONG authAPI (ngay dưới login hoặc getCurrentUser)
  register: async (data: RegisterRequest) => {
    if (USE_MOCK) {
      await awaitMockData();
      await delay(800);
      
      // Mock register
      const safeUser = {
        id: Date.now(),
        email: data.email,
        name: data.name,
        role: data.role.toUpperCase(),
        phone: data.phone,
        company: data.company,
        status: 'ACTIVE'
      };
      mockUsers.push({ ...safeUser, password: data.password });
      
      localStorage.setItem('user', JSON.stringify(safeUser));
      localStorage.setItem('token', 'mock-jwt-register-' + Date.now());
      
      return { user: safeUser, token: 'mock-jwt-register-' + Date.now() };
    }

    // GỌI THẬT TỚI BACKEND
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });

    return handleResponse<{ user: AuthResponse; token: string }>(response);
  },
};

// ============================================
// PROJECT APIs
// ============================================
export const projectAPI = {
  // Public: Get Approved Projects
// Thay thế hàm getApprovedProjects trong projectAPI

getApprovedProjects: async (page = 1, limit = 12, search = '', category = '') => {
  if (USE_MOCK) {
    await awaitMockData();
    await delay(600);
    let projects = mockProjects.filter(p => p.status === 'approved');
    if (search) {
      projects = projects.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category && category !== 'all') {
      projects = projects.filter(p => p.category === category);
    }
    const start = (page - 1) * limit;
    const end = start + limit;
    
    // Trả về format giống backend
    return {
      data: projects.slice(start, end),
      pagination: {
        total: projects.length,
        page,
        limit,
        totalPages: Math.ceil(projects.length / limit)
      }
    };
  }

  // REAL API
  let url = `${API_BASE_URL}/projects?status=approved&page=${page}&limit=${limit}`;
  if(search) url += `&search=${encodeURIComponent(search)}`;
  if(category && category !== 'all') url += `&category=${encodeURIComponent(category)}`;
  
  const response = await fetch(url, { headers: createHeaders(false) });
  const result = await handleResponse<any>(response);
  
  // FIX: Backend trả về Page object, extract content array
  // result có thể là: { content: [...], totalElements, totalPages } 
  // hoặc trực tiếp array (nếu backend trả khác)
  
  if (result && result.content && Array.isArray(result.content)) {
    // Spring Page format
    return {
      data: result.content,
      pagination: {
        total: result.totalElements || result.content.length,
        page: result.number + 1 || page, // Spring Page index bắt đầu từ 0
        limit: result.size || limit,
        totalPages: result.totalPages || 1
      }
    };
  } else if (Array.isArray(result)) {
    // Nếu backend trả trực tiếp array
    return {
      data: result,
      pagination: { total: result.length, page, limit, totalPages: 1 }
    };
  } else {
    // Fallback
    console.warn('Unexpected API response format:', result);
    return { data: [], pagination: null };
  }
},

  // Detail
  getProjectById: async (id: number) => {
  if (USE_MOCK) {
    await awaitMockData();
    await delay(500);
    const project = [...mockProjects, ...mockPendingProjects].find(p => p.id === id);
    if (!project) throw new Error('Không tìm thấy dự án');
    return project;
  }
  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    headers: createHeaders(false),
  });
  return handleResponse<Project>(response);
},
getProjectsByStatus: async (status: string, page = 1, limit = 12) => {
  if (USE_MOCK) {
    await awaitMockData();
    await delay(600);
    
    // Lọc theo status (chuyển về lowercase để so sánh)
    let projects = status.toLowerCase() === 'pending' 
      ? mockPendingProjects 
      : mockProjects.filter(p => p.status?.toLowerCase() === status.toLowerCase());
    
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      content: projects.slice(start, end),
      totalElements: projects.length,
      totalPages: Math.ceil(projects.length / limit),
      currentPage: page
    };
  }

  // GỌI API THẬT
  const response = await fetch(
    `${API_BASE_URL}/projects?status=${status}&page=${page}&limit=${limit}`, 
    { headers: createHeaders(true) } // TRUE vì cần auth
  );
  
  return handleResponse<any>(response);
},
  // Startup: Get My Projects
  getMyProjects: async () => {
    const response = await fetch(`${API_BASE_URL}/projects/my-projects`, {
      headers: createHeaders(),
    });
    return handleResponse<Project[]>(response);
  },

  // Create (Multipart Form Data)
  createProject: async (formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: createHeaders(true, true), // isMultipart = true
      body: formData,
    });
    return handleResponse<Project>(response);
  },

  // Update
  updateProject: async (id: number, formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: createHeaders(true, true),
      body: formData,
    });
    return handleResponse<Project>(response);
  },

  // Approve (CVA)
  approveProject: async (id: number, feedback: string) => {
    const response = await fetch(`${API_BASE_URL}/cva/projects/${id}/approve`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify({ feedback }),
    });
    return handleResponse<Project>(response);
  },

  // Reject (CVA)
  rejectProject: async (id: number, feedback: string) => {
    const response = await fetch(`${API_BASE_URL}/cva/projects/${id}/reject`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify({ feedback }),
    });
    return handleResponse<Project>(response);
  },

  deleteProject: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: createHeaders(),
    });
    return handleResponse(response);
  },
};

// ============================================
// INVESTMENT APIs
// ============================================
export const investmentAPI = {
  // Create investment -> Get Payment URL
  createInvestment: async (data: { projectId: number; amount: number; message: string; paymentMethod: string }) => {
    const response = await fetch(`${API_BASE_URL}/investments`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(data),
    });
    // Return format: { paymentUrl: "..." }
    return handleResponse<{
      data: any;paymentUrl: string
}>(response);
  },

  // Investor: Get My History
  getMyInvestments: async () => {
    const response = await fetch(`${API_BASE_URL}/investments/my-investments`, {
      headers: createHeaders(),
    });
    return handleResponse<Investment[]>(response);
  },

  // Founder: Get Investors of Project
  getProjectInvestments: async (projectId: number) => {
    const response = await fetch(`${API_BASE_URL}/investments/project/${projectId}`, {
      headers: createHeaders(),
    });
    return handleResponse<Investment[]>(response);
  },
};

// ============================================
// TRANSACTION APIs (Admin Only)
// ============================================
export const transactionAPI = {
  getAllTransactions: async (page = 1, userId?: number) => {
    let url = `${API_BASE_URL}/admin/transactions?page=${page}`;
    if (userId) url += `&userId=${userId}`;
    
    const response = await fetch(url, { headers: createHeaders() });
    return handleResponse<any>(response); // Return Page<Transaction>
  },
};

// ============================================
// USER APIs (Admin Only)
// ============================================
export const userAPI = {
  getAllUsers: async (page = 1, role?: string) => {
    let url = `${API_BASE_URL}/admin/users?page=${page}`;
    if (role) url += `&role=${role}`;

    const response = await fetch(url, { headers: createHeaders() });
    return handleResponse<any>(response); // Return Page<User>
  },

  updateUserStatus: async (id: number, status: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}/status`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },

  deleteUser: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: createHeaders(),
    });
    return handleResponse(response);
  },
};

// ============================================
// STATISTICS APIs
// ============================================
export const statisticsAPI = {
  getAdminStats: async () => {
    const response = await fetch(`${API_BASE_URL}/stats/admin-dashboard`, { headers: createHeaders() });
    return handleResponse<any>(response);
  },

  getInvestorStats: async () => {
    const response = await fetch(`${API_BASE_URL}/stats/investor-dashboard`, { headers: createHeaders() });
    return handleResponse<any>(response);
  },

  getStartupStats: async () => {
    const response = await fetch(`${API_BASE_URL}/stats/startup-dashboard`, { headers: createHeaders() });
    return handleResponse<any>(response);
  },
  
  getCvaStats: async () => {
    const response = await fetch(`${API_BASE_URL}/stats/cva-dashboard`, { headers: createHeaders() });
    return handleResponse<any>(response);
  },
};

// notificationAPI.ts
// ============================================
// NOTIFICATION APIs
// ============================================
export const notificationAPI = {
  getMyNotifications: async () => {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      headers: createHeaders(),
    });
    return handleResponse<any>(response);
  },

  countUnread: async () => {
    const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
      headers: createHeaders(),
    });
    return handleResponse<{count: number}>(response);
  },

  markAllAsRead: async () => {
    const response = await fetch(`${API_BASE_URL}/notifications/mark-read`, {
      method: 'PUT',
      headers: createHeaders(),
    });
    return handleResponse(response);
  },
};

export default {
  auth: authAPI,
  project: projectAPI,
  investment: investmentAPI,
  transaction: transactionAPI,
  user: userAPI,
  statistics: statisticsAPI,
  notification: notificationAPI, // <-- thêm dòng này
};

// fileUrl helper
export const getFileUrl = (fileName: string) => {
  if (!fileName) return '';
  return `${API_BASE_URL}/uploads/${fileName}`;
};

export interface Project {
  id: number;
  title: string;
  description: string;
  fullDescription?: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  investorCount: number;
  daysLeft: number;
  status: string;
  image: string;       // file name từ backend
  imageUrl?: string;   // URL đầy đủ
}

