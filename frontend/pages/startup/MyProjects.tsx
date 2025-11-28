import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import Navbar from '../../components/Navbar';
import ProjectCard from '../../components/ProjectCard';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { toast } from 'sonner';

// Import Mock & Real API (Logic File 1)
import { getProjectsByFounderId } from '../../utils/mockData';
import { projectAPI } from '../../services/api';

// Fix lỗi import.meta (Logic File 1)
const IS_MOCK_MODE = (import.meta as unknown as ImportMeta).env?.VITE_USE_MOCK === 'true';

// Định nghĩa type Project (Logic File 1)
interface Project {
  id: number;
  title: string;
  description: string;
  fullDescription?: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  investorCount: number;
  daysLeft: number;
  image?: string;
  imageUrl?: string;
  tags?: string[];
  milestones?: any[];
  startupName: string;
  founderId: number;
  status: string;
  submittedAt?: string;
  createdAt?: string;
}

interface MyProjectsProps {
  currentUser: any;
  onNavigate: (path: string, data?: any) => void;
  onLogout: () => void;
}

export default function MyProjects({ currentUser, onNavigate, onLogout }: MyProjectsProps) {
  // --- PHẦN LOGIC (GIỮ NGUYÊN TỪ FILE 1) ---
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        if (IS_MOCK_MODE) {
          console.log("My Projects: Đang dùng dữ liệu MOCK");
          await new Promise(resolve => setTimeout(resolve, 500));
          const mockProjects = getProjectsByFounderId(currentUser?.id || 2);
          setMyProjects(mockProjects as Project[]);
        } else {
          // GỌI API THẬT
          const data = await projectAPI.getMyProjects();
          const list = Array.isArray(data) ? data : [];
          setMyProjects(list as Project[]);
        }
      } catch (error: any) {
        console.error("Lỗi tải dự án:", error);
        toast.error("Không thể tải danh sách dự án của bạn");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchProjects();
    }
  }, [currentUser]);

  // Filter theo status
  const approvedProjects = myProjects.filter(p => 
    (p.status || '').toLowerCase() === 'approved'
  );
  const pendingProjects = myProjects.filter(p => 
    (p.status || '').toLowerCase() === 'pending'
  );

  // Filter theo từ khóa tìm kiếm
  const filterProjects = (projects: Project[]) => {
    return projects.filter(p =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // --- PHẦN GIAO DIỆN (UI TỪ FILE 2 - Layout w-3/4 mx-auto) ---
  return (
    <div className="min-h-screen">
      <Navbar currentUser={currentUser} onNavigate={onNavigate} onLogout={onLogout} />

      <div className="pt-24 pb-20 px-10 mb-4 mt-4">
        <div className="w-3/4 px-10 mx-auto max-w-7xl">
          
          {/* Back Button (Giữ lại từ File 1 nhưng đặt trong layout File 2) */}
          <Button
            variant="ghost"
            onClick={() => onNavigate('startup-dashboard')}
            className="mb-6 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại Dashboard
          </Button>

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <h1 className="text-xl text-white font-semibold">Dự án của tôi</h1>
            {IS_MOCK_MODE && <span className="text-[10px] bg-yellow-500 text-black px-2 py-0.5 rounded font-bold">MOCK</span>}
          </div>

          {/* Search Bar - Style File 2 */}
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 mb-8 px-10">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <Input
                type="text"
                placeholder="Tìm kiếm dự án..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center text-white py-12 animate-pulse">Đang tải dự án...</div>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="bg-white/10 border-white/20 text-white mb-8">
                <TabsTrigger value="all">
                  Tất cả ({myProjects.length})
                </TabsTrigger>
                <TabsTrigger value="approved">
                  Đã duyệt ({approvedProjects.length})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Chờ duyệt ({pendingProjects.length})
                </TabsTrigger>
              </TabsList>

              {/* All Projects */}
              <TabsContent value="all">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterProjects(myProjects).length === 0 ? (
                    <div className="col-span-full text-center text-white/50 py-8">Chưa có dự án nào</div>
                  ) : (
                    filterProjects(myProjects).map(project => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onClick={() => onNavigate('edit-project', project)}
                      />
                    ))
                  )}
                </div>
              </TabsContent>

              {/* Approved Projects */}
              <TabsContent value="approved">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterProjects(approvedProjects).length === 0 ? (
                    <div className="col-span-full text-center text-white/50 py-8">Chưa có dự án nào được duyệt</div>
                  ) : (
                    filterProjects(approvedProjects).map(project => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onClick={() => onNavigate('edit-project', project)}
                      />
                    ))
                  )}
                </div>
              </TabsContent>

              {/* Pending Projects */}
              <TabsContent value="pending">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterProjects(pendingProjects).length === 0 ? (
                    <div className="col-span-full text-center text-white/50 py-8">Không có dự án nào đang chờ duyệt</div>
                  ) : (
                    filterProjects(pendingProjects).map(project => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onClick={() => onNavigate('edit-project', project)}
                      />
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}