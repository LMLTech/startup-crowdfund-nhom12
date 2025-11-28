import React from 'react';
import { Clock, Users } from 'lucide-react';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { formatCurrency } from '../utils/mockData';

const IS_MOCK_MODE = import.meta.env.VITE_USE_MOCK === 'true';

interface ProjectCardProps {
  project: any;
  onClick: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const current = project.currentAmount || 0;
  const target = project.targetAmount || 1;
  const progress = (current / target) * 100;

  // Format tiền ngắn gọn
  const formatMoney = (amount: number) => {
    if (IS_MOCK_MODE) return formatCurrency(amount).replace('₫', '');
    if (amount >= 1_000_000_000) return (amount / 1_000_000_000).toFixed(1) + ' tỷ';
    if (amount >= 1_000_000) return (amount / 1_000_000).toFixed(0) + ' tr';
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  // Xử lý URL ảnh an toàn - ƯU TIÊN BACKEND TRƯỚC
  const imageUrl = (() => {
    // 1. Kiểm tra imageUrl từ backend (Real API) TRƯỚC
    if (project.imageUrl && typeof project.imageUrl === 'string') {
      // Nếu là URL đầy đủ (http/https/data:) -> dùng trực tiếp
      if (project.imageUrl.startsWith('http') || project.imageUrl.startsWith('data:')) {
        return project.imageUrl;
      }
      
      // Nếu là đường dẫn relative (/uploads/...) -> ghép với backend URL
      const cleanPath = project.imageUrl.startsWith('/') 
        ? project.imageUrl.substring(1) 
        : project.imageUrl;
      return `http://localhost:8080/${cleanPath}`;
    }

    // 2. Fallback: Mock mode hoặc legacy field 'image'
    if (project.image && (project.image.startsWith('http') || project.image.startsWith('data:'))) {
      return project.image;
    }

    // 3. Không có ảnh nào -> placeholder
    return 'https://placehold.co/600x400/2a2a2a/FFF?text=No+Image';
  })();

  const tags = Array.isArray(project.tags) ? project.tags : [];

  return (
    <div
      onClick={onClick}
      className="bg-white/10 backdrop-blur-xl rounded-xl overflow-hidden border border-white/20 hover:border-purple-400/50 transition-all cursor-pointer group hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 flex flex-col h-full"
    >
      {/* Project Image */}
      <div className="relative h-48 overflow-hidden bg-gray-800 flex-shrink-0">
        <img
          src={imageUrl}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            // Khi lỗi, thay bằng placeholder ổn định hơn
            e.currentTarget.src = 'https://placehold.co/600x400/2a2a2a/FFF?text=Image+Error';
            e.currentTarget.onerror = null; // Tránh lặp vô hạn nếu placeholder cũng lỗi
          }}
        />

        {/* Category Badge */}
        {project.category && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-purple-500/90 text-white border-0 shadow-md">
              {project.category}
            </Badge>
          </div>
        )}

        {/* Pending Badge */}
        {String(project.status || '').toLowerCase() === 'pending' && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-yellow-500/90 text-white border-0 shadow-md animate-pulse">
              Chờ duyệt
            </Badge>
          </div>
        )}
      </div>

      {/* Project Info */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors font-bold">
          {project.title}
        </h3>
        <p className="text-white/70 text-sm mb-4 line-clamp-2 min-h-[40px]">
          {project.description || 'Chưa có mô tả'}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag: any, index: number) => (
              <span
                key={index}
                className="px-2 py-1 bg-white/5 rounded text-xs text-white/70 border border-white/10"
              >
                {typeof tag === 'string' ? tag : tag.tagName || tag.name || 'Tag'}
              </span>
            ))}
          </div>
        )}

        {/* Spacer để đẩy phần dưới xuống đáy */}
        <div className="mt-auto">
            {/* Progress */}
            <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
                <span className="text-white/70">Đã đạt</span>
                <span className="text-white font-bold">{progress.toFixed(1)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-white/10">
                <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
                />
            </Progress>
            </div>

            {/* Amount */}
            <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
                <p className="text-white/70 text-xs mb-1">Đã huy động</p>
                <p className="text-white font-medium">{formatMoney(current)}</p>
            </div>
            <div>
                <p className="text-white/70 text-xs mb-1 text-right">Mục tiêu</p>
                <p className="text-white font-medium text-right">{formatMoney(target)}</p>
            </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-1 text-white/70 text-sm">
                <Users className="w-4 h-4" />
                <span>{project.investorCount || 0} nhà đầu tư</span>
            </div>
            <div className="flex items-center gap-1 text-white/70 text-sm">
                <Clock className="w-4 h-4" />
                <span>{project.daysLeft ?? 0} ngày</span>
            </div>
            </div>
        </div>
      </div>
    </div>
  );
}