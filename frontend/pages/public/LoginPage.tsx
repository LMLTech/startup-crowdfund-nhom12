import { useState } from 'react';
import { LogIn, Mail, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import { authAPI } from '../../services/api'; // Import logic API từ File 1
import { mockUsers } from '../../utils/mockData';

interface LoginPageProps {
  onLogin: (user: any) => void;
  onNavigate: (path: string) => void;
}

export default function LoginPage({ onLogin, onNavigate }: LoginPageProps) {
  // --- PHẦN LOGIC (GIỮ NGUYÊN TỪ FILE 1) ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Vui lòng nhập email và mật khẩu!');
      return;
    }

    setLoading(true);

    try {
      // GỌI API THẬT TỪ BACKEND (Logic File 1)
      const response = await authAPI.login({ email, password });

      // Backend trả về: { user: {...}, token: "..." }
      const { user, token } = response;

      // Lưu vào localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

      toast.success(`Chào mừng ${user.name || user.email}! Đăng nhập thành công!`);
      onLogin(user);

    } catch (err: any) {
      console.error('Login error:', err);
      toast.error(err.message || 'Email hoặc mật khẩu không đúng!');
    } finally {
      setLoading(false);
    }
  };

  // Logic Quick Login từ File 1 (Rất tiện lợi, giữ lại nhưng áp dụng vào UI File 2)
  const quickLogin = async (role: 'investor' | 'startup' | 'cva' | 'admin') => {
    const mockUser = mockUsers.find(u => u.role.toLowerCase() === role);
    if (!mockUser) {
      toast.error('Không tìm thấy tài khoản demo!');
      return;
    }

    setEmail(mockUser.email);
    setPassword(mockUser.password || '123456');

    toast.success(`Đã điền sẵn tài khoản ${role.toUpperCase()}! Nhấn Đăng nhập để vào ngay!`, {
      duration: 3000,
    });
  };

  // --- PHẦN GIAO DIỆN (UI TỪ FILE 2) ---
  return (
    <div className="fixed top-0 left-0 w-full flex items-center justify-center mt-4">
      <div className="w-auto max-w-md mt-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => onNavigate('home')}
          className="mb-6 text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>

        {/* Login Form Container - Style File 2 */}
        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-8 border border-white/20 mt-4">
          <div className="text-center mb-8">
            <h2 className="text-xl text-white mb-2 font-semibold">Đăng nhập</h2>
            <p className="text-white/70 font-semibold">
              Chào mừng bạn quay trở lại!
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-white mb-2 block">
                Email
              </Label>
              <div className="relative mb-4">
                {/* Icon bên phải theo style File 2 */}
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-white mb-2 block">
                Mật khẩu
              </Label>
              <div className="relative">
                {/* Icon bên phải theo style File 2 */}
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 mb-4"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={loading}
                className="w-48 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white mb-4 shadow-lg transition-all hover:scale-105"
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </div>
          </form>

          {/* Quick Login for Demo - UI File 2 nhưng gọi hàm logic File 1 */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-white/70 text-sm text-center mb-3 font-semibold mt-2 mb-2">
              Demo - Đăng nhập nhanh:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => quickLogin('investor')}
                className="border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs"
              >
                Nhà đầu tư
              </Button>
              <Button
                variant="outline"
                onClick={() => quickLogin('startup')}
                className="border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs"
              >
                Startup
              </Button>
              <Button
                variant="outline"
                onClick={() => quickLogin('cva')}
                className="border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs"
              >
                CVA
              </Button>
              <Button
                variant="outline"
                onClick={() => quickLogin('admin')}
                className="border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs"
              >
                Admin
              </Button>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-4 text-center">
            <p className="text-white/70">
              Chưa có tài khoản?{' '}
              <button
                onClick={() => onNavigate('register')}
                className="text-green-400 hover:text-green-300 underline font-medium"
              >
                Đăng ký ngay
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}