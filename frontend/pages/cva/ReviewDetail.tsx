import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';

// Import Mock Helper
import { formatCurrency as mockFormatCurrency } from '../../utils/mockData';
// Import Real API
import { projectAPI } from '../../services/api';

// Kiểm tra chế độ
const IS_MOCK_MODE = (import.meta as any).env.VITE_USE_MOCK === 'true';

// 1. Interface Props
interface ReviewDetailProps {
  project: any; // Hoặc import interface Project từ api.ts
  currentUser: any;
  onNavigate: (path: string, data?: any) => void;
  onLogout: () => void;
}

export default function ReviewDetail({ project, currentUser, onNavigate, onLogout }: ReviewDetailProps) {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  // Format tiền tệ linh hoạt
  const formatMoney = (amount: number) => {
    if (IS_MOCK_MODE) return mockFormatCurrency(amount);
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl">Không tìm thấy dự án</p>
          <Button onClick={() => onNavigate('review-projects')} className="mt-4">
            Quay về danh sách
          </Button>
        </div>
      </div>
    );
  }

  // 1. Logic Phê Duyệt
  const handleApprove = async () => {
    setLoading(true);
    try {
      if (IS_MOCK_MODE) {
        // Mock
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Dự án đã được phê duyệt (Mock)!');
        onNavigate('review-projects');
      } else {
        // Real API
        await projectAPI.approveProject(project.id, feedback || "Duyệt bởi CVA");
        toast.success('Dự án đã được phê duyệt thành công!');
        onNavigate('review-projects');
      }
    } catch (error) {
      toast.error('Lỗi khi phê duyệt dự án');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Logic Từ Chối
  const handleReject = async () => {
    if (!feedback.trim()) {
      toast.error('Vui lòng nhập lý do từ chối!');
      return;
    }
    setLoading(true);
    try {
      if (IS_MOCK_MODE) {
        // Mock
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Dự án đã bị từ chối (Mock).');
        onNavigate('review-projects');
      } else {
        // Real API
        await projectAPI.rejectProject(project.id, feedback);
        toast.success('Dự án đã bị từ chối thành công.');
        onNavigate('review-projects');
      }
    } catch (error) {
      toast.error('Lỗi khi từ chối dự án');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar currentUser={currentUser} onNavigate={onNavigate} onLogout={onLogout} />

      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <Button
            variant="ghost"
            onClick={() => onNavigate('review-projects')}
            className="mb-6 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <Badge className="bg-yellow-500/90">Chờ duyệt</Badge>
                  <h1 className="text-3xl text-white">{project.title}</h1>
                  {IS_MOCK_MODE && <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded font-bold">MOCK</span>}
                </div>

                <div className="aspect-video rounded-xl overflow-hidden mb-6">
                  {/* Xử lý ảnh */}
                  {project.image || project.imageUrl ? (
                      <img 
                        src={project.image || `http://localhost:8080${project.imageUrl}`} 
                        alt={project.title} 
                        className="w-full h-full object-cover" 
                        // Fix lỗi 'src does not exist on EventTarget' bằng e.currentTarget
                        onError={(e) => {e.currentTarget.src = 'https://via.placeholder.com/800x400?text=No+Image'}}
                      />
                  ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center text-white">No Image</div>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-white text-xl mb-2">Mô tả ngắn</h3>
                    <p className="text-white/80">{project.description}</p>
                  </div>

                  <div>
                    <h3 className="text-white text-xl mb-2">Mô tả chi tiết</h3>
                    <p className="text-white/80">{project.fullDescription}</p>
                  </div>

                  <div>
                    <h3 className="text-white text-xl mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {(project.tags || []).map((tag: any, index: number) => ( // Thêm type any cho tag
                        <Badge key={index} variant="outline" className="border-white/20 text-white">
                          {typeof tag === 'string' ? tag : tag.tagName}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white text-xl mb-3">Thông tin Startup</h3>
                    <div className="p-4 bg-white/5 rounded-lg">
                      <p className="text-white">Tên: {project.startupName || project.founder?.company || 'N/A'}</p>
                      <p className="text-white/70">Người đại diện: {project.founderName || project.founder?.name}</p>
                      <p className="text-white/70">Email: {project.founderEmail || project.founder?.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
                <h3 className="text-white text-xl mb-4">Phản hồi / Lý do từ chối (nếu có)</h3>
                <Label htmlFor="feedback" className="text-white/70 mb-2 block">
                  Nhập phản hồi cho Startup
                </Label>
                <Textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={5}
                  placeholder="Nhập phản hồi hoặc lý do từ chối..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl text-white mb-4">Thông tin dự án</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Danh mục</p>
                    <p className="text-white">{project.category}</p>
                  </div>

                  <div>
                    <p className="text-white/70 text-sm mb-1">Mục tiêu gọi vốn</p>
                    <p className="text-2xl text-white">{formatMoney(project.targetAmount)}</p>
                  </div>

                  <div>
                    <p className="text-white/70 text-sm mb-1">Thời gian gọi vốn</p>
                    <p className="text-white">{project.daysLeft} ngày</p>
                  </div>

                  <div>
                    <p className="text-white/70 text-sm mb-1">Ngày nộp</p>
                    <p className="text-white">
                      {new Date(project.submittedAt || project.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl text-white mb-4">Hành động</h3>
                
                <div className="space-y-3">
                  <Button
                    onClick={handleApprove}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-6"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {loading ? 'Đang xử lý...' : 'Phê duyệt dự án'}
                  </Button>

                  <Button
                    onClick={handleReject}
                    disabled={loading}
                    variant="outline"
                    className="w-full border-red-500/50 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-6"
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    Từ chối dự án
                  </Button>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4">
                <p className="text-yellow-400 text-sm">
                  💡 Lưu ý: Hãy thẩm định kỹ trước khi phê duyệt. Dự án đã duyệt sẽ hiển thị công khai cho nhà đầu tư.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}