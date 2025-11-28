import { useState } from 'react';
import { UserPlus, Mail, Lock, User, Phone, MapPin, Building, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { toast } from 'sonner';
import { authAPI } from '../../services/api'; // Logic API từ File 1

interface RegisterPageProps {
  onRegister: (user: any) => void;
  onNavigate: (path: string) => void;
}

export default function RegisterPage({ onRegister, onNavigate }: RegisterPageProps) {
  // --- PHẦN LOGIC (GIỮ NGUYÊN TỪ FILE 1) ---
  const [role, setRole] = useState<'investor' | 'startup'>('investor');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    address: '',
    company: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate
    if (formData.password !== formData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp!');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }
    if (!formData.email || !formData.name) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    setLoading(true);

    try {
      const registerData = {
        email: formData.email.trim(),
        password: formData.password,
        name: formData.name.trim(),
        phone: formData.phone.trim() || undefined,
        company: role === 'startup' ? formData.company.trim() || undefined : undefined,
        role: role === 'investor' ? 'INVESTOR' : 'STARTUP', // Backend nhận đúng enum
      };

      // GỌI API THẬT
      const response = await authAPI.register(registerData);

      // Thành công
      toast.success('Đăng ký thành công! Chào mừng bạn đến với StarFund');

      // Lưu thông tin user + token
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);

      // Chuyển hướng
      onRegister(response.user);

    } catch (err: any) {
      console.error('Lỗi đăng ký:', err);
      const message = err.message || 'Đăng ký thất bại! Email có thể đã tồn tại.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // --- PHẦN GIAO DIỆN (UI TỪ FILE 2) ---
  return (
    <div className="fixed top-0 left-0 w-full min-h-screen flex justify-center px-4 mt-4 overflow-y-auto">
      <div className="w-auto max-w-2xl mt-4 mb-20">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => onNavigate('home')}
          className="mb-6 text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>

        {/* Register Form Container */}
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-8 mt-4 border border-white/20">
          <div className="text-center mb-8">
            <h2 className="text-3xl text-white mb-2">Đăng ký tài khoản</h2>
            <p className="text-white/70">
              Tham gia cộng đồng StarFund ngay hôm nay
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Role Selection - Style xanh lá của File 2 */}
            <div>
              <Label className="text-white mb-4 block">Bạn là:</Label>
              <RadioGroup value={role} onValueChange={setRole as (val: string) => void}>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`flex items-center space-x-2 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      role === 'investor'
                        ? 'border-green-500 bg-green-500/20'
                        : 'border-white/20 bg-white/5'
                    }`}
                    onClick={() => setRole('investor')}
                  >
                    <RadioGroupItem value="investor" id="investor" />
                    <Label
                      htmlFor="investor"
                      className="text-white cursor-pointer flex-1"
                    >
                      <div className="p-2">
                        <p className="font-semibold">Nhà đầu tư</p>
                        <p className="text-xs text-white/70">
                          Đầu tư vào các dự án
                        </p>
                      </div>
                    </Label>
                  </div>
                  <div
                    className={`flex items-center space-x-2 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      role === 'startup'
                        ? 'border-green-500 bg-green-500/20'
                        : 'border-white/20 bg-white/5'
                    }`}
                    onClick={() => setRole('startup')}
                  >
                    <RadioGroupItem value="startup" id="startup" />
                    <Label
                      htmlFor="startup"
                      className="text-white cursor-pointer flex-1"
                    >
                      <div className="p-2">
                        <p className="font-semibold">Startup</p>
                        <p className="text-xs text-white/70">
                          Gọi vốn cho dự án
                        </p>
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Form Fields - Style Input File 2 (Icon bên phải, focus xanh) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-4">
              <div>
                <Label htmlFor="name" className="text-white mb-2 block">
                  Họ và tên *
                </Label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-green-500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-white mb-2 block">
                  Email *
                </Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-green-500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-white mb-2 block">
                  Mật khẩu *
                </Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-green-500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-white mb-2 block">
                  Xác nhận mật khẩu *
                </Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-green-500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone" className="text-white mb-2 block">
                  Số điện thoại
                </Label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="0901234567"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-green-500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address" className="text-white mb-2 block">
                  Địa chỉ
                </Label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Hà Nội, Việt Nam"
                    value={formData.address}
                    onChange={handleChange}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-green-500"
                  />
                </div>
              </div>

              {role === 'startup' && (
                <div className="md:col-span-2">
                  <Label htmlFor="company" className="text-white mb-2 block">
                    Tên công ty / Startup
                  </Label>
                  <div className="relative">
                    <Building className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      placeholder="ABC Startup Co."
                      value={formData.company}
                      onChange={handleChange}
                      required={role === 'startup'}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-green-500"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center mb-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-48 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg transition-transform hover:scale-105"
              >
                {loading ? 'Đang xử lý...' : 'Đăng ký ngay'}
              </Button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-white/70">
              Đã có tài khoản?{' '}
              <button
                onClick={() => onNavigate('login')}
                className="text-green-400 hover:text-green-300 underline"
              >
                Đăng nhập
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}