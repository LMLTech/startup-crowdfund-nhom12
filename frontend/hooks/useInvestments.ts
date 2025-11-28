import { useState } from 'react';
import { investmentAPI, Investment } from '../services/api';

const IS_MOCK_MODE = (import.meta as any).env.VITE_USE_MOCK === 'true';

export const useInvestments = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createInvestment = async (data: { projectId: number; amount: number; message: string }) => {
    setLoading(true);
    setError(null);
    try {
      if (IS_MOCK_MODE) {
        // --- MOCK INVESTMENT ---
        await new Promise(resolve => setTimeout(resolve, 500));
        alert(`[MOCK] Đã tạo lệnh đầu tư ${data.amount} VNĐ vào dự án ${data.projectId}. Giả lập thanh toán thành công!`);
        return { success: true, message: "Mock investment created" };

      } else {
        // --- REAL API INVESTMENT ---
        const response = await investmentAPI.createInvestment({
          ...data,
          paymentMethod: 'vnpay'
        });

        if (response && response.paymentUrl) {
          window.location.href = response.paymentUrl;
        }
        return response;
      }
    } catch (err: any) {
      setError(err.message || 'Tạo đầu tư thất bại');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchMyInvestments = async () => {
    setLoading(true);
    try {
      if (IS_MOCK_MODE) {
        // --- MOCK LIST ---
        await new Promise(resolve => setTimeout(resolve, 500));
        // Trả về mảng rỗng hoặc fake data
        setInvestments([
            { id: 1, amount: 1000000, status: 'SUCCESS', createdAt: new Date().toISOString(), project: { id: 1, title: "Mock Project" } } as any
        ]);
      } else {
        // --- REAL API LIST ---
        const data = await investmentAPI.getMyInvestments();
        setInvestments(data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    investments,
    loading,
    error,
    createInvestment,
    fetchMyInvestments,
    isMockMode: IS_MOCK_MODE
  };
};