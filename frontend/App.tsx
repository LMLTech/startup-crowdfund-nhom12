import { useState, useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import SpaceBackground from './components/SpaceBackground2';

// Public Pages
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import ProjectDetailPage from './pages/public/ProjectDetailPage';
import ExplorePage from './pages/public/ExplorePage';
import FAQPage from './pages/public/FAQPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import BlogPage from './pages/public/BlogPage';
import BlogDetailPage from './pages/public/BlogDetailPage';

// Investor Pages
import InvestorDashboard from './pages/investor/InvestorDashboard';
import InvestmentHistory from './pages/investor/InvestmentHistory';
import PaymentPage from './pages/investor/PaymentPage';

// Startup Pages
import StartupDashboard from './pages/startup/StartupDashboard';
import CreateProject from './pages/startup/CreateProject';
import MyProjects from './pages/startup/MyProjects';
import EditProject from './pages/startup/EditProject';

// CVA Pages
import CVADashboard from './pages/cva/CVADashboard';
import ReviewProjects from './pages/cva/ReviewProjects';
import ReviewDetail from './pages/cva/ReviewDetail';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import ProjectManagement from './pages/admin/ProjectManagement';
import TransactionManagement from './pages/admin/TransactionManagement';

// Import Types
import { AuthResponse } from './services/api';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<AuthResponse | null>(null);
  
  // Dùng any cho data để linh hoạt, tránh xung đột kiểu Project/Blog
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [selectedBlog, setSelectedBlog] = useState<any>(null);

  // Load user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user'); // Dùng key 'user' thống nhất
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (err) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogin = (user: AuthResponse) => {
    setCurrentUser(user);
    // Lưu ý: Auth Service đã lưu localStorage rồi
    
    const role = (user.role || '').toLowerCase();
    if (role === 'investor') setCurrentPage('investor-dashboard');
    else if (role === 'startup') setCurrentPage('startup-dashboard');
    else if (role === 'cva') setCurrentPage('cva-dashboard');
    else if (role === 'admin') setCurrentPage('admin-dashboard');
    else setCurrentPage('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setCurrentPage('home');
  };

  const handleRegister = (user: AuthResponse) => {
    setCurrentUser(user);
    const role = (user.role || '').toLowerCase();
    if (role === 'investor') setCurrentPage('home');
    else if (role === 'startup') setCurrentPage('startup-dashboard');
  };

  // Định nghĩa hàm navigateTo chuẩn, chấp nhận mọi kiểu data
  const navigateTo = (page: string, data?: any) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);

    if (data) {
      if (['project-detail', 'review-detail', 'edit-project', 'payment'].includes(page)) {
        setSelectedProject(data);
      } else if (page === 'blog-detail') {
        setSelectedBlog(data);
      }
    } else {
      // Clear data khi chuyển trang không cần data
      // setSelectedProject(null); // Tùy chọn: có thể giữ lại để back
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      // --- Public Pages ---
      case 'home':
        return <HomePage currentUser={currentUser} onNavigate={navigateTo} onLogout={handleLogout} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigate={navigateTo} />;
      case 'register':
        return <RegisterPage onRegister={handleRegister} onNavigate={navigateTo} />;
      case 'project-detail':
        return <ProjectDetailPage project={selectedProject} currentUser={currentUser} onNavigate={navigateTo} onLogout={handleLogout} />;
      case 'explore':
        return <ExplorePage currentUser={currentUser} onNavigate={navigateTo} onLogout={handleLogout} />;
      case 'faq':
        return <FAQPage currentUser={currentUser} onNavigate={navigateTo} onLogout={handleLogout} />;
      case 'about':
        return <AboutPage currentUser={currentUser} onNavigate={navigateTo} onLogout={handleLogout} />;
      case 'contact':
        return <ContactPage currentUser={currentUser} onNavigate={navigateTo} onLogout={handleLogout} />;
      case 'blog':
        return <BlogPage currentUser={currentUser} onNavigate={navigateTo} onLogout={handleLogout} />;
      case 'blog-detail': {
        // Fix lỗi truyền props cho BlogDetail (cast component to any to satisfy prop types)
        const BlogDetailComponent: any = BlogDetailPage;
        return <BlogDetailComponent blog={selectedBlog} currentUser={currentUser} onNavigate={navigateTo} onLogout={handleLogout} />;
      }
      
      // --- Investor Pages ---
      case 'investor-dashboard':
        return <InvestorDashboard currentUser={currentUser} onNavigate={navigateTo} onLogout={handleLogout} />;
      case 'investment-history':
        return <InvestmentHistory currentUser={currentUser} onNavigate={navigateTo} onLogout={handleLogout} />;
      case 'payment':
        return <PaymentPage project={selectedProject} currentUser={currentUser} onNavigate={navigateTo} onLogout={handleLogout} />;
      
      // --- Startup Pages ---
      case 'startup-dashboard':
        return <StartupDashboard currentUser={currentUser} onNavigate={navigateTo} onLogout={handleLogout} />;
      case 'create-project':
        return <CreateProject currentUser={currentUser} onNavigate={navigateTo} onLogout={handleLogout} />;
      case 'my-projects':
        return <MyProjects currentUser={currentUser} onNavigate={navigateTo} onLogout={handleLogout} />;
      case 'edit-project':
        return <EditProject project={selectedProject} currentUser={currentUser} onNavigate={navigateTo} onLogout={handleLogout} />;
      
      // --- CVA Pages ---
      case 'cva-dashboard':
        return <CVADashboard currentUser={currentUser} onNavigate={navigateTo} onLogout={handleLogout} />;
      case 'review-projects':
        return <ReviewProjects currentUser={currentUser} onNavigate={navigateTo} onLogout={handleLogout} />;
      case 'review-detail':
        return <ReviewDetail project={selectedProject} currentUser={currentUser} onNavigate={navigateTo} onLogout={handleLogout} />;
      
      // --- Admin Pages ---
      case 'admin-dashboard':
        return <AdminDashboard currentUser={currentUser} onNavigate={navigateTo} onLogout={handleLogout} />;
      case 'user-management':
        return <UserManagement currentUser={currentUser} onNavigate={navigateTo} onLogout={handleLogout} />;
      case 'project-management':
        return <ProjectManagement currentUser={currentUser} onNavigate={navigateTo} onLogout={handleLogout} />;
      case 'transaction-management':
        return <TransactionManagement currentUser={currentUser} onNavigate={navigateTo} onLogout={handleLogout} />;
      
      default:
        return <HomePage currentUser={currentUser} onNavigate={navigateTo} onLogout={handleLogout} />;
    }
  };

  return (
  <div className="relative min-h-screen overflow-hidden">
    <SpaceBackground />

    {/* Toàn bộ UI nằm trên nền */}
    <div className="relative z-10">
      {renderPage()}
    </div>

    <Toaster position="top-right" />
  </div>
);
}