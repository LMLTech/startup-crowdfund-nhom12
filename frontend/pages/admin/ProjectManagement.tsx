import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import Navbar from '../../components/Navbar';
import ProjectCard from '../../components/ProjectCard';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

// Import Mock & API (Logic File 1)
import { mockProjects, mockPendingProjects } from '../../utils/mockData';
import { Project } from '../../services/api'; 

const IS_MOCK_MODE = (import.meta as any).env.VITE_USE_MOCK === 'true';

// 1. Interface Props (Logic File 1)
interface ProjectManagementProps {
  currentUser: any;
  onNavigate: (path: string, data?: any) => void;
  onLogout: () => void;
}

export default function ProjectManagement({ currentUser, onNavigate, onLogout }: ProjectManagementProps) {
  // --- PHẦN LOGIC (GIỮ NGUYÊN TỪ FILE 1) ---
  const [projects, setProjects] = useState<Project[]>([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchAllProjects = async () => {
      setLoading(true);
      try {
        if (IS_MOCK_MODE) {
          console.log("Project Management: Đang dùng dữ liệu MOCK");
          await new Promise(resolve => setTimeout(resolve, 500));
          setProjects([...mockProjects, ...mockPendingProjects] as any);
        } else {
          // GỌI API THẬT (Logic File 1)
          const response = await fetch('http://localhost:8080/api/admin/projects?page=0&limit=50', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Accept': 'application/json'
            }
          });

          if (!response.ok) throw new Error('Không thể tải dự án');

          const result = await response.json();
          const projectList = result.data || result.content || result || [];
          setProjects(projectList);
        }
      } catch (error) {
        console.error("Lỗi tải danh sách dự án:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProjects();
  }, []);

  // Logic lọc (Logic File 1)
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const projectStatus = (project.status || '').toLowerCase(); 
    const matchesStatus = statusFilter === 'all' || projectStatus === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  // --- PHẦN GIAO DIỆN (UI TỪ FILE 2 - Layout w-3/4 mx-auto) ---
  return (
    <div className="min-h-screen">
      <Navbar currentUser={currentUser} onNavigate={onNavigate} onLogout={onLogout} />

      <div className="pt-24 pb-20 px-10">
        <div className="container mx-auto max-w-7xl">
          
          {/* Header Section - Style File 2 (Centered) */}
          <div className="text-center mb-8">
            <h1 className="text-xl text-white mb-2 font-semibold flex justify-center items-center gap-2">
              Quản lý dự án
              {IS_MOCK_MODE && <span className="text-[10px] bg-yellow-500 text-black px-1.5 py-0.5 rounded font-bold">MOCK</span>}
            </h1>
            <p className="text-white/70">
              {loading ? 'Đang tải dữ liệu...' : `Tổng: ${filteredProjects.length} dự án`}
            </p>
          </div>

          {/* Search & Filter Bar - Style File 2 (w-3/4 mx-auto, Icon phải) */}
          <div className="w-3/4 mx-auto bg-white/10 backdrop-blur-xl rounded-lg p-6 border border-white/20 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm dự án..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 backdrop-blur-xl border-white/20 text-white">
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="approved">Đã duyệt (Approved)</SelectItem>
                  <SelectItem value="pending">Chờ duyệt (Pending)</SelectItem>
                  <SelectItem value="rejected">Đã từ chối (Rejected)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Projects Grid - Style File 2 (w-3/4 mx-auto) */}
          <div className="w-3/4 mx-auto">
            {loading ? (
              <div className="text-center text-white py-20 animate-pulse">Đang tải danh sách dự án...</div>
            ) : filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map(project => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => onNavigate('project-detail', project)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-white/70 text-xl">Không tìm thấy dự án nào phù hợp.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}