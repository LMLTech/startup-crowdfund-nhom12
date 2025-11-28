import React, { useState } from 'react';
import { 
  ArrowLeft, Users, Target, Clock, Check, User2, MessageCircle, DollarSign, Calendar 
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner';

// Import Helpers & Mock Data
import { formatCurrency as mockFormatCurrency, calculateProgress, mockProjectComments } from '../../utils/mockData';

// Fix import.meta (Logic File 1)
const IS_MOCK_MODE = (import.meta as any).env.VITE_USE_MOCK === 'true';

// Interface Props (Logic File 1)
interface ProjectDetailPageProps {
  project: any;
  currentUser: any;
  onNavigate: (path: string, data?: any) => void;
  onLogout: () => void;
}

export default function ProjectDetailPage({ project, currentUser, onNavigate, onLogout }: ProjectDetailPageProps) {
  // --- PHẦN LOGIC (GIỮ NGUYÊN TỪ FILE 1) ---
  const [comment, setComment] = useState('');
  // State comments (để UI cập nhật ngay khi thêm - Logic File 1)
  const [comments, setComments] = useState<any[]>(mockProjectComments);

  // Format tiền tệ linh hoạt (Logic File 1)
  const formatMoney = (amount: number) => {
    if (IS_MOCK_MODE) return mockFormatCurrency(amount);
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl">Không tìm thấy dự án</p>
          <Button onClick={() => onNavigate('home')} className="mt-4">
            Quay về trang chủ
          </Button>
        </div>
      </div>
    );
  }

  // Xử lý ảnh: Mock (URL/Blob) hoặc Real (Relative Path) - (Logic File 1)
  const imageUrl = (project.image && (project.image.startsWith('http') || project.image.startsWith('data:') || project.image.startsWith('blob:')))
    ? project.image
    : project.imageUrl 
        ? `http://localhost:8080${project.imageUrl}` 
        : 'https://via.placeholder.com/800x400?text=Project+Image';

  const progress = calculateProgress(project.currentAmount, project.targetAmount);

  // Xử lý đầu tư (Logic File 1 - Check quyền chặt chẽ)
  const handleInvest = () => {
    if (!currentUser) {
      toast.error('Bạn cần có tài khoản nhà đầu tư để thực hiện đóng góp. Vui lòng đăng nhập hoặc đăng ký để tiếp tục.');
      return;
    }

    const role = (currentUser.role || '').toLowerCase();
    // Chỉ cho phép Investor hoặc Admin (để test) đầu tư
    if (role !== 'investor' && role !== 'admin') {
      toast.error('Chỉ nhà đầu tư mới có thể đầu tư vào dự án!');
      return;
    }

    onNavigate('payment', project);
  };

  // Xử lý comment (Logic File 1 - Update State)
  const handleAddComment = () => {
    if (!currentUser) {
      toast.error('Bạn cần đăng nhập để bình luận.');
      return;
    }

    if (comment.trim() === '') {
      toast.error('Bình luận không được để trống.');
      return;
    }

    const newComment = {
      id: Date.now(), // Fake ID
      user: currentUser,
      userName: currentUser.name || currentUser.email, // Fallback name
      content: comment,
      createdAt: new Date().toLocaleDateString('vi-VN'), // Format date chuẩn VN
    };

    setComments([newComment, ...comments]); // Add to top
    setComment('');
    toast.success('Bình luận của bạn đã được thêm.');
  };

  // --- PHẦN GIAO DIỆN (UI TỪ FILE 2 - Tông màu Xanh/Emerald) ---
  return (
    <div className="min-h-screen">
      <Navbar currentUser={currentUser} onNavigate={onNavigate} onLogout={onLogout} />

      <div className="w-3/4 mx-auto pb-20 px-4 mt-24"> {/* Layout File 2 */}
        <div className="container mx-auto max-w-6xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => onNavigate('home')}
            className="mb-6 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Project Image */}
              <div className="relative h-96 rounded-2xl overflow-hidden bg-gray-800">
                <img
                  src={imageUrl} // Dùng logic imageUrl của File 1 để tránh lỗi ảnh
                  alt={project.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Project+Image'}}
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-emerald-600 text-white border-0">
                    {project.category}
                  </Badge>
                </div>
              </div>

              {/* Project Info */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
                <h1 className="text-4xl text-white mb-4 font-bold">{project.title}</h1>
                <p className="text-white/80 text-lg mb-2">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {(project.tags || []).map((tag: any, index: number) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="border-white/20 text-white"
                    >
                      {typeof tag === 'string' ? tag : tag.tagName}
                    </Badge>
                  ))}
                </div>

                {/* Startup Info */}
                <div className="pt-6 border-t border-white/20">
                  <p className="text-white/70 font-semibold text-sm uppercase tracking-wider">Startup</p>
                  <p className="text-white text-xl font-medium">{project.startupName || project.founder?.company || 'Startup'}</p>
                  <p className="text-white/70">{project.founderName || project.founder?.name}</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
                <Tabs defaultValue="description">
                  <TabsList className="bg-white/10 border-white/20 w-full justify-start">
                    <TabsTrigger
                      value="description"
                      className="data-[state=active]:bg-emerald-600 text-white flex-1 md:flex-none"
                    >
                      Mô tả chi tiết
                    </TabsTrigger>
                    <TabsTrigger
                      value="milestones"
                      className="data-[state=active]:bg-emerald-600 text-white flex-1 md:flex-none"
                    >
                      Mục tiêu
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="description" className="mt-6">
                    <div className="text-white/80 space-y-4 whitespace-pre-line leading-relaxed">
                      <p>{project.fullDescription}</p>
                      <div className="pt-4 mt-4 border-t border-white/10">
                        <h3 className="text-white text-xl mb-4 font-semibold">
                          Lợi ích cho nhà đầu tư
                        </h3>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-400 mt-0.5" />
                            <span className="text-white/80">Tham gia vào dự án tiềm năng với đội ngũ chuyên nghiệp</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-400 mt-0.5" />
                            <span className="text-white/80">Nhận cập nhật định kỳ về tiến độ dự án</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-400 mt-0.5" />
                            <span className="text-white/80">Cơ hội sinh lời cao khi dự án thành công</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-400 mt-0.5" />
                            <span className="text-white/80">Đóng góp vào phát triển cộng đồng và xã hội</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="milestones" className="mt-6">
                    <div className="space-y-4">
                      {(project.milestones || []).map((milestone: any, index: number) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border ${
                            milestone.completed
                              ? "bg-green-500/10 border-green-500/50"
                              : "bg-white/5 border-white/20"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-start gap-3">
                              {milestone.completed ? (
                                <Check className="w-5 h-5 text-green-400 mt-0.5" />
                              ) : (
                                <Target className="w-5 h-5 text-emerald-400 mt-0.5" />
                              )}
                              <div>
                                <h4 className="text-white font-medium">
                                  {milestone.title}
                                </h4>
                                <p className="text-white/70 text-sm">
                                  {milestone.description}
                                </p>
                              </div>
                            </div>
                            <span className="text-white/90 font-medium whitespace-nowrap">
                              {formatMoney(milestone.amount)}
                            </span>
                          </div>
                          {milestone.completed && (
                            <div className="ml-8">
                              <Badge className="bg-green-500/20 text-green-400 border-0">
                                Đã hoàn thành
                              </Badge>
                            </div>
                          )}
                        </div>
                      ))}
                      {(!project.milestones || project.milestones.length === 0) && 
                        <p className="text-white/50">Chưa có thông tin mục tiêu.</p>
                      }
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Comments */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
                <h3 className="text-white text-xl mb-4 font-bold flex items-center gap-2">
                   <MessageCircle className="w-5 h-5"/> Bình luận
                </h3>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Viết bình luận của bạn..."
                  className="w-full h-24 mb-4 bg-black/20 border-white/10 text-white"
                />
                <div className="w-fit">
                  <Button
                    onClick={handleAddComment}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-6"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Gửi bình luận
                  </Button>
                </div>

                <div className="mt-6 space-y-4">
                  {comments.map((comment: any, index: number) => (
                    <div key={index} className="flex items-start gap-4 pb-4 border-b border-white/5 last:border-0">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                        <User2 className="w-6 h-6 text-white/50" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold">
                          {comment.userName} <span className="text-white/30 font-normal text-xs ml-2">• {comment.createdAt || comment.date}</span>
                        </p>
                        <p className="text-white/80 mt-1">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar (Sticky) */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 sticky top-24 shadow-xl">
                <div className="mb-6">
                  <p className="text-4xl text-white mb-2 font-bold">
                    {formatMoney(project.currentAmount || 0)}
                  </p>
                  <p className="text-white/70">
                    Đã huy động từ {formatMoney(project.targetAmount)}
                  </p>
                </div>

                {/* Progress */}
                <div className="mb-6 mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/70 font-semibold">Tiến độ</span>
                    <span className="text-emerald-400 font-bold">{progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={progress} className="h-2 bg-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-green-600 to-emerald-600 rounded-full"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </Progress>
                </div>

                {/* Stats */}
                <div className="space-y-4 mb-8 mt-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Users className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white font-bold">{project.investorCount || 0}</p>
                      <p className="text-white/70 text-sm">Nhà đầu tư</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                      <Clock className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-white font-bold">{project.daysLeft} ngày</p>
                      <p className="text-white/70 text-sm">Còn lại</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-bold">
                        {new Date(project.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                      <p className="text-white/70 text-sm">Ngày bắt đầu</p>
                    </div>
                  </div>
                </div>

                {/* Invest Button */}
                <Button
                  onClick={handleInvest}
                  className="w-full h-14 text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:scale-[1.02] transition-transform"
                >
                  <DollarSign className="w-5 h-5 mr-2" />
                  Đầu tư ngay
                </Button>

                {!currentUser && (
                  <p className="text-white/50 text-xs text-center mt-4 font-medium">
                    * Vui lòng đăng nhập để đầu tư
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}