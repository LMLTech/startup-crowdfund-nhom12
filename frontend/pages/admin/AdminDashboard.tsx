import React, { useEffect, useState } from 'react';
import { Users, FolderOpen, DollarSign, TrendingUp, Activity } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { Button } from '../../components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { toast } from 'sonner';

// Mock data & Helpers (Logic từ File 1)
import { mockProjects, mockUsers, mockInvestments } from '../../utils/mockData';

const IS_MOCK_MODE = (import.meta as any).env.VITE_USE_MOCK === 'true';

interface AdminDashboardProps {
  currentUser: any;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

interface DashboardStats {
  totalUsers: number;
  totalProjects: number;
  totalInvestments: number;
  totalTransactions: number;
  monthlyStats: { month: string; revenue: number }[];
  categoryData: { name: string; value: number }[];
}

export default function AdminDashboard({ currentUser, onNavigate, onLogout }: AdminDashboardProps) {
  // --- PHẦN LOGIC (GIỮ NGUYÊN TỪ FILE 1) ---
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProjects: 0,
    totalInvestments: 0,
    totalTransactions: 0,
    monthlyStats: [],
    categoryData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (IS_MOCK_MODE) {
          // ==================== MOCK MODE ====================
          console.log("Admin Dashboard: Đang dùng dữ liệu MOCK");
          await new Promise(resolve => setTimeout(resolve, 600));

          setStats({
            totalUsers: mockUsers.length,
            totalProjects: mockProjects.length,
            totalInvestments: mockInvestments.reduce((sum, inv) => sum + inv.amount, 0),
            totalTransactions: mockInvestments.length,
            monthlyStats: [
              { month: 'T8', revenue: 85000000 },
              { month: 'T9', revenue: 120000000 },
              { month: 'T10', revenue: 180000000 },
              { month: 'T11', revenue: 250000000 }
            ],
            categoryData: [
              { name: 'Công nghệ', value: 5 },
              { name: 'Y tế', value: 3 },
              { name: 'Nông nghiệp', value: 2 },
              { name: 'Khác', value: 4 }
            ]
          });
        } else {
          // ==================== REAL API ====================
          const token = localStorage.getItem('token');
          if (!token) {
            toast.error("Phiên đăng nhập hết hạn");
            onLogout();
            return;
          }

          const response = await fetch('http://localhost:8080/api/stats/admin-dashboard', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          });

          if (!response.ok) {
            const err = await response.text();
            throw new Error(`Lỗi ${response.status}: ${err || response.statusText}`);
          }

          const result = await response.json();
          const data = result.data || result;

          setStats({
            totalUsers: Number(data.totalUsers ?? 0),
            totalProjects: Number(data.totalProjects ?? 0),
            totalInvestments: Number(data.totalInvestments ?? 0),
            totalTransactions: Number(data.totalTransactions ?? 0),
            monthlyStats: Array.isArray(data.monthlyStats) ? data.monthlyStats : [],
            categoryData: Array.isArray(data.projectCategories) ? data.projectCategories : []
          });
        }
      } catch (error: any) {
        console.error("Lỗi tải dashboard:", error);
        toast.error("Không thể tải dữ liệu dashboard: " + error.message);
        setStats(prev => ({ ...prev, totalUsers: 0, totalProjects: 0, totalInvestments: 0, totalTransactions: 0 }));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [onLogout]);

  const COLORS = ["#8b5cf6", "#ec4899", "#3b82f6", "#10b981", "#f59e0b"];

  const formatMoney = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020817]">
        <div className="text-white text-2xl font-semibold">
          <Activity className="w-10 h-10 animate-pulse inline mr-3" />
          Đang tải dữ liệu dashboard...
        </div>
      </div>
    );
  }

  // --- PHẦN GIAO DIỆN (UI TỪ FILE 2) ---
  return (
    <div className="min-h-screen">
      <Navbar currentUser={currentUser} onNavigate={onNavigate} onLogout={onLogout} />

      {/* Header Section */}
      <div className="text-center pt-24 pb-20 px-10 mb-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-12">
            <h1 className="text-xl text-white mb-2 font-semibold flex items-center justify-center gap-2">
              Admin Dashboard 👨‍💼
              {IS_MOCK_MODE && (
                <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded font-bold">MOCK</span>
              )}
            </h1>
            <p className="text-white/70 text-lg mb-4">
              Quản lý toàn bộ hệ thống StarFund
            </p>
          </div>

          {/* Stats Cards - Layout File 2 (Grid cols 2/4, w-3/4 mx-auto) */}
          <div className="w-3/4 mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {/* Card 1: Users */}
            <div className="rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white p-6 h-auto flex flex-col items-start transition-colors">
              <div className="flex items-center justify-between mb-4 w-full">
                <div className="p-3 bg-green-500/30 rounded-xl">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <Activity className="w-5 h-5 text-white animate-pulse" />
              </div>
              <p className="text-white/70 mb-1">Người dùng</p>
              <p className="text-3xl text-white">{stats.totalUsers}</p>
            </div>

            {/* Card 2: Projects */}
            <div className="rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white p-6 h-auto flex flex-col items-start transition-colors">
              <div className="flex items-center justify-between mb-4 w-full">
                <div className="p-3 bg-emerald-500/30 rounded-xl">
                  <FolderOpen className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <p className="text-white/70 mb-1">Dự án</p>
              <p className="text-3xl text-white">{stats.totalProjects}</p>
            </div>

            {/* Card 3: Total Investments */}
            <div className="rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white p-6 h-auto flex flex-col items-start transition-colors">
              <div className="flex items-center justify-between mb-4 w-full">
                <div className="p-3 bg-blue-500/30 rounded-xl">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <p className="text-white/70 mb-1">Tổng vốn</p>
              <p className="text-xl text-white font-bold">
                 {/* Cắt ngắn bớt nếu số quá dài cho khớp UI File 2 */}
                {formatMoney(stats.totalInvestments).length > 15 
                  ? formatMoney(stats.totalInvestments).substring(0, 15) + '...'
                  : formatMoney(stats.totalInvestments)
                }
              </p>
            </div>

            {/* Card 4: Transactions */}
            <div className="rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white p-6 h-auto flex flex-col items-start transition-colors">
              <div className="flex items-center justify-between mb-4 w-full">
                <div className="p-3 bg-green-500/30 rounded-xl">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <p className="text-white/70 mb-1">Giao dịch</p>
              <p className="text-3xl text-white">{stats.totalTransactions}</p>
            </div>
          </div>

          {/* Quick Actions - Layout File 2 (Grid col 3, w-3/4 mx-auto, item-start) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-3/4 mx-auto">
            <Button
              onClick={() => onNavigate("user-management")}
              className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white p-6 h-auto flex flex-col items-start transition-all"
            >
              <Users className="w-8 h-8 mb-2" />
              <span className="text-lg font-semibold">Quản lý người dùng</span>
              <span className="text-sm text-white/70">
                {stats.totalUsers} người dùng
              </span>
            </Button>

            <Button
              onClick={() => onNavigate("project-management")}
              className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white p-6 h-auto flex flex-col items-start transition-all"
            >
              <FolderOpen className="w-8 h-8 mb-2" />
              <span className="text-lg font-semibold">Quản lý dự án</span>
              <span className="text-sm text-white/70">
                {stats.totalProjects} dự án
              </span>
            </Button>

            <Button
              onClick={() => onNavigate("transaction-management")}
              className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white p-6 h-auto flex flex-col items-start transition-all"
            >
              <DollarSign className="w-8 h-8 mb-2" />
              <span className="text-lg font-semibold">Quản lý giao dịch</span>
              <span className="text-sm text-white/70">
                {stats.totalTransactions} giao dịch
              </span>
            </Button>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-3/4 mx-auto">
            {/* Bar Chart */}
            <div className="rounded-lg bg-white/10 backdrop-blur-xl p-6 border border-white/20">
              <h3 className="text-xl text-white mb-6 font-semibold">Doanh thu theo tháng</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.monthlyStats}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
                  <YAxis stroke="rgba(255,255,255,0.7)" tickFormatter={(val) => `${val/1000000}M`} />
                  <Tooltip
                    formatter={(value: number) => formatMoney(value)}
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.8)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                  <Bar dataKey="revenue" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="rounded-lg bg-white/10 backdrop-blur-xl p-6 border border-white/20">
              <h3 className="text-xl text-white mb-6 font-semibold">Dự án theo danh mục</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `${value} dự án`}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "8px",
                      color: "#000",
                      padding: "8px",
                    }}
                    itemStyle={{ color: "#000" }}
                  />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}