import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Users, Clock, Filter, SlidersHorizontal } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProjectCard from '../../components/ProjectCard';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Slider } from '../../components/ui/slider';

// Import Hook & Helpers (Logic từ File 1)
import { useProjects } from '../../hooks/useProjects';
import { formatCurrency } from '../../utils/mockData';

interface ExplorePageProps {
  currentUser: any;
  onNavigate: (path: string, data?: any) => void;
  onLogout: () => void;
}

export default function ExplorePage({ currentUser, onNavigate, onLogout }: ExplorePageProps) {
  // --- PHẦN LOGIC (GIỮ NGUYÊN TỪ FILE 1) ---
  const { projects, loading, fetchApprovedProjects, isMockMode } = useProjects();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('trending');
  const [showFilters, setShowFilters] = useState(false);
  
  // FIX: Giới hạn lọc giá 100 Tỷ để khớp với dữ liệu thật
  const [priceRange, setPriceRange] = useState([0, 100000000000]); 
  const [minProgress, setMinProgress] = useState(0);

  // Fetch data
  useEffect(() => {
    fetchApprovedProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get unique categories
  const categories = ['all', ...new Set(projects.map(p => p.category).filter(Boolean))];

  // Filter and sort
  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
      
      const target = project.targetAmount || 0;
      const matchesPrice = target >= priceRange[0] && target <= priceRange[1];
      
      const current = project.currentAmount || 0;
      const progress = target > 0 ? (current / target) * 100 : 0;
      const matchesProgress = progress >= minProgress;
      
      return matchesSearch && matchesCategory && matchesPrice && matchesProgress;
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

  // --- PHẦN GIAO DIỆN (UI TỪ FILE 2 - Đã sửa padding) ---
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentUser={currentUser} onNavigate={onNavigate} onLogout={onLogout} />

      {/* Hero Section */}
      {/* SỬA LỖI: Dùng pt-24 để không bị Navbar che mất nội dung */}
      <div className="pt-24 pb-12 px-4 mt-4"> 
        <div className="container mx-auto text-center">
          {isMockMode && <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold mb-4 inline-block">MOCK MODE</span>}
          
          <h1 className="text-xl md:text-6xl text-white mb-4 bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-600 bg-clip-text text-transparent font-semibold animate-pulse">
            Khám Phá Dự Án
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-3xl mx-auto">
            Tất cả các dự án đã được Hội đồng CVA thẩm định và phê duyệt
          </p>

          {/* Stats */}
          <div className="px-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8 px-4">
              <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-gray-700/30">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                  <span className="text-3xl text-white">{loading ? '...' : totalProjects}</span>
                </div>
                <p className="text-white/70">Dự án đang gọi vốn</p>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-gray-700/30">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="w-6 h-6 text-emerald-400" />
                  <span className="text-3xl text-white">{loading ? '...' : `${totalInvestors}+`}</span>
                </div>
                <p className="text-white/70">Nhà đầu tư</p>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-gray-700/30">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-6 h-6 text-blue-400" />
                  <span className="text-3xl text-white">
                    {loading ? '...' : formatCurrency(totalFunded).replace('₫', '')}
                  </span>
                </div>
                <p className="text-white/70">Tổng vốn huy động</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-10 mb-8 w-3/4 mx-auto">
        <div className="container mx-auto">
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
            {/* Main Search Bar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
              <div className="md:col-span-5 relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm dự án..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400"
                />
              </div>
              <div className="md:col-span-3">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Danh mục" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 backdrop-blur-xl border-white/20 text-white">
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat} className="focus:bg-white/10">
                        {cat === 'all' ? 'Tất cả danh mục' : cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Sắp xếp" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 backdrop-blur-xl border-white/20 text-white">
                    <SelectItem value="trending" className="focus:bg-white/10">Phổ biến nhất</SelectItem>
                    <SelectItem value="newest" className="focus:bg-white/10">Mới nhất</SelectItem>
                    <SelectItem value="ending-soon" className="focus:bg-white/10">Sắp kết thúc</SelectItem>
                    <SelectItem value="most-funded" className="focus:bg-white/10">Vốn cao nhất</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-1">
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  className={`w-full border-white/20 text-white ${showFilters ? 'bg-emerald-600 border-emerald-500' : 'bg-white/10 hover:bg-white/20'}`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="pt-4 border-t border-white/20 space-y-6 animate-in slide-in-from-top-2">
                <div>
                  <label className="text-white text-sm mb-3 block">
                    Vốn mục tiêu: {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                  </label>
                  <Slider
                    min={0}
                    max={100000000000} // Đã đồng bộ với logic State
                    step={50000000}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-white text-sm mb-3 block">
                    Tiến độ tối thiểu: {minProgress}%
                  </label>
                  <Slider
                    min={0}
                    max={100}
                    step={5}
                    value={[minProgress]}
                    onValueChange={(val) => setMinProgress(val[0])}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-end">
                   <Button
                    onClick={() => {
                      setPriceRange([0, 100000000000]); 
                      setMinProgress(0);
                      setSelectedCategory('all');
                      setSearchTerm('');
                    }}
                    variant="outline"
                    className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
                  >
                    Xóa bộ lọc
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Active Filters Tags */}
          {(selectedCategory !== 'all' || searchTerm || minProgress > 0) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedCategory !== 'all' && (
                <Badge className="bg-emerald-600 text-white border-0">
                  {selectedCategory}
                </Badge>
              )}
              {searchTerm && (
                <Badge className="bg-emerald-500/90 text-white border-0">
                  Tìm kiếm: {searchTerm}
                </Badge>
              )}
              {minProgress > 0 && (
                <Badge className="bg-blue-500/90 text-white border-0">
                  Tiến độ {'>='} {minProgress}%
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="px-10 pb-20 flex-1 w-3/4 mx-auto">
        <div className="container mx-auto">
          <div className="mb-6">
            <p className="text-white/70">
              Hiển thị {filteredProjects.length} dự án
            </p>
          </div>
          
          {loading ? (
             <div className="text-center text-white py-20 animate-pulse">Đang tải dữ liệu...</div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <Filter className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <p className="text-white/70 text-xl">Không tìm thấy dự án phù hợp</p>
              <p className="text-white/50 mt-2">Thử điều chỉnh bộ lọc của bạn</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      <Footer onNavigate={onNavigate} />
    </div>
  );
}