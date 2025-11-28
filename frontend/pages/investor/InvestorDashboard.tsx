import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, FolderOpen, Activity } from 'lucide-react';
import Navbar from '../../components/Navbar';
import ProjectCard from '../../components/ProjectCard';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

// Import Mock & API (Logic File 1)
import { mockProjects, getInvestmentsByUserId, formatCurrency as mockFormatCurrency } from '../../utils/mockData';
import { investmentAPI, projectAPI } from '../../services/api';

// Kiểm tra chế độ
const IS_MOCK_MODE = (import.meta as any).env.VITE_USE_MOCK === 'true';

// Interface Props
interface InvestorDashboardProps {
  currentUser: any;
  onNavigate: (path: string, data?: any) => void;
  onLogout: () => void;
}

// Interface State (Logic File 1)
interface DashboardData {
  totalInvested: number;
  projectsInvestedCount: number;
  lastInvestmentDate: string | null;
  recentInvestments: any[];
  trendingProjects: any[];
}

export default function InvestorDashboard({ currentUser, onNavigate, onLogout }: InvestorDashboardProps) {
  // --- PHẦN LOGIC (GIỮ NGUYÊN TỪ FILE 1) ---
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalInvested: 0,
    projectsInvestedCount: 0,
    lastInvestmentDate: null,
    recentInvestments: [],
    trendingProjects: []
  });
  const [loading, setLoading] = useState(true);

  // Fetch Data Logic
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (IS_MOCK_MODE) {
          // --- CHẾ ĐỘ MOCK ---
          console.log("⚠️ Investor Dashboard: Đang dùng dữ liệu MOCK");
          await new Promise(resolve => setTimeout(resolve, 500));

          const myInvestments = getInvestmentsByUserId(currentUser?.id || 1);
          const totalInvested = myInvestments.reduce((sum, inv) => sum + inv.amount, 0);
          const projectsInvested = new Set(myInvestments.map(inv => inv.projectId)).size;
          
          const trending = [...mockProjects]
            .sort((a, b) => b.investorCount - a.investorCount)
            .slice(0, 6);

          const lastDate = myInvestments.length > 0 ? myInvestments[0].createdAt : null;

          setDashboardData({
            totalInvested,
            projectsInvestedCount: projectsInvested,
            lastInvestmentDate: lastDate,
            recentInvestments: myInvestments.slice(0, 5),
            trendingProjects: trending
          });

        } else {
          // --- CHẾ ĐỘ REAL API ---
          const [investmentsData, projectsData] = await Promise.all([
            investmentAPI.getMyInvestments(),
            projectAPI.getApprovedProjects()
          ]);

          const myInvestments = Array.isArray(investmentsData) ? investmentsData : [];
          const allProjects = Array.isArray(projectsData) ? projectsData : (projectsData as any).content || [];

          const totalInvested = myInvestments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
          const projectIds = new Set(myInvestments.map(inv => inv.project?.id || inv.project));
          
          const sortedInvestments = [...myInvestments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          const lastDate = sortedInvestments.length > 0 ? sortedInvestments[0].createdAt : null;

          const trending = [...allProjects]
            .sort((a, b) => (b.investorCount || 0) - (a.investorCount || 0))
            .slice(0, 6);

          setDashboardData({
            totalInvested,
            projectsInvestedCount: projectIds.size,
            lastInvestmentDate: lastDate,
            recentInvestments: sortedInvestments.slice(0, 5),
            trendingProjects: trending
          });
        }
      } catch (error) {
        console.error("Lỗi tải Dashboard:", error);
        toast.error("Không thể tải dữ liệu bảng điều khiển");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const formatMoney = (amount: number) => {
    if (IS_MOCK_MODE) return mockFormatCurrency(amount);
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // --- PHẦN GIAO DIỆN (UI TỪ FILE 2 - Layout w-3/4 mx-auto) ---
  return (
    <div className="min-h-screen">
      <Navbar currentUser={currentUser} onNavigate={onNavigate} onLogout={onLogout} />

      <div className="pt-24 pb-20 px-4 mb-4">
        <div className="w-3/4 px-10 mx-auto max-w-7xl">
          
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-xl text-white mb-2 font-semibold">
              Chào mừng, {currentUser?.name}! 👋
              {IS_MOCK_MODE && <span className="ml-4 text-xs bg-yellow-500 text-black px-2 py-1 rounded font-bold">MOCK</span>}
            </h1>
            <p className="text-white/70 text-lg">
              Theo dõi danh mục đầu tư và khám phá các dự án mới
            </p>
          </div>

          {/* Stats Cards - Style File 2 (Emerald/Green/Blue) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 mt-2">
            
            {/* Card 1: Total Invested (Emerald) */}
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-2 border border-gray-700/30">
              <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emerald-600/30 rounded-xl">
                    <DollarSign className="w-6 h-6 text-emerald-300" />
                  </div>
                  <Activity className="w-5 h-5 text-emerald-300" />
                </div>
                <p className="text-white/70 mb-1">Tổng đã đầu tư</p>
                <p className="text-3xl text-white">
                  {loading ? '...' : formatMoney(dashboardData.totalInvested)}
                </p>
              </div>
            </div>

            {/* Card 2: Projects Count (Green) */}
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-2 border border-green-500/30">
              <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-500/30 rounded-xl">
                    <FolderOpen className="w-6 h-6 text-green-300" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-300" />
                </div>
                <p className="text-white/70 mb-1">Dự án đã đầu tư</p>
                <p className="text-3xl text-white">
                  {loading ? '...' : dashboardData.projectsInvestedCount}
                </p>
              </div>
            </div>

            {/* Card 3: Last Investment (Blue) */}
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-2 border border-blue-500/30">
              <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-500/30 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-blue-300" />
                  </div>
                  <Activity className="w-5 h-5 text-blue-300" />
                </div>
                <p className="text-white/70 mb-1">Lần đầu tư gần nhất</p>
                <p className="text-lg text-white">
                  {loading 
                    ? '...' 
                    : (dashboardData.lastInvestmentDate 
                        ? new Date(dashboardData.lastInvestmentDate).toLocaleDateString('vi-VN') 
                        : 'Chưa có'
                      )
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Recent Investments - Logic File 1, UI File 2 Table */}
          {dashboardData.recentInvestments.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl text-white font-semibold">Đầu tư gần đây</h2>
                <Button
                  variant="outline"
                  onClick={() => onNavigate('investment-history')}
                  className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
                >
                  Xem tất cả
                </Button>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left p-4 text-white/70">Dự án</th>
                        <th className="text-left p-4 text-white/70">Số tiền</th>
                        <th className="text-left p-4 text-white/70">Ngày đầu tư</th>
                        <th className="text-left p-4 text-white/70">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.recentInvestments.map((investment) => (
                        <tr key={investment.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                          <td className="p-4 text-white max-w-xs truncate">
                            {investment.projectTitle || investment.project?.title || 'Đang tải...'}
                          </td>
                          <td className="p-4 text-white">
                            {formatMoney(investment.amount)}
                          </td>
                          <td className="p-4 text-white/70">
                            {new Date(investment.createdAt).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              (investment.status || '').toLowerCase() === 'success' 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {(investment.status || '').toLowerCase() === 'success' ? 'Thành công' : 'Đang xử lý'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Trending Projects - Logic File 1, UI Grid File 2 */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl text-white font-semibold">Dự án đang hot 🔥</h2>
              <Button
                variant="outline"
                onClick={() => onNavigate("home")}
                className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
              >
                Xem tất cả
              </Button>
            </div>

            {loading ? (
               <div className="text-center text-white py-10">Đang tải danh sách dự án...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardData.trendingProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => onNavigate("project-detail", project)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Empty State - UI File 2 */}
          {!loading && dashboardData.recentInvestments.length === 0 && (
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-12 border border-white/20 text-center mt-8">
              <div className="max-w-md mx-auto">
                <div className="p-4 bg-emerald-600/20 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <DollarSign className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-2xl text-white mb-2 font-semibold">
                  Bắt đầu hành trình đầu tư
                </h3>
                <p className="text-white/70 mb-6">
                  Bạn chưa có khoản đầu tư nào. Khám phá các dự án tiềm năng và bắt đầu đầu tư ngay!
                </p>
                <Button
                  onClick={() => onNavigate("home")}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  Khám phá dự án
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}