import React, { useState, useEffect } from 'react';
import { ShieldCheck, Clock, CheckCircle, XCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { Button } from '../../components/ui/button';

// Mock Data
import { mockPendingProjects, mockProjects } from '../../utils/mockData';
// Real API
import { projectAPI } from '../../services/api';

const IS_MOCK_MODE = (import.meta as any).env.VITE_USE_MOCK === 'true';

interface CVADashboardProps {
  currentUser: any;
  onNavigate: (path: string, data?: any) => void;
  onLogout: () => void;
}

interface CVAStats {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  totalReviewed: number;
}

export default function CVADashboard({ currentUser, onNavigate, onLogout }: CVADashboardProps) {
  // --- PHẦN LOGIC (GIỮ NGUYÊN TỪ FILE 1) ---
  const [stats, setStats] = useState<CVAStats>({
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    totalReviewed: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        if (IS_MOCK_MODE) {
          // Mock mode logic
          await new Promise(resolve => setTimeout(resolve, 500));
          const pending = mockPendingProjects.length;
          const approved = mockProjects.length;
          setStats({
            pendingCount: pending,
            approvedCount: approved,
            rejectedCount: 0,
            totalReviewed: pending + approved
          });
        } else {
          // Real API logic
          const [pendingData, approvedData, rejectedData] = await Promise.all([
            projectAPI.getProjectsByStatus('pending', 1, 1),
            projectAPI.getProjectsByStatus('approved', 1, 1),
            projectAPI.getProjectsByStatus('rejected', 1, 1)
          ]);

          const pendingCount = pendingData.totalElements || pendingData.content?.length || 0;
          const approvedCount = approvedData.totalElements || approvedData.content?.length || 0;
          const rejectedCount = rejectedData.totalElements || rejectedData.content?.length || 0;

          setStats({
            pendingCount,
            approvedCount,
            rejectedCount,
            totalReviewed: approvedCount + rejectedCount
          });
        }
      } catch (error) {
        console.error("Lỗi tải Dashboard CVA:", error);
        setStats({ pendingCount: 0, approvedCount: 0, rejectedCount: 0, totalReviewed: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // --- PHẦN GIAO DIỆN (UI TỪ FILE 2) ---
  return (
    <div className="min-h-screen">
      <Navbar currentUser={currentUser} onNavigate={onNavigate} onLogout={onLogout} />

      <div className="pt-4 pb-20 px-10 mb-4 mt-4">
        <div className="w-3/4 px-10 mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-xl text-white mb-2 font-semibold flex items-center gap-2">
              CVA Dashboard 🛡️
              {IS_MOCK_MODE && <span className="text-[10px] bg-yellow-500 text-black px-1.5 py-0.5 rounded font-bold">MOCK</span>}
            </h1>
            <p className="text-white/70 text-lg">
              Thẩm định và duyệt các dự án gọi vốn
            </p>
          </div>

          {/* Stats Cards - Style File 2 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            
            {/* Card: Pending */}
            <div className="bg-white/10 backdrop-blur-xl rounded-xl px-6 py-2 border border-yellow-500/30">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-500/30 rounded-xl">
                  <Clock className="w-6 h-6 text-yellow-300" />
                </div>
              </div>
              <p className="text-white/70 mb-1">Chờ duyệt</p>
              <p className="text-3xl text-white">{loading ? '...' : stats.pendingCount}</p>
            </div>

            {/* Card: Approved */}
            <div className="bg-white/10 backdrop-blur-xl rounded-xl px-6 py-2 border border-green-500/30">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500/30 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-300" />
                </div>
              </div>
              <p className="text-white/70 mb-1">Đã duyệt</p>
              <p className="text-3xl text-white">{loading ? '...' : stats.approvedCount}</p>
            </div>

            {/* Card: Rejected */}
            <div className="bg-white/10 backdrop-blur-xl rounded-xl px-6 py-2 border border-red-500/30">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-500/30 rounded-xl">
                  <XCircle className="w-6 h-6 text-red-300" />
                </div>
              </div>
              <p className="text-white/70 mb-1">Từ chối</p>
              <p className="text-3xl text-white">{loading ? '...' : stats.rejectedCount}</p>
            </div>

            {/* Card: Total (Emerald Theme của File 2) */}
            <div className="bg-white/10 backdrop-blur-xl rounded-xl px-6 py-2 border mb-4 border-gray-700/30">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-600/30 rounded-xl">
                  <ShieldCheck className="w-6 h-6 text-emerald-300" />
                </div>
              </div>
              <p className="text-white/70 mb-1">Tổng đã xét duyệt</p>
              <p className="text-3xl text-white">{loading ? '...' : stats.totalReviewed}</p>
            </div>
          </div>

          {/* Action Banner */}
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-gray-700/30 mb-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl text-white mb-2 font-semibold">
                  Duyệt dự án mới
                </h2>
                <p className="text-white/70">
                  Có <strong>{stats.pendingCount}</strong> dự án đang chờ thẩm định và phê duyệt
                </p>
              </div>
              <Button
                onClick={() => onNavigate("review-projects")}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-6 whitespace-nowrap shadow-lg"
              >
                <ShieldCheck className="w-5 h-5 mr-2" />
                Xem dự án chờ duyệt
              </Button>
            </div>
          </div>

          {/* Guidelines Section */}
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-8 border border-white/20 mt-4">
            <h2 className="text-2xl text-white mb-6 font-semibold">
              Hướng dẫn thẩm định
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <h3 className="text-white mb-2 font-bold text-green-400">✅ Tiêu chí phê duyệt</h3>
                <ul className="text-white/70 text-sm space-y-2">
                  <li>• Ý tưởng rõ ràng, khả thi</li>
                  <li>• Kế hoạch tài chính hợp lý</li>
                  <li>• Đội ngũ có năng lực</li>
                  <li>• Lợi ích cho cộng đồng</li>
                </ul>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <h3 className="text-white mb-2 font-bold text-red-400">❌ Tiêu chí từ chối</h3>
                <ul className="text-white/70 text-sm space-y-2">
                  <li>• Thông tin không đầy đủ</li>
                  <li>• Vi phạm pháp luật</li>
                  <li>• Rủi ro quá cao</li>
                  <li>• Thiếu tính khả thi</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}