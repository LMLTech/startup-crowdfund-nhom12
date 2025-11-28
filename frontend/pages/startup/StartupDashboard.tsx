import React, { useState, useEffect } from 'react';
import { Rocket, DollarSign, FolderOpen, PlusCircle, TrendingUp, Eye, Activity } from 'lucide-react';
import Navbar from '../../components/Navbar';
import ProjectCard from '../../components/ProjectCard';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

// Import Mock & API (Logic File 1)
import { getProjectsByFounderId, formatCurrency as mockFormatCurrency } from '../../utils/mockData';
import { projectAPI } from '../../services/api';

const IS_MOCK_MODE = (import.meta as unknown as ImportMeta).env?.VITE_USE_MOCK === 'true';

// Interface (Logic File 1)
interface Project {
  id: number;
  title: string;
  description: string;
  currentAmount: number;
  targetAmount: number;
  investorCount: number;
  status: string;
  image?: string;
  imageUrl?: string;
  [key: string]: any;
}

interface StartupDashboardProps {
  currentUser: any;
  onNavigate: (path: string, project?: Project) => void;
  onLogout: () => void;
}

export default function StartupDashboard({ currentUser, onNavigate, onLogout }: StartupDashboardProps) {
  // --- PHẦN LOGIC (GIỮ NGUYÊN TỪ FILE 1) ---
  const [dashboardData, setDashboardData] = useState<{
    myProjects: Project[];
    approvedProjects: Project[];
    pendingProjects: Project[];
    totalFunded: number;
    totalInvestors: number;
  }>({
    myProjects: [],
    approvedProjects: [],
    pendingProjects: [],
    totalFunded: 0,
    totalInvestors: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        if (IS_MOCK_MODE) {
          // MOCK MODE
          console.log("Startup Dashboard: Đang dùng dữ liệu MOCK");
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const myProjects = getProjectsByFounderId(currentUser?.id || 2) as Project[];
          const approvedProjects = myProjects.filter(p => 
            (p.status || '').toLowerCase() === 'approved'
          );
          const pendingProjects = myProjects.filter(p => 
            (p.status || '').toLowerCase() === 'pending'
          );
          
          const totalFunded = approvedProjects.reduce((sum, p) => sum + (p.currentAmount || 0), 0);
          const totalInvestors = approvedProjects.reduce((sum, p) => sum + (p.investorCount || 0), 0);

          setDashboardData({
            myProjects,
            approvedProjects,
            pendingProjects,
            totalFunded,
            totalInvestors
          });

        } else {
          // REAL API MODE
          const data = await projectAPI.getMyProjects();
          const myProjects = (Array.isArray(data) ? data : []) as Project[];

          const approvedProjects = myProjects.filter(p => 
            (p.status || '').toLowerCase() === 'approved'
          );
          const pendingProjects = myProjects.filter(p => 
            (p.status || '').toLowerCase() === 'pending'
          );
          
          const totalFunded = approvedProjects.reduce((sum, p) => sum + (p.currentAmount || 0), 0);
          const totalInvestors = approvedProjects.reduce((sum, p) => sum + (p.investorCount || 0), 0);

          setDashboardData({
            myProjects,
            approvedProjects,
            pendingProjects,
            totalFunded,
            totalInvestors
          });
        }
      } catch (error: any) {
        console.error("Lỗi tải Dashboard:", error);
        toast.error("Không thể tải dữ liệu bảng điều khiển");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchDashboardData();
    }
  }, [currentUser]);

  const formatMoney = (amount: number): string => {
    if (IS_MOCK_MODE) return mockFormatCurrency(amount).replace('₫', '');
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  const { myProjects, approvedProjects, pendingProjects, totalFunded, totalInvestors } = dashboardData;

  // --- PHẦN GIAO DIỆN (UI TỪ FILE 2 - Layout w-3/4 mx-auto) ---
  return (
    <div className="min-h-screen">
      <Navbar currentUser={currentUser} onNavigate={onNavigate} onLogout={onLogout} />

      <div className="pt-24 pb-20 px-10 mb-4">
        <div className="w-3/4 px-10 mx-auto max-w-7xl">
          
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-xl font-semibold text-white mb-2">
              Xin chào, {currentUser?.name || 'Startup'}! 🚀
              {IS_MOCK_MODE && <span className="ml-4 text-xs bg-yellow-500 text-black px-2 py-1 rounded font-bold">MOCK</span>}
            </h1>
            <p className="text-white/70 text-lg">
              Quản lý các dự án của bạn và theo dõi tiến độ gọi vốn
            </p>
          </div>

          {/* Stats Cards - Style File 2 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12 mt-4">
            
            {/* Total Projects (Green) */}
            <div className="bg-white/10 backdrop-blur-xl rounded-xl px-6 py-2 border border-green-500/30">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500/30 rounded-xl">
                  <FolderOpen className="w-6 h-6 text-green-300" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-300" />
              </div>
              <p className="text-white/70 mb-1">Tổng dự án</p>
              <p className="text-3xl text-white">{loading ? '...' : myProjects.length}</p>
            </div>

            {/* Approved (Green/Eye) */}
            <div className="bg-white/10 backdrop-blur-xl rounded-xl px-6 py-2 border border-green-500/30">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500/30 rounded-xl">
                  <Eye className="w-6 h-6 text-green-300" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-300" />
              </div>
              <p className="text-white/70 mb-1">Đã duyệt</p>
              <p className="text-3xl text-white">{loading ? '...' : approvedProjects.length}</p>
            </div>

            {/* Total Funded (Yellow) */}
            <div className="bg-white/10 backdrop-blur-xl rounded-xl px-6 py-2 border border-yellow-500/30">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-500/30 rounded-xl">
                  <DollarSign className="w-6 h-6 text-yellow-300" />
                </div>
                <TrendingUp className="w-5 h-5 text-yellow-300" />
              </div>
              <p className="text-white/70 mb-1">Tổng vốn huy động</p>
              <p className="text-xl text-white">{loading ? '...' : formatMoney(totalFunded)}</p>
            </div>

            {/* Total Investors (Blue) */}
            <div className="bg-white/10 backdrop-blur-xl rounded-xl px-6 py-2 border border-blue-500/30">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/30 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-blue-300" />
                </div>
                <TrendingUp className="w-5 h-5 text-blue-300" />
              </div>
              <p className="text-white/70 mb-1">Nhà đầu tư</p>
              <p className="text-3xl text-white">{loading ? '...' : totalInvestors}</p>
            </div>
          </div>

          {/* Quick Actions - Style File 2 */}
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-xl p-6 border border-white/20 mb-12 mt-4 mb-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl text-white mb-2 font-semibold">
                  Bắt đầu gọi vốn cho ý tưởng của bạn
                </h2>
                <p className="text-white/70">
                  Tạo dự án mới và kết nối với hàng nghìn nhà đầu tư tiềm năng
                </p>
              </div>
              <Button
                onClick={() => onNavigate("create-project")}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-6 whitespace-nowrap shadow-lg"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Tạo dự án mới
              </Button>
            </div>
          </div>

          {/* Pending Projects Section */}
          {pendingProjects.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-white font-semibold">Dự án chờ duyệt</h2>
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium">
                  {pendingProjects.length} dự án
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => onNavigate("edit-project", project)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Active Projects Section */}
          {approvedProjects.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-white font-semibold">Dự án đang hoạt động</h2>
                <Button
                  variant="outline"
                  onClick={() => onNavigate("my-projects")}
                  className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
                >
                  Xem tất cả
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {approvedProjects.slice(0, 3).map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => onNavigate("edit-project", project)}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-12 border border-white/20 text-center mt-8">
              <div className="max-w-md mx-auto">
                <div className="p-4 bg-green-500/20 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Rocket className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-2xl text-white mb-2 font-semibold">
                  Bắt đầu hành trình gọi vốn
                </h3>
                <p className="text-white/70 mb-6">
                  Bạn chưa có dự án nào. Tạo dự án đầu tiên và kết nối với nhà đầu tư ngay!
                </p>
                <Button
                  onClick={() => onNavigate("create-project")}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Tạo dự án đầu tiên
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}