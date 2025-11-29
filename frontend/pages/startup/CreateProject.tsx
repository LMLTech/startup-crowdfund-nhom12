import React, { useState } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import Navbar from '../../components/Navbar';
import ImageUpload from '../../components/ImageUpload';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner';

// Import API (Logic File 1)
import { projectAPI } from '../../services/api';

// Fix lỗi import.meta
const IS_MOCK_MODE = (import.meta as any).env.VITE_USE_MOCK === 'true';

interface CreateProjectProps {
  currentUser: any;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

interface Milestone {
  title: string;
  description: string;
  amount: string;
}

export default function CreateProject({ currentUser, onNavigate, onLogout }: CreateProjectProps) {
  // --- PHẦN LOGIC (GIỮ NGUYÊN TỪ FILE 1) ---
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fullDescription: '',
    category: '',
    targetAmount: '',
    daysLeft: '90',
    image: '', 
    imageFile: null as File | null,
  });

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [milestones, setMilestones] = useState<Milestone[]>([
    { title: '', description: '', amount: '' }
  ]);
  const [loading, setLoading] = useState(false);

  const categories = [
    'Công nghệ - Môi trường', 'Xã hội - Ẩm thực', 'Giáo dục - Công nghệ',
    'Y tế - Công nghệ', 'Nông nghiệp - IoT', 'Tài chính - Blockchain',
    'Năng lượng - Môi trường', 'IoT - Smart Home', 'Du lịch - AI', 'Thời trang - AR',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => setTags(tags.filter(t => t !== tag));

  const handleAddMilestone = () => setMilestones([...milestones, { title: '', description: '', amount: '' }]);

  const handleRemoveMilestone = (index: number) => setMilestones(milestones.filter((_, i) => i !== index));

  const handleMilestoneChange = (index: number, field: keyof Milestone, value: string) => {
    const updated = [...milestones];
    updated[index][field] = value;
    setMilestones(updated);
  };

  // --- SUBMIT LOGIC CHUẨN (Logic File 1) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (tags.length === 0) {
      toast.error('Vui lòng thêm ít nhất 1 tag');
      return;
    }

    // Nếu chạy thật, bắt buộc chọn ảnh
    if (!formData.imageFile && !IS_MOCK_MODE) {
      toast.error('Vui lòng chọn hình ảnh cho dự án');
      return;
    }

    setLoading(true);

    try {
      if (IS_MOCK_MODE) {
        // MOCK MODE
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success('Dự án đã gửi duyệt (Mock)!');
        setTimeout(() => onNavigate('startup-dashboard'), 1000);
      } else {
        // REAL API MODE
        const apiFormData = new FormData();
        apiFormData.append('title', formData.title);
        apiFormData.append('description', formData.description);
        apiFormData.append('fullDescription', formData.fullDescription);
        apiFormData.append('category', formData.category);
        apiFormData.append('targetAmount', formData.targetAmount);
        apiFormData.append('daysLeft', formData.daysLeft);
        
        if (formData.imageFile) {
          apiFormData.append('image', formData.imageFile);
        }

        // Convert mảng Tags sang JSON string chuẩn
        apiFormData.append('tags', JSON.stringify(tags));
        
        // Convert Milestones sang JSON string chuẩn (lọc bỏ cái rỗng)
        const validMilestones = milestones
            .filter(m => m.title && m.amount)
            .map(m => ({
                title: m.title,
                description: m.description,
                amount: parseFloat(m.amount) || 0,
                completed: false
            }));
        
        apiFormData.append('milestones', JSON.stringify(validMilestones));

        const response = await projectAPI.createProject(apiFormData);
        
        if (response) {
            toast.success('Dự án đã được tạo thành công! Đang chờ CVA duyệt.');
            setTimeout(() => onNavigate('startup-dashboard'), 1000);
        }
      }
    } catch (error: any) {
      console.error("Create Project Error:", error);
      toast.error("Lỗi tạo dự án: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  // --- PHẦN GIAO DIỆN (UI TỪ FILE 2 - Layout w-3/4 mx-auto, Emerald Theme) ---
  return (
    <div className="min-h-screen">
      <Navbar currentUser={currentUser} onNavigate={onNavigate} onLogout={onLogout} />

      <div className="pt-24 pb-20 px-10 mb-4">
        <div className="w-3/4 mx-auto px-10 max-w-4xl">
          
          {/* Back Button */}
          {/* <Button
            variant="ghost"
            onClick={() => onNavigate('startup-dashboard')}
            className="mb-6 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại Dashboard
          </Button> */}

          {/* Main Form Container */}
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-8 border border-white/20 mt-4 px-10">
            <div className="flex items-center gap-4 mb-2">
                <h1 className="text-xl text-white font-semibold">Tạo dự án mới</h1>
                {IS_MOCK_MODE && <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded font-bold">MOCK MODE</span>}
            </div>
            <p className="text-white/70 mb-8">
              Điền thông tin chi tiết để bắt đầu gọi vốn
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title" className="text-white mb-2 block">
                  Tên dự án *
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="VD: EcoTech - Ứng dụng quản lý rác thải thông minh"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-white mb-2 block mt-4">
                  Mô tả ngắn *
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={2}
                  placeholder="Mô tả ngắn gọn về dự án (hiển thị trên card)"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              {/* Full Description */}
              <div>
                <Label htmlFor="fullDescription" className="text-white mb-2 block mt-4">
                  Mô tả chi tiết *
                </Label>
                <Textarea
                  id="fullDescription"
                  name="fullDescription"
                  value={formData.fullDescription}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Mô tả chi tiết về dự án, lợi ích, kế hoạch thực hiện..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              {/* Grid: Category, Amount, Days */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-white mb-2 block mt-4">Danh mục *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(val) => setFormData({...formData, category: val})}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 backdrop-blur-xl border-white/20 text-white">
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="targetAmount" className="text-white mb-2 block mt-4">
                    Mục tiêu gọi vốn (VNĐ) *
                  </Label>
                  <Input
                    id="targetAmount"
                    name="targetAmount"
                    type="number"
                    value={formData.targetAmount}
                    onChange={handleChange}
                    required
                    min="1000000"
                    placeholder="500000000"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>

                <div>
                  <Label htmlFor="daysLeft" className="text-white mb-2 block">
                    Thời gian gọi vốn (ngày) *
                  </Label>
                  <Input
                    id="daysLeft"
                    name="daysLeft"
                    type="number"
                    value={formData.daysLeft}
                    onChange={handleChange}
                    required
                    min="30"
                    max="180"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <ImageUpload 
                  label="Hình ảnh dự án"
                  value={formData.image}
                  onChange={(file, previewUrl) => setFormData({...formData, imageFile: file, image: previewUrl})}
                  required
                />
              </div>

              {/* Tags */}
              <div>
                <Label className="text-white mb-2 block mt-4">Tags (từ khóa) *</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                    placeholder="Nhập tag và nhấn Enter"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                  <Button type="button" onClick={handleAddTag} variant="outline" className="border-white/20 bg-white/10 text-white">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-emerald-600/30 text-white rounded-full text-sm flex items-center gap-2">
                      {tag} 
                      <button type="button" onClick={() => handleRemoveTag(tag)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Milestones */}
              <div>
                <div className="flex items-center justify-between mb-3 mt-2">
                  <Label className="text-white">Mục tiêu / Milestones</Label>
                  <Button
                    type="button"
                    onClick={handleAddMilestone}
                    variant="outline"
                    size="sm"
                    className="border-white/20 bg-white/10 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm mục tiêu
                  </Button>
                </div>
                <div className="space-y-4 mt-4 mb-4">
                  {milestones.map((m, idx) => (
                    <div key={idx} className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-3">
                      <div className="flex justify-between mb-2">
                        <span className="text-white/70 text-sm">Mục tiêu {idx + 1}</span>
                        {milestones.length > 1 && (
                          <button type="button" className="text-red-400 hover:text-red-300" onClick={() => handleRemoveMilestone(idx)}>
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <Input 
                        placeholder="Tiêu đề mục tiêu" 
                        className="bg-white/10 border-white/20 text-white" 
                        value={m.title} 
                        onChange={(e) => handleMilestoneChange(idx, 'title', e.target.value)}
                      />
                      <Input 
                        placeholder="Số tiền cần thiết" 
                        type="number" 
                        className="bg-white/10 border-white/20 text-white" 
                        value={m.amount} 
                        onChange={(e) => handleMilestoneChange(idx, 'amount', e.target.value)}
                      />
                      <Textarea 
                        placeholder="Mô tả chi tiết" 
                        rows={2}
                        className="bg-white/10 border-white/20 text-white" 
                        value={m.description} 
                        onChange={(e) => handleMilestoneChange(idx, 'description', e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <div className="w-fit mx-auto flex-1">
                    <Button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-6"
                    >
                        {loading ? 'Đang xử lý...' : 'Gửi duyệt dự án'}
                    </Button>
                </div>
                <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => onNavigate('startup-dashboard')} 
                    className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
                >
                    Hủy
                </Button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}