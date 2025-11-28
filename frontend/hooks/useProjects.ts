import { useState } from 'react';
import { projectAPI, Project } from '../services/api';

const IS_MOCK_MODE = import.meta.env.VITE_USE_MOCK === 'true';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  // 1. LẤY DANH SÁCH DỰ ÁN ĐÃ DUYỆT – DÙNG CHUNG projectAPI (MOCK + REAL ĐỀU CHẠY NGON)
  const fetchApprovedProjects = async (
    page = 1,
    limit = 12,
    search = '',
    category = 'all'
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await projectAPI.getApprovedProjects(page, limit, search, category);
      console.log('🔍 API Response:', response); 

      // Xử lý response thống nhất cho cả mock và real
      if (response && 'data' in response) {
        setProjects(response.data);
        setPagination(response.pagination || null);
      } else if (Array.isArray(response)) {
        setProjects(response);
      } else {
        setProjects([]);
      }
    } catch (err: any) {
      console.error('Lỗi fetch projects:', err);
      setError(err.message || 'Không thể tải dự án');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // 2. LẤY CHI TIẾT DỰ ÁN
  const fetchProjectById = async (id: number) => {
    setLoading(true);
    try {
      const project = await projectAPI.getProjectById(id);
      return project;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 3. TẠO DỰ ÁN
  const createProject = async (projectData: any, imageFile?: File) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', projectData.title);
      formData.append('description', projectData.description);
      formData.append('fullDescription', projectData.fullDescription || '');
      formData.append('category', projectData.category);
      formData.append('targetAmount', projectData.targetAmount.toString());
      formData.append('daysLeft', projectData.daysLeft.toString());
      if (imageFile) formData.append('image', imageFile);
      formData.append('tags', JSON.stringify(projectData.tags || []));
      formData.append('milestones', JSON.stringify(projectData.milestones || []));

      const newProject = await projectAPI.createProject(formData);
      return newProject;
    } catch (err: any) {
      setError(err.message || 'Tạo dự án thất bại');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 4. LẤY DỰ ÁN CỦA TÔI
  const fetchMyProjects = async () => {
    setLoading(true);
    try {
      const data = await projectAPI.getMyProjects();
      setProjects(data);
    } catch (err: any) {
      setError(err.message);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    projects,
    loading,
    error,
    pagination,
    fetchApprovedProjects,
    fetchProjectById,
    createProject,
    fetchMyProjects,
    isMockMode: IS_MOCK_MODE
  };
};