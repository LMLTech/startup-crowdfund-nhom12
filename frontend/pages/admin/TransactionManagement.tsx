import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Download } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';

// Import Mock & Utils
import { mockInvestments, formatCurrency as mockFormatCurrency } from '../../utils/mockData';
// Import Real API
import { transactionAPI } from '../../services/api';

// Kiểm tra chế độ
const IS_MOCK_MODE = (import.meta as any).env.VITE_USE_MOCK === 'true';

// Interface
interface TransactionManagementProps {
  currentUser: any;
  onNavigate: (path: string, data?: any) => void;
  onLogout: () => void;
}

export default function TransactionManagement({ currentUser, onNavigate, onLogout }: TransactionManagementProps) {
  // --- PHẦN LOGIC (GIỮ NGUYÊN TỪ FILE 1) ---
  const [transactions, setTransactions] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Fetch Data Logic
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        if (IS_MOCK_MODE) {
          // --- MOCK ---
          console.log("⚠️ Transactions: Đang dùng dữ liệu MOCK");
          await new Promise(resolve => setTimeout(resolve, 500));
          setTransactions(mockInvestments);
        } else {
          // --- REAL API ---
          const data = await transactionAPI.getAllTransactions();
          const list = Array.isArray(data) ? data : (data.content || []);
          setTransactions(list);
        }
      } catch (error) {
        console.error("Lỗi tải giao dịch:", error);
        toast.error("Không thể tải danh sách giao dịch");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // 2. Logic Format tiền tệ
  const formatMoney = (amount: number) => {
    if (IS_MOCK_MODE) return mockFormatCurrency(amount);
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // 3. Logic Lọc & Tìm kiếm
  const filteredTransactions = transactions.filter(item => {
    // Lấy mã giao dịch (Xử lý khác biệt giữa Mock và Real DB)
    const code = IS_MOCK_MODE ? item.transactionId : item.transactionCode;
    // Lấy tên người dùng
    const userName = IS_MOCK_MODE ? item.investorName : (item.user?.name || 'N/A');
    // Lấy tên dự án
    const projTitle = IS_MOCK_MODE ? item.projectTitle : (item.investment?.project?.title || item.description || '-');

    const searchLower = searchTerm.toLowerCase();

    return (
      (code && code.toLowerCase().includes(searchLower)) ||
      (userName && userName.toLowerCase().includes(searchLower)) ||
      (projTitle && projTitle.toLowerCase().includes(searchLower))
    );
  });

  const totalRevenue = transactions.reduce((sum, item) => sum + (item.amount || 0), 0);

  const handleExport = () => {
    toast.success('Đang xuất báo cáo giao dịch...');
  };

  // Helper hiển thị status badge (Logic File 1 nhưng style text-white để hợp File 2)
  const getStatusBadge = (status: string) => {
    const s = status ? status.toUpperCase() : '';
    if (s === 'SUCCESS' || s === 'COMPLETED') return <Badge className="bg-green-500/20 text-white border-0">Thành công</Badge>;
    if (s === 'PENDING') return <Badge className="bg-yellow-500/20 text-yellow-200 border-0">Đang xử lý</Badge>;
    if (s === 'FAILED' || s === 'REJECTED') return <Badge className="bg-red-500/20 text-red-200 border-0">Thất bại</Badge>;
    return <Badge className="bg-gray-500/20 text-gray-400 border-0">{s}</Badge>;
  };

  // --- PHẦN GIAO DIỆN (UI TỪ FILE 2) ---
  return (
    <div className="min-h-screen">
      <Navbar currentUser={currentUser} onNavigate={onNavigate} onLogout={onLogout} />

      <div className="pt-24 pb-20 px-10">
        <div className="container mx-auto max-w-7xl">
          
          {/* Header Section - Style File 2 */}
          <div className="w-3/4 mx-auto flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl text-white mb-2 font-semibold">
                  Quản lý giao dịch
                </h1>
                {IS_MOCK_MODE && <span className="text-[10px] bg-yellow-500 text-black px-1.5 py-0.5 rounded font-bold">MOCK</span>}
              </div>
              <p className="text-white/70">
                {loading 
                  ? "Đang tải dữ liệu..." 
                  : `Tổng: ${formatMoney(totalRevenue)} từ ${filteredTransactions.length} giao dịch`
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

          {/* Search Bar - Style File 2 (Icon bên phải) */}
          <div className="w-3/4 mx-auto bg-white/10 backdrop-blur-xl rounded-lg p-6 border border-white/20 mb-8">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <Input
                type="text"
                placeholder="Tìm kiếm theo dự án, nhà đầu tư, mã giao dịch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
          </div>

          {/* Table - Style File 2 (Bo góc, padding) */}
          <div className="w-3/4 mx-auto bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="text-left p-4 text-white/70">Mã GD</th>
                    <th className="text-left p-4 text-white/70">Nhà đầu tư</th>
                    <th className="text-left p-4 text-white/70">Dự án</th>
                    <th className="text-left p-4 text-white/70">Số tiền</th>
                    <th className="text-left p-4 text-white/70">Phương thức</th>
                    <th className="text-left p-4 text-white/70">Ngày GD</th>
                    <th className="text-left p-4 text-white/70">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-white/50">Đang tải dữ liệu...</td>
                    </tr>
                  ) : filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-white/50">Không tìm thấy giao dịch nào</td>
                    </tr>
                  ) : (
                    filteredTransactions.map((item) => (
                      <tr key={item.id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="p-4 text-white/70 font-mono text-sm">
                          {IS_MOCK_MODE ? item.transactionId : item.transactionCode}
                        </td>
                        <td className="p-4 text-white">
                          {IS_MOCK_MODE ? item.investorName : (item.user?.name || 'N/A')}
                        </td>
                        <td className="p-4 text-white max-w-xs">
                          <p className="line-clamp-2">
                            {IS_MOCK_MODE 
                              ? item.projectTitle 
                              : (item.investment?.project?.title || item.description || '-')
                            }
                          </p>
                        </td>
                        <td className="p-4 text-white font-medium">
                          {formatMoney(item.amount)}
                        </td>
                        <td className="p-4 text-white/70">
                          {item.paymentMethod || 'VNPAY'}
                        </td>
                        <td className="p-4 text-white/70">
                          {new Date(item.createdAt).toLocaleDateString("vi-VN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="p-4">
                          {getStatusBadge(item.status)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}