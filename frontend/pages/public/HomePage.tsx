import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, DollarSign, Search, ArrowRight, Filter, ChevronDown } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProjectCard from '../../components/ProjectCard';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

// Import Hook & Helpers
import { useProjects } from '../../hooks/useProjects';
import { formatCurrency } from '../../utils/mockData';

interface HomePageProps {
  currentUser: any;
  onNavigate: (path: string, data?: any) => void;
  onLogout: () => void;
}

export default function HomePage({ currentUser, onNavigate, onLogout }: HomePageProps) {
  // --- PHẦN LOGIC (GIỮ NGUYÊN TỪ FILE 1) ---
  const { projects, loading, fetchApprovedProjects, isMockMode } = useProjects();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('trending');

  // Fetch data khi component mount
  useEffect(() => {
    fetchApprovedProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // Get unique categories
  const categories = ['all', ...new Set(projects.map(p => p.category).filter(Boolean))];

  // Filter and sort projects (Client-side)
  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'trending') return (b.investorCount || 0) - (a.investorCount || 0);
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'ending-soon') return (a.daysLeft || 0) - (b.daysLeft || 0);
      if (sortBy === 'most-funded') return (b.currentAmount || 0) - (a.currentAmount || 0);
      return 0;
    });

  // Calculate statistics
  const totalProjects = projects.length;
  const totalFunded = projects.reduce((sum, p) => sum + (p.currentAmount || 0), 0);
  const totalInvestors = projects.reduce((sum, p) => sum + (p.investorCount || 0), 0);

  // --- PHẦN GIAO DIỆN ---
  return (
    <div className="min-h-screen">
      <Navbar currentUser={currentUser} onNavigate={onNavigate} onLogout={onLogout} />

      {/* --- HERO SECTION (Style File 2) --- */}
      <section className="relative pt-32 pb-20 px-4 md:px-10 flex items-center justify-center overflow-hidden">
        {isMockMode && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-30">
             <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">MOCK MODE ACTIVE</span>
          </div>
        )}

        <div className="relative z-20 max-w-5xl mx-auto text-center backdrop-blur-lg">
            <h1
              className="animate-fade-in font-semibold leading-tight text-white"
              style={{
                fontWeight: 650,
                fontSize: "clamp(2rem, 5vw, 4rem)",
                lineHeight: 1.5,
                fontFamily: "'Poppins', 'Segoe UI', sans-serif",
              }}
            >
              Khám phá tương lai với{" "}
              <span
                className="block mt-2"
                style={{
                  fontWeight: 700,
                  background: "linear-gradient(to right, #3ABEF9, #00FF95)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "0.5px",
                }}
              >
                TreFund
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white mb-8 max-w-3xl mx-auto animate-slide-up mt-4">
              <span
                style={{
                  color: "#00FF95",
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                }}
              >
                TreFund
              </span>{" "}
              – nền tảng gây quỹ cho các startup, kết nối cộng đồng và nhà đầu tư.
              <br className="hidden md:block" />
              Một giải pháp an toàn, hiệu quả và thân thiện với người dùng
            </p>

            <div className="flex items-center justify-center gap-4 mb-12 animate-scale-in">
              {!currentUser ? (
                <Button
                  onClick={() => onNavigate("login")}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white mt-4 h-12 px-8 text-lg rounded-full shadow-lg hover:shadow-green-500/20 transition-all"
                >
                  Bắt đầu với chúng tôi
                </Button>
              ) : (
                <Button
                   onClick={() => {
                     const element = document.getElementById('project-list');
                     element?.scrollIntoView({ behavior: 'smooth' });
                   }}
                   className="bg-white/10 hover:bg-white/20 text-white border border-white/20 mt-4 h-12 px-8 text-lg rounded-full backdrop-blur-md transition-all"
                >
                  Xem dự án
                </Button>
              )}
            </div>
        </div>
      </section>

      {/* --- PHẦN DANH SÁCH DỰ ÁN & BỘ LỌC (Logic File 1) --- */}
      <div className="px-4 pb-20 relative z-10" id="project-list">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16 px-6">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors group">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="p-3 bg-purple-500/20 rounded-full group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-3xl font-bold text-white">{loading ? '...' : totalProjects}</span>
            </div>
            <p className="text-center text-white/60">Dự án đang gọi vốn</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors group">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="p-3 bg-pink-500/20 rounded-full group-hover:scale-110 transition-transform">
                <DollarSign className="w-6 h-6 text-pink-400" />
              </div>
              <span className="text-3xl font-bold text-white">{loading ? '...' : formatCurrency(totalFunded).replace('₫', '')}</span>
            </div>
            <p className="text-center text-white/60">Tổng vốn đã huy động</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors group">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="p-3 bg-blue-500/20 rounded-full group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-3xl font-bold text-white">{loading ? '...' : `${totalInvestors}+`}</span>
            </div>
            <p className="text-center text-white/60">Nhà đầu tư</p>
          </div>
        </div>

        <div className="container mx-auto">
          {/* Search and Filter */}
          <div className="max-w-5xl mx-auto bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl mb-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-6 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm dự án..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 bg-black/20 border-white/10 text-white placeholder:text-white/40 focus:border-[#00FF95] focus:ring-1 focus:ring-[#00FF95]/50 h-12 rounded-xl transition-all"
                />
              </div>
              <div className="md:col-span-3">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-black/20 border-white/10 text-white h-12 rounded-xl focus:ring-[#00FF95]/50">
                    <SelectValue placeholder="Danh mục" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/20 text-white">
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat} className="focus:bg-white/10 cursor-pointer">
                        {cat === 'all' ? 'Tất cả danh mục' : cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-black/20 border-white/10 text-white h-12 rounded-xl focus:ring-[#00FF95]/50">
                    <SelectValue placeholder="Sắp xếp" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/20 text-white">
                    <SelectItem value="trending" className="focus:bg-white/10 cursor-pointer">Phổ biến nhất</SelectItem>
                    <SelectItem value="newest" className="focus:bg-white/10 cursor-pointer">Mới nhất</SelectItem>
                    <SelectItem value="ending-soon" className="focus:bg-white/10 cursor-pointer">Sắp kết thúc</SelectItem>
                    <SelectItem value="most-funded" className="focus:bg-white/10 cursor-pointer">Vốn cao nhất</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          {loading ? (
              <div className="text-center text-white/50 py-20 text-xl animate-pulse">Đang tải danh sách dự án...</div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-white/70 text-xl">Không tìm thấy dự án phù hợp</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => onNavigate('project-detail', project)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- CTA SECTION*/}
      {!currentUser && (
        <div className="px-4 pb-20">
          <div className="container mx-auto">
            {/* Box CTA với màu nền nhẹ nhàng */}
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-3xl p-12 border border-white/10 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
              
              {/* Tiêu đề: Màu Gradient Xanh */}
              <h2 className="text-3xl md:text-4xl mb-4 font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Sẵn sàng hiện thực hóa ý tưởng?
              </h2>
              
              {/* Mô tả: Màu trắng */}
              <p className="text-white/80 mb-8 max-w-2xl mx-auto text-lg">
                Đăng ký ngay để khám phá các dự án tiềm năng hoặc gọi vốn cho ý tưởng của bạn
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* Nút 1: Gradient Xanh */}
                <Button
                  onClick={() => onNavigate('register')}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-8 py-6 text-lg rounded-full font-semibold shadow-lg hover:shadow-green-500/25 transition-all hover:-translate-y-1"
                >
                  Đăng ký làm Nhà đầu tư
                </Button>
                
                {/* Nút 2: Outline Trắng */}
                <Button
                  onClick={() => onNavigate('register')}
                  variant="outline"
                  className="border-white/30 bg-transparent hover:bg-white/10 text-white px-8 py-6 text-lg rounded-full backdrop-blur-sm hover:-translate-y-1 transition-transform"
                >
                  Đăng ký làm Startup
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer onNavigate={onNavigate} />
    </div>
  );
}