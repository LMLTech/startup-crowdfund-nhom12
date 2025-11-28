import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../../components/Navbar';
import ProjectCard from '../../components/ProjectCard';
import { Button } from '../../components/ui/button';

// Import Mock & API (Logic File 1)
import { mockPendingProjects } from '../../utils/mockData';
import { projectAPI } from '../../services/api';

// Kiểm tra chế độ
const IS_MOCK_MODE = (import.meta as any).env.VITE_USE_MOCK === 'true';

// 1. Interface Props (Logic File 1)
interface ReviewProjectsProps {
  currentUser: any;
  onNavigate: (path: string, data?: any) => void;
  onLogout: () => void;
}

// Interface cho Project (Logic File 1)
interface ProjectData {
  id: number;
  title: string;
  description: string;
  fullDescription?: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  investorCount: number;
  daysLeft: number;
  status?: string;
  image?: string;
  imageUrl?: string;
  tags?: any[];
}

export default function ReviewProjects({ currentUser, onNavigate, onLogout }: ReviewProjectsProps) {
  // --- PHẦN LOGIC (GIỮ NGUYÊN TỪ FILE 1) ---
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        if (IS_MOCK_MODE) {
          // --- CHẾ ĐỘ MOCK ---
          console.log("⚠️ CVA Review: Đang dùng dữ liệu MOCK");
          await new Promise(resolve => setTimeout(resolve, 500));
          // Ép kiểu mock data
          setProjects(mockPendingProjects as unknown as ProjectData[]);
        } else {
          // --- CHẾ ĐỘ REAL API ---
          const data = await (projectAPI as any).getProjectsByStatus?.('pending') || [];
          
          // Ép kiểu 'any' để truy cập .content mà không bị lỗi
          const list = Array.isArray(data) ? data : (data as any).content || [];
          setProjects(list);
        }
      } catch (error) {
        console.error("Lỗi tải danh sách dự án chờ duyệt:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // --- PHẦN GIAO DIỆN (UI TỪ FILE 2) ---
  return (
    <div className="min-h-screen">
      <Navbar currentUser={currentUser} onNavigate={onNavigate} onLogout={onLogout} />

      <div className="pt-4 pb-20 px-10 mb-4">
        <div className="w-3/4 px-10 mx-auto max-w-7xl">
          
          {/* Back Button (Commented out theo File 2 style, nhưng giữ logic) */}
          {/* <Button
            variant="ghost"
            onClick={() => onNavigate('cva-dashboard')}
            className="mb-6 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại Dashboard
          </Button> */}

          <h1 className="text-xl text-white mb-2 font-semibold flex items-center gap-2">
            Dự án chờ duyệt
            {IS_MOCK_MODE && <span className="text-[10px] bg-yellow-500 text-black px-1.5 py-0.5 rounded font-bold">MOCK</span>}
          </h1>
          
          <p className="text-white/70 mb-8">
            {loading 
              ? "Đang tải dữ liệu..." 
              : `${projects.length} dự án cần được thẩm định`
            }
          </p>

          {loading ? (
            <div className="text-center text-white/50 py-12 animate-pulse">Đang tải danh sách...</div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => onNavigate('review-detail', project)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-12 border border-white/20 text-center">
              <p className="text-white/70 text-xl">
                Không có dự án nào chờ duyệt
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}