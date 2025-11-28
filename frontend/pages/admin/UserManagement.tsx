import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Edit, Trash2 } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';

// Import Mock & API (Logic File 1)
import { mockUsers } from '../../utils/mockData';
import { userAPI } from '../../services/api';

const IS_MOCK_MODE = (import.meta as any).env.VITE_USE_MOCK === 'true';

// 1. Interface (Logic File 1)
interface UserManagementProps {
  currentUser: any;
  onNavigate: (path: string, data?: any) => void;
  onLogout: () => void;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  status?: string;
  createdAt: string;
}

export default function UserManagement({ currentUser, onNavigate, onLogout }: UserManagementProps) {
  // --- PHẦN LOGIC (GIỮ NGUYÊN TỪ FILE 1) ---
  const [users, setUsers] = useState<UserData[]>([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Fetch Users Logic
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        if (IS_MOCK_MODE) {
          // --- MOCK ---
          console.log("⚠️ User Management: Đang dùng dữ liệu MOCK");
          await new Promise(resolve => setTimeout(resolve, 500));
          setUsers(mockUsers as unknown as UserData[]);
        } else {
          // --- REAL API ---
          const data = await userAPI.getAllUsers();
          const userList = Array.isArray(data) ? data : (data.content || []);
          setUsers(userList);
        }
      } catch (error) {
        console.error("Lỗi tải danh sách người dùng:", error);
        toast.error("Không thể tải danh sách người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Logic Xóa User (Logic File 1)
  const handleDelete = async (userId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;

    try {
      if (IS_MOCK_MODE) {
        setUsers(users.filter(u => u.id !== userId));
        toast.success('Đã xóa người dùng (Mock)!');
      } else {
        await userAPI.deleteUser(userId);
        setUsers(users.filter(u => u.id !== userId));
        toast.success('Đã xóa người dùng thành công!');
      }
    } catch (error) {
      toast.error('Lỗi khi xóa người dùng');
    }
  };

  // Logic Filter
  const filteredUsers = users.filter(user => {
    const name = user.name || '';
    const email = user.email || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const userRole = (user.role || '').toLowerCase();
    const filterRole = roleFilter.toLowerCase();
    
    const matchesRole = roleFilter === 'all' || userRole === filterRole;
    return matchesSearch && matchesRole;
  });

  // Helper chọn màu Badge (ĐÃ SỬA: Dùng text-white cho tất cả)
  const getRoleBadgeColor = (role: string) => {
    const r = (role || '').toLowerCase();
    switch(r) {
      case 'admin': return 'bg-red-500/20 text-white'; // Đã sửa text-red-400 -> text-white
      case 'cva': return 'bg-emerald-600/20 text-white'; // Đã sửa text-emerald-400 -> text-white
      case 'investor': return 'bg-blue-500/20 text-white'; // Đã sửa text-blue-400 -> text-white
      case 'startup': return 'bg-green-500/20 text-white'; // Đã sửa text-green-400 -> text-white
      default: return 'bg-gray-500/20 text-white'; // Đã sửa text-gray-400 -> text-white
    }
  };

  // --- PHẦN GIAO DIỆN (UI TỪ FILE 2 - Layout w-3/4 mx-auto) ---
  return (
    <div className="min-h-screen">
      <Navbar currentUser={currentUser} onNavigate={onNavigate} onLogout={onLogout} />

      <div className="pt-24 pb-20 px-10">
        <div className="container mx-auto max-w-7xl">
          
          {/* Header Section - Style File 2 */}
          <div className="flex items-center justify-center mb-8">
            <div>
              <div className="flex items-center gap-2 justify-center mb-2">
                <h1 className="text-xl text-white font-semibold">
                  Quản lý người dùng
                </h1>
                {IS_MOCK_MODE && <span className="text-[10px] bg-yellow-500 text-black px-1.5 py-0.5 rounded font-bold">MOCK</span>}
              </div>
              <p className="text-white/70 text-center">
                Tổng: {loading ? '...' : filteredUsers.length} người dùng
              </p>
            </div>
          </div>

          {/* Search & Filter - Style File 2 (w-3/4 mx-auto) */}
          <div className="mx-auto w-3/4 bg-white/10 backdrop-blur-xl rounded-lg p-6 border border-white/20 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 relative">
                {/* Icon bên phải theo style File 2 */}
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo tên, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Vai trò" />
                </SelectTrigger>
                <SelectContent className="w-3/4 bg-black/90 backdrop-blur-xl border-white/20 text-white">
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="investor">Nhà đầu tư</SelectItem>
                  <SelectItem value="startup">Startup</SelectItem>
                  <SelectItem value="cva">CVA</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table - Style File 2 (w-3/4 mx-auto) */}
          <div className="mx-auto w-3/4 bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="text-left p-4 text-white/70">ID</th>
                    <th className="text-left p-4 text-white/70">Tên</th>
                    <th className="text-left p-4 text-white/70">Email</th>
                    <th className="text-left p-4 text-white/70">Vai trò</th>
                    <th className="text-left p-4 text-white/70">Ngày tạo</th>
                    <th className="text-left p-4 text-white/70">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-white/50">Đang tải danh sách người dùng...</td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-white/50">Không tìm thấy người dùng nào</td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="p-4 text-white/70">#{user.id}</td>
                        <td className="p-4 text-white">{user.name}</td>
                        <td className="p-4 text-white/70">{user.email}</td>
                        <td className="p-4">
                          <Badge className={`${getRoleBadgeColor(user.role)} border-0`}>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="p-4 text-white/70">
                          {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
                              onClick={() => toast.info("Tính năng chỉnh sửa đang phát triển")}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(user.id)}
                              className="border-red-500/50 bg-red-500/10 hover:bg-red-500/20 text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
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