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
      <Navbar
        currentUser={currentUser}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      {/* --- HERO SECTION (Style File 2) --- */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden ">
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
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white mt-4 h-12 px-8 text-lg rounded-full shadow-lg hover:shadow-green-500/20 transition-all px-4"
              >
                Bắt đầu với chúng tôi
              </Button>
            ) : (
              <Button
                onClick={() => {
                  const element = document.getElementById("project-list");
                  element?.scrollIntoView({ behavior: "smooth" });
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

      <Footer onNavigate={onNavigate} />
    </div>
  );
}