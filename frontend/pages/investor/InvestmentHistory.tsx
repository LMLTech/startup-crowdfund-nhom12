import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Download, Calendar } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';

// Import Mock & API (Logic File 1)
import { getInvestmentsByUserId, formatCurrency as mockFormatCurrency } from '../../utils/mockData';
import { investmentAPI } from '../../services/api';

const IS_MOCK_MODE = (import.meta as any).env.VITE_USE_MOCK === 'true';

interface InvestmentHistoryProps {
  currentUser: any;
  onNavigate: (path: string, data?: any) => void;
  onLogout: () => void;
}

export default function InvestmentHistory({ currentUser, onNavigate, onLogout }: InvestmentHistoryProps) {
  // --- PHẦN LOGIC (GIỮ NGUYÊN TỪ FILE 1) ---
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Hàm xử lý ngày tháng an toàn (Logic File 1)
  const safeDate = (dateString: any) => {
    try {
        if (!dateString) return 'N/A';
        if (Array.isArray(dateString)) {
            const [y, m, d, h, min, s] = dateString;
            return new Date(y, m - 1, d, h || 0, min || 0, s || 0).toLocaleDateString('vi-VN', {
                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });
        }
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'N/A';
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    } catch (e) {
        return 'N/A';
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        if (IS_MOCK_MODE) {
          console.log("⚠️ Investment History: MOCK MODE");
          await new Promise(resolve => setTimeout(resolve, 500));
          const mockData = getInvestmentsByUserId(currentUser?.id || 1);
          setInvestments(mockData || []);
        } else {
          // GỌI API THẬT (Logic File 1)
          const data = await investmentAPI.getMyInvestments();
          const list = Array.isArray(data) ? data : (data as any).content || [];
          setInvestments(list);
        }
      } catch (error) {
        console.error("Lỗi tải lịch sử:", error);
        toast.error("Không thể tải lịch sử đầu tư");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [currentUser]);

  const formatMoney = (amount: number) => {
    if (!amount) return '0 ₫';
    if (IS_MOCK_MODE) return mockFormatCurrency(amount);
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const filteredInvestments = investments
    .filter(inv => {
      const title = inv.projectTitle || inv.project?.title || 'Dự án không tên';
      const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase());
      
      const status = (inv.status || '').toLowerCase();
      const filter = filterStatus.toLowerCase();
      const matchesStatus = filterStatus === 'all' || status === filter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const timeA = new Date(a.createdAt || 0).getTime();
      const timeB = new Date(b.createdAt || 0).getTime();
      
      if (sortBy === 'newest') return timeB - timeA;
      if (sortBy === 'oldest') return timeA - timeB;
      if (sortBy === 'amount-high') return (b.amount || 0) - (a.amount || 0);
      if (sortBy === 'amount-low') return (a.amount || 0) - (b.amount || 0);
      return 0;
    });

  const totalInvested = investments.reduce((sum, inv) => sum + (inv.amount || 0), 0);

  // Helper Badge (Logic File 1 + Style File 2)
  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'success' || s === 'completed') return <Badge className="bg-green-500/20 text-green-400 border-0">Thành công</Badge>;
    if (s === 'pending') return <Badge className="bg-yellow-500/20 text-yellow-400 border-0">Đang xử lý</Badge>;
    if (s === 'failed') return <Badge className="bg-red-500/20 text-red-400 border-0">Thất bại</Badge>;
    return <Badge className="bg-gray-500/20 text-gray-400 border-0">{status}</Badge>;
  };

  const handleExport = () => {
    toast.success("Đang xuất dữ liệu...");
  };

  // --- PHẦN GIAO DIỆN (UI TỪ FILE 2 - Layout w-3/4 mx-auto) ---
  return (
    <div className="min-h-screen">
      <Navbar currentUser={currentUser} onNavigate={onNavigate} onLogout={onLogout} />

      <div className="pt-24 pb-20 px-4 mb-4">
        <div className="w-3/4 px-10 mx-auto max-w-7xl">
          
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl text-white mb-2 font-semibold">
                  Lịch sử đầu tư
                </h1>
                <p className="text-white/70">
                  {loading 
                    ? "Đang tải..." 
                    : `Tổng: ${formatMoney(totalInvested)} từ ${filteredInvestments.length} giao dịch`
                  }
                </p>
              </div>
              <Button
                onClick={handleExport}
                variant="outline"
                className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Xuất báo cáo
              </Button>
            </div>
          </div>

          {/* Filters - Style File 2 */}
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo tên dự án..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 backdrop-blur-xl border-white/20 text-white">
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="success">Thành công</SelectItem>
                  <SelectItem value="pending">Đang xử lý</SelectItem>
                  <SelectItem value="failed">Thất bại</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 backdrop-blur-xl border-white/20 text-white">
                  <SelectItem value="newest">Mới nhất</SelectItem>
                  <SelectItem value="oldest">Cũ nhất</SelectItem>
                  <SelectItem value="amount-high">Số tiền cao nhất</SelectItem>
                  <SelectItem value="amount-low">Số tiền thấp nhất</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Investments Table */}
          {loading ? (
             <div className="text-center text-white py-12 animate-pulse">Đang tải lịch sử giao dịch...</div>
          ) : filteredInvestments.length > 0 ? (
            <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden">
              
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="text-left p-4 text-white/70">ID Giao dịch</th>
                      <th className="text-left p-4 text-white/70">Dự án</th>
                      <th className="text-left p-4 text-white/70">Số tiền</th>
                      <th className="text-left p-4 text-white/70">Phương thức</th>
                      <th className="text-left p-4 text-white/70">Ngày đầu tư</th>
                      <th className="text-left p-4 text-white/70">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvestments.map((investment) => (
                      <tr key={investment.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                        <td className="p-4 text-white/70 font-mono text-sm">
                          {investment.transactionId || investment.transactionCode || `#${investment.id}`}
                        </td>
                        <td className="p-4 text-white max-w-xs">
                          <p className="line-clamp-2">{investment.projectTitle || investment.project?.title || 'Dự án không tên'}</p>
                        </td>
                        <td className="p-4 text-white font-medium">{formatMoney(investment.amount)}</td>
                        <td className="p-4 text-white/70">{investment.paymentMethod || 'VNPAY'}</td>
                        <td className="p-4 text-white/70">{safeDate(investment.createdAt)}</td>
                        <td className="p-4">{getStatusBadge(investment.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards (Giữ lại để responsive tốt hơn) */}
              <div className="md:hidden divide-y divide-white/10">
                {filteredInvestments.map((investment) => (
                  <div key={investment.id} className="p-4 hover:bg-white/5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="text-white mb-1">{investment.projectTitle || investment.project?.title}</p>
                        <p className="text-white/70 text-sm font-mono">{investment.transactionId || investment.transactionCode}</p>
                      </div>
                      {getStatusBadge(investment.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-white/70">Số tiền</p>
                        <p className="text-white">{formatMoney(investment.amount)}</p>
                      </div>
                      <div>
                        <p className="text-white/70">Ngày đầu tư</p>
                        <p className="text-white">{safeDate(investment.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-12 border border-white/20 text-center">
              <Calendar className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-xl text-white mb-2">Không tìm thấy giao dịch</h3>
              <p className="text-white/70">Bạn chưa có khoản đầu tư nào.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}