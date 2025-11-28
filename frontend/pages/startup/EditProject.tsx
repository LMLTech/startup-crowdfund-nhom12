import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { toast } from 'sonner';

// Import Mock & API (Logic File 1)
import { formatCurrency as mockFormatCurrency, calculateProgress } from '../../utils/mockData';
import { projectAPI } from '../../services/api';

// Fix import.meta (Logic File 1)
const IS_MOCK_MODE = (import.meta as any).env.VITE_USE_MOCK === 'true';

interface EditProjectProps {
  project: any;
  currentUser: any;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

export default function EditProject({ project, currentUser, onNavigate, onLogout }: EditProjectProps) {
  // --- PHẦN LOGIC (GIỮ NGUYÊN TỪ FILE 1) ---
  const [loading, setLoading] = useState(false);

  const formatMoney = (amount: number): string => {
    if (IS_MOCK_MODE) return mockFormatCurrency(amount);
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Logic xử lý ảnh an toàn từ File 1
  const getImageUrl = (project: any): string => {
    // 1. Ưu tiên imageUrl từ backend
    if (project.imageUrl && typeof project.imageUrl === 'string') {
      if (project.imageUrl.startsWith('http') || project.imageUrl.startsWith('data:')) {
        return project.imageUrl;
      }
      const cleanPath = project.imageUrl.startsWith('/') 
        ? project.imageUrl.substring(1) 
        : project.imageUrl;
      return `http://localhost:8080/${cleanPath}`;
    }
    // 2. Fallback
    if (project.image && (project.image.startsWith('http') || project.image.startsWith('data:'))) {
      return project.image;
    }
    // 3. Default
    return 'https://placehold.co/600x400/2a2a2a/FFF?text=No+Image';
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl">Không tìm thấy dự án</p>
          <Button onClick={() => onNavigate('my-projects')} className="mt-4">
            Quay về danh sách
          </Button>
        </div>
      </div>
    );
  }

  const progress = calculateProgress(project.currentAmount || 0, project.targetAmount);

  // Logic lưu thay đổi (Giữ lại để dùng khi bạn chuyển sang Form Edit)
  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      if (IS_MOCK_MODE) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success("Đã cập nhật dự án (Mock)!");
        onNavigate('my-projects');
      } else {
        const formData = new FormData();
        formData.append('title', project.title);
        await projectAPI.updateProject(project.id, formData);
        toast.success("Cập nhật thành công!");
        onNavigate('my-projects');
      }
    } catch (error: any) {
      toast.error("Lỗi cập nhật dự án: " + (error?.message || "Không xác định"));
    } finally {
      setLoading(false);
    }
  };

  // --- PHẦN GIAO DIỆN (UI TỪ FILE 2 - Layout w-3/4 mx-auto, Emerald Theme) ---
  return (
    <div className="min-h-screen">
      <Navbar currentUser={currentUser} onNavigate={onNavigate} onLogout={onLogout} />

      <div className="pt-24 pb-20 px-4">
        <div className="w-3/4 mx-auto px-10 max-w-6xl"> {/* Layout File 2 */}
          
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => onNavigate('my-projects')}
            className="mb-6 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách dự án
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
                
                {/* Header: Badge & Title */}
                <div className="flex items-center gap-3 mb-6">
                  {/* Style Badge File 2 */}
                  <Badge className={(project.status || '').toLowerCase() === 'approved' ? 'bg-green-500/90' : 'bg-yellow-500/90'}>
                    {(project.status || '').toLowerCase() === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
                  </Badge>
                  <h1 className="text-3xl text-white">{project.title}</h1>
                  {IS_MOCK_MODE && <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded font-bold">MOCK</span>}
                </div>

                {/* Image - Sử dụng Logic getImageUrl của File 1 */}
                <div className="aspect-video rounded-xl overflow-hidden mb-6 bg-gray-800">
                  <img 
                    src={getImageUrl(project)} 
                    alt={project.title} 
                    className="w-full h-full object-cover" 
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      e.currentTarget.src = 'https://placehold.co/600x400/2a2a2a/FFF?text=Image+Error';
                    }}
                  />
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Mô tả ngắn</p>
                    <p className="text-white">{project.description}</p>
                  </div>

                  <div>
                    <p className="text-white/70 text-sm mb-1">Mô tả chi tiết</p>
                    <p className="text-white whitespace-pre-line">{project.fullDescription}</p>
                  </div>

                  <div>
                    <p className="text-white/70 text-sm mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {(project.tags || []).map((tag: any, index: number) => (
                        <Badge key={index} variant="outline" className="border-white/20 text-white">
                          {typeof tag === 'string' ? tag : tag.tagName}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Milestones */}
                  {project.milestones && project.milestones.length > 0 && (
                    <div>
                      <p className="text-white/70 text-sm mb-2">Mục tiêu</p>
                      <div className="space-y-3">
                        {project.milestones.map((milestone: any, index: number) => (
                          <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <p className="text-white font-medium">{milestone.title}</p>
                            <p className="text-white/70 text-sm">{milestone.description}</p>
                            <p className="text-white/70 text-sm mt-2">{formatMoney(milestone.amount)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl text-white mb-4">Thống kê</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Mục tiêu</p>
                    <p className="text-2xl text-white">{formatMoney(project.targetAmount)}</p>
                  </div>

                  <div>
                    <p className="text-white/70 text-sm mb-1">Đã huy động</p>
                    <p className="text-2xl text-white">{formatMoney(project.currentAmount || 0)}</p>
                  </div>

                  <Progress value={progress} className="h-2 bg-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-green-600 to-emerald-600 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </Progress>
                  <p className="text-white/70 text-sm text-center">{progress.toFixed(1)}% đạt được</p>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                    <div>
                      <p className="text-white/70 text-sm mb-1">Nhà đầu tư</p>
                      <p className="text-xl text-white">{project.investorCount || 0}</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-sm mb-1">Còn lại</p>
                      <p className="text-xl text-white">{project.daysLeft} ngày</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}