import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Wallet, Check, Shield } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Separator } from '../../components/ui/separator';
import { toast } from 'sonner';

// Import Mock Helper
import { formatCurrency as mockFormatCurrency } from '../../utils/mockData';
// Import Real API
import { investmentAPI } from '../../services/api';

// Kiểm tra chế độ
const IS_MOCK_MODE = (import.meta as any).env.VITE_USE_MOCK === 'true';

interface PaymentPageProps {
  project: any;
  currentUser: any;
  onNavigate: (path: string, data?: any) => void;
  onLogout: () => void;
}

export default function PaymentPage({ project, currentUser, onNavigate, onLogout }: PaymentPageProps) {
  const [amount, setAmount] = useState('1000000');
  const [paymentMethod, setPaymentMethod] = useState('vnpay');
  const [loading, setLoading] = useState(false);

  const suggestedAmounts = [1000000, 5000000, 10000000, 20000000];

  // Format tiền tệ
  const formatMoney = (value: number) => {
    if (IS_MOCK_MODE) return mockFormatCurrency(value);
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  // Logic xử lý ảnh an toàn
  const getImageUrl = () => {
    if (!project) return '';
    if (project.image && (project.image.startsWith('http') || project.image.startsWith('data:'))) {
        return project.image;
    }
    if (project.imageUrl) {
        const cleanPath = project.imageUrl.startsWith('/') ? project.imageUrl.substring(1) : project.imageUrl;
        return `http://localhost:8080/${cleanPath}`;
    }
    return 'https://placehold.co/600x400?text=No+Image';
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || parseInt(amount) < 100000) {
      toast.error('Số tiền đầu tư tối thiểu là 100.000 VNĐ');
      return;
    }

    setLoading(true);

    try {
      if (IS_MOCK_MODE) {
        // MOCK MODE
        await new Promise(resolve => setTimeout(resolve, 2000));
        const investment = {
          id: Date.now(),
          investorId: currentUser.id,
          investorName: currentUser.name,
          projectId: project.id,
          projectTitle: project.title,
          amount: parseInt(amount),
          paymentMethod: paymentMethod === 'vnpay' ? 'VNPay' : 'Thẻ ngân hàng',
          status: 'success',
          transactionId: `${paymentMethod.toUpperCase()}${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        const existing = JSON.parse(localStorage.getItem('investments') || '[]');
        existing.push(investment);
        localStorage.setItem('investments', JSON.stringify(existing));
        toast.success('Đầu tư thành công (Mock Mode)!');
        setTimeout(() => onNavigate('investment-history'), 1500);
      } else {
        // REAL MODE
        // ============================================================
        // FIX QUAN TRỌNG: Gửi 'VNPAY' viết hoa thay vì 'vnpay'
        // ============================================================
        const result = await investmentAPI.createInvestment({
          projectId: project.id,
          amount: parseInt(amount),
          message: `Đầu tư vào dự án ${project.title}`,
          paymentMethod: 'VNPAY' // <-- Đã sửa ở đây
        });

        // Backend trả về data đã được unwrap bởi handleResponse
        // Nếu cấu trúc là { data: { paymentUrl: ... } } thì dùng result.paymentUrl
        const paymentUrl = result?.paymentUrl || result?.data?.paymentUrl;

        if (paymentUrl) {
          toast.success('Đang chuyển đến cổng thanh toán VNPay...');
          window.location.href = paymentUrl;
        } else {
          console.error('Không nhận được paymentUrl:', result);
          toast.error('Lỗi kết nối thanh toán. Vui lòng thử lại sau.');
        }
      }
    } catch (error: any) {
      console.error('Payment Error:', error);
      toast.error(error?.message || 'Giao dịch thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false); // Sửa lại: Luôn tắt loading kể cả ở Real Mode nếu lỗi
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <p className="text-white text-2xl mb-6">Không tìm thấy dự án</p>
          <Button onClick={() => onNavigate('home')} size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
            Quay về trang chủ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar currentUser={currentUser} onNavigate={onNavigate} onLogout={onLogout} />

      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => onNavigate('project-detail', project)}
            className="mb-8 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại chi tiết dự án
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Payment Form */}
            <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg shadow-purple-500/20">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Thanh toán đầu tư</h2>
                  <p className="text-white/60">Hoàn tất khoản đầu tư của bạn</p>
                </div>
              </div>

              <form onSubmit={handlePayment} className="space-y-7">
                {/* Amount Input */}
                <div>
                  <Label htmlFor="amount" className="text-white text-lg mb-3 block">
                    Số tiền đầu tư
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="100000"
                    step="100000"
                    required
                    className="bg-white/10 border-white/20 text-white text-2xl h-16 placeholder:text-white/30 focus:border-purple-500 transition-colors"
                    placeholder="100000"
                  />
                  <p className="text-right text-white/80 text-lg mt-2 font-medium">
                    {formatMoney(parseInt(amount || '0'))}
                  </p>
                </div>

                {/* Suggested Amounts */}
                <div>
                  <Label className="text-white/80 mb-3 block">Gợi ý nhanh</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {suggestedAmounts.map((val) => (
                      <Button
                        key={val}
                        type="button"
                        variant="outline"
                        onClick={() => setAmount(val.toString())}
                        className="h-12 border-white/20 bg-white/5 hover:bg-white/10 hover:border-purple-500 text-white font-medium transition-all"
                      >
                        {formatMoney(val)}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator className="bg-white/10" />

                {/* Payment Method */}
                <div>
                  <Label className="text-white text-lg mb-4 block">Phương thức thanh toán</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div
                      className={`flex items-center space-x-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                        paymentMethod === 'vnpay'
                          ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/10'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                      onClick={() => setPaymentMethod('vnpay')}
                    >
                      <RadioGroupItem value="vnpay" id="vnpay" className="border-white text-purple-500" />
                      <div className="flex items-center gap-4 flex-1">
                        <div className="p-3 bg-blue-500/20 rounded-xl">
                          <Wallet className="w-7 h-7 text-blue-400" />
                        </div>
                        <div>
                          <Label htmlFor="vnpay" className="text-white text-lg cursor-pointer font-medium">
                            VNPay QR / Thẻ
                          </Label>
                          <p className="text-white/50 text-sm">Thanh toán an toàn qua cổng VNPay</p>
                        </div>
                      </div>
                    </div>

                    {/* Chỉ hiện Card Mock nếu bật Mock Mode */}
                    {IS_MOCK_MODE && (
                      <div
                        className={`flex items-center space-x-4 p-5 rounded-2xl border-2 cursor-pointer transition-all mt-3 ${
                          paymentMethod === 'card'
                            ? 'border-green-500 bg-green-500/10'
                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                        }`}
                        onClick={() => setPaymentMethod('card')}
                      >
                        <RadioGroupItem value="card" id="card" />
                        <div className="flex items-center gap-4 flex-1">
                          <div className="p-3 bg-green-500/20 rounded-xl">
                            <CreditCard className="w-7 h-7 text-green-400" />
                          </div>
                          <div>
                            <Label htmlFor="card" className="text-white text-lg cursor-pointer font-medium">
                              Thẻ ngân hàng (Mock)
                            </Label>
                            <p className="text-white/50 text-sm">Chỉ dùng để test giao diện</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </RadioGroup>
                </div>

                {/* Security Badge */}
                <div className="flex items-start gap-4 p-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                  <Shield className="w-8 h-8 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-blue-200 font-medium mb-1">Giao dịch được bảo mật 100%</p>
                    <p className="text-white/60 text-sm">Mã hóa SSL • PCI DSS • 3D Secure</p>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl shadow-purple-900/20 transition-all hover:scale-[1.02]"
                >
                  {loading ? (
                    <>Đang xử lý...</>
                  ) : (
                    <>Thanh toán {formatMoney(parseInt(amount || '0'))}</>
                  )}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="space-y-8">
              <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl h-fit sticky top-24">
                <h3 className="text-2xl font-bold text-white mb-6">Thông tin dự án</h3>
                
                <div className="aspect-video rounded-2xl overflow-hidden mb-6 border border-white/10 shadow-lg relative bg-gray-900">
                  <img
                    src={getImageUrl()}
                    alt={project.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/1a1a1a/FFF?text=Image+Error' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white font-bold text-lg line-clamp-1">{project.title}</p>
                  </div>
                </div>

                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className="text-white/60 text-sm mb-1">Startup</p>
                        <p className="text-white font-medium text-lg">{project.startupName || project.founder?.company || 'Startup'}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-white/60 text-sm mb-1">Mục tiêu</p>
                        <p className="text-purple-400 font-bold text-lg">{formatMoney(project.targetAmount)}</p>
                    </div>
                </div>

                <Separator className="bg-white/10 my-6" />

                <div className="space-y-5 text-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Số tiền đầu tư</span>
                    <span className="text-white font-bold">{formatMoney(parseInt(amount || '0'))}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Phí giao dịch</span>
                    <span className="text-green-400 font-medium bg-green-500/10 px-3 py-1 rounded-full text-sm">Miễn phí</span>
                  </div>
                  
                  <Separator className="bg-white/10" />
                  
                  <div className="flex justify-between items-center text-xl pt-2">
                    <span className="text-white font-bold">Tổng cộng</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-black text-2xl">
                        {formatMoney(parseInt(amount || '0'))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Benefits Box */}
              <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Check className="w-6 h-6 text-green-400" />
                    Quyền lợi nhà đầu tư
                </h3>
                <ul className="space-y-4">
                  {[
                      'Nhận email xác nhận & báo cáo định kỳ', 
                      'Cập nhật tiến độ dự án hàng tháng', 
                      'Tham gia cộng đồng nhà đầu tư VIP', 
                      'Cơ hội nhận lợi nhuận khi dự án thành công'
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3 group">
                      <div className="mt-1 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/30 transition-colors">
                        <Check className="w-3 h-3 text-green-400" />
                      </div>
                      <span className="text-white/80 text-sm leading-relaxed group-hover:text-white transition-colors">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}