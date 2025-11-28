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

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || parseInt(amount) < 100000) {
      toast.error('Số tiền đầu tư tối thiểu là 100.000 VNĐ');
      return;
    }

    setLoading(true);

    try {
      if (IS_MOCK_MODE) {
        // MOCK MODE – GIẢ LẬP THÀNH CÔNG
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
        // REAL MODE – GỌI VNPAY THẬT
        const result = await investmentAPI.createInvestment({
          projectId: project.id,
          amount: parseInt(amount),
          message: `Đầu tư vào dự án ${project.title}`,
          paymentMethod: 'vnpay'
        });

        // Backend trả về: { success: true, data: { paymentUrl: "..." } }
        const paymentUrl = result?.data?.paymentUrl || result?.paymentUrl;

        if (paymentUrl) {
          toast.success('Đang chuyển đến cổng thanh toán VNPay...');
          console.log('Chuyển đến VNPay:', paymentUrl);
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
      if (IS_MOCK_MODE) setLoading(false);
      // Không tắt loading khi real → vì đang redirect sang VNPay
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
        <div className="text-center">
          <p className="text-white text-2xl mb-6">Không tìm thấy dự án</p>
          <Button onClick={() => onNavigate('home')} size="lg">
            Quay về trang chủ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900">
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
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Thanh toán đầu tư</h2>
                  <p className="text-white/70">Hoàn tất khoản đầu tư của bạn</p>
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
                    className="bg-white/10 border-white/30 text-white text-2xl h-16 placeholder:text-white/50"
                    placeholder="100000"
                  />
                  <p className="text-right text-white/80 text-lg mt-2">
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
                        className="h-12 border-white/30 bg-white/5 hover:bg-white/20 text-white font-medium"
                      >
                        {formatMoney(val)}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator className="bg-white/20" />

                {/* Payment Method */}
                <div>
                  <Label className="text-white text-lg mb-4 block">Phương thức thanh toán</Label>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div
                      className={`flex items-center space-x-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                        paymentMethod === 'vnpay'
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-white/20 bg-white/5'
                      }`}
                      onClick={() => setPaymentMethod('vnpay')}
                    >
                      <RadioGroupItem value="vnpay" id="vnpay" className="border-white" />
                      <div className="flex items-center gap-4 flex-1">
                        <div className="p-3 bg-blue-500/30 rounded-xl">
                          <Wallet className="w-7 h-7 text-blue-400" />
                        </div>
                        <div>
                          <Label htmlFor="vnpay" className="text-white text-lg cursor-pointer">
                            VNPay QR / Thẻ
                          </Label>
                          <p className="text-white/60 text-sm">Thanh toán an toàn qua VNPay</p>
                        </div>
                      </div>
                    </div>

                    {IS_MOCK_MODE && (
                      <div
                        className={`flex items-center space-x-4 p-5 rounded-2xl border-2 cursor-pointer transition-all mt-3 ${
                          paymentMethod === 'card'
                            ? 'border-green-500 bg-green-500/20'
                            : 'border-white/20 bg-white/5'
                        }`}
                        onClick={() => setPaymentMethod('card')}
                      >
                        <RadioGroupItem value="card" id="card" />
                        <div className="flex items-center gap-4 flex-1">
                          <div className="p-3 bg-green-500/30 rounded-xl">
                            <CreditCard className="w-7 h-7 text-green-400" />
                          </div>
                          <div>
                            <Label htmlFor="card" className="text-white text-lg cursor-pointer">
                              Thẻ ngân hàng (Mock)
                            </Label>
                            <p className="text-white/60 text-sm">Chỉ dùng khi bật Mock Mode</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </RadioGroup>
                </div>

                {/* Security Badge */}
                <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/30 rounded-2xl">
                  <Shield className="w-8 h-8 text-cyan-400" />
                  <div>
                    <p className="text-white font-medium">Giao dịch được bảo mật 100%</p>
                    <p className="text-white/70 text-sm">Mã hóa SSL • PCI DSS • 3D Secure</p>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-xl"
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
              <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">Thông tin dự án</h3>
                
                <div className="aspect-video rounded-2xl overflow-hidden mb-6 border border-white/20">
                  <img
                    src={project.image || `http://localhost:8080${project.imageUrl}`}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/800x400/4c1d95/ffffff?text=StarFund+Project' }}
                  />
                </div>

                <h4 className="text-2xl font-bold text-white mb-2">{project.title}</h4>
                <p className="text-purple-300 text-lg mb-6">{project.startupName || project.founder?.company || 'Startup'}</p>

                <Separator className="bg-white/20 my-6" />

                <div className="space-y-5 text-lg">
                  <div className="flex justify-between">
                    <span className="text-white/80">Số tiền đầu tư</span>
                    <span className="text-white font-bold">{formatMoney(parseInt(amount || '0'))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Phí giao dịch</span>
                    <span className="text-green-400">Miễn phí</span>
                  </div>
                  <Separator className="bg-white/20" />
                  <div className="flex justify-between text-xl">
                    <span className="text-white">Tổng cộng</span>
                    <span className="text-white font-bold">{formatMoney(parseInt(amount || '0'))}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-600/30 to-pink-600/30 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/50">
                <h3 className="text-2xl font-bold text-white mb-6">Quyền lợi nhà đầu tư</h3>
                <ul className="space-y-4">
                  {['Nhận email xác nhận & báo cáo định kỳ', 'Cập nhật tiến độ dự án hàng tháng', 'Tham gia cộng đồng nhà đầu tư VIP', 'Cơ hội nhận lợi nhuận khi dự án thành công'].map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-white/90">{benefit}</span>
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