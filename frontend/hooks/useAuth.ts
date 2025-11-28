import { useState, useEffect } from 'react';
import { authAPI, LoginRequest, RegisterRequest, AuthResponse } from '../services/api';

// Kiểm tra chế độ Mock
const IS_MOCK_MODE = (import.meta as any).env.VITE_USE_MOCK === 'true';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Key lưu trữ: Mock dùng 'currentUser', Real dùng 'user' -> Thống nhất dùng 'user'
    const savedUser = localStorage.getItem('user'); 
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (err) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (credentials: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      if (IS_MOCK_MODE) {
        // --- MOCK LOGIN ---
        await new Promise(resolve => setTimeout(resolve, 500)); // Giả lập delay
        
        // Hardcode mock user để test
        const mockUser: AuthResponse = {
            id: 1,
            email: credentials.email,
            name: 'Mock User',
            role: credentials.email.includes('admin') ? 'ADMIN' : 'INVESTOR',
            token: 'mock-token-123',
            status: 'ACTIVE'
        };
        
        // Giả lập check password đơn giản
        if (credentials.password !== '123456') throw new Error('Sai mật khẩu mock (dùng 123456)');

        setCurrentUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('token', mockUser.token);
        setLoading(false);
        return { user: mockUser, token: mockUser.token };

      } else {
        // --- REAL API LOGIN ---
        const data = await authAPI.login(credentials);
        setCurrentUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        setLoading(false);
        return data;
      }
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại');
      setLoading(false);
      throw err;
    }
  };

  const register = async (data: RegisterRequest) => {
    setLoading(true);
    setError(null);
    try {
      if (IS_MOCK_MODE) {
        // --- MOCK REGISTER ---
        await new Promise(resolve => setTimeout(resolve, 500));
        const newUser: AuthResponse = {
            id: Date.now(),
            email: data.email,
            name: data.name,
            role: data.role.toUpperCase(),
            token: 'mock-token-' + Date.now(),
            status: 'ACTIVE'
        };
        setCurrentUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.setItem('token', newUser.token);
        setLoading(false);
        return { user: newUser, token: newUser.token };

      } else {
        // --- REAL API REGISTER ---
        const response = await (authAPI as any).register(data);
        if (response.user && response.token) {
          setCurrentUser(response.user);
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('token', response.token);
        }
        setLoading(false);
        return response;
      }
    } catch (err: any) {
      setError(err.message || 'Đăng ký thất bại');
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser,
    isMockMode: IS_MOCK_MODE
  };
};