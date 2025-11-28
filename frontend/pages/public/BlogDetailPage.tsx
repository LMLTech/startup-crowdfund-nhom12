import { ArrowLeft, Calendar, User, Tag, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';

// Định nghĩa type cho bài viết blog
interface BlogPost {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  authorBio?: string;
  publishedAt: string | Date;
  readTime: number;
  image: string;
  tags: string[];
}

// Định nghĩa props của page
interface BlogDetailPageProps {
  post: BlogPost | null;
  currentUser: any;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

export default function BlogDetailPage({ post, currentUser, onNavigate, onLogout }: BlogDetailPageProps) {
  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl">Không tìm thấy bài viết</p>
          <Button onClick={() => onNavigate('blog')} className="mt-4">
            Quay về Blog
          </Button>
        </div>
      </div>
    );
  }

  // Fix lỗi: thêm type cho platform
  const handleShare = (platform: 'Facebook' | 'Twitter' | 'LinkedIn') => {
    toast.success(`Đã sao chép link chia sẻ lên ${platform}!`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentUser={currentUser} onNavigate={onNavigate} onLogout={onLogout} />

      <div className="pt-24 pb-20 px-4 flex-1">
        <div className="container mx-auto max-w-4xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => onNavigate('blog')}
            className="mb-6 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại Blog
          </Button>

          {/* Article Header */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 mb-8">
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50 mb-4">
              {post.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl text-white mb-6">
              {post.title}
            </h1>
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-white/60 mb-6 pb-6 border-b border-white/20">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{new Date(post.publishedAt).toLocaleDateString('vi-VN', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>{post.readTime} phút đọc</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="outline" className="border-white/20 text-white/70">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Content */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 mb-8">
            <div className="prose prose-invert max-w-none">
              <p className="text-xl text-white/90 mb-6 leading-relaxed">
                {post.excerpt}
              </p>
              
              <div className="text-white/80 space-y-4 leading-relaxed">
                {post.content.split('\n\n').map((paragraph: string, index: number) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Share Section */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <Share2 className="w-5 h-5" />
                <span>Chia sẻ bài viết</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleShare('Facebook')}
                  className="p-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg transition-colors"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="w-5 h-5 text-blue-400" />
                </button>
                <button
                  onClick={() => handleShare('Twitter')}
                  className="p-2 bg-sky-500/20 hover:bg-sky-500/30 rounded-lg transition-colors"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="w-5 h-5 text-sky-400" />
                </button>
                <button
                  onClick={() => handleShare('LinkedIn')}
                  className="p-2 bg-blue-700/20 hover:bg-blue-700/30 rounded-lg transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="w-5 h-5 text-blue-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Author Info */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl text-white mb-4">Về tác giả</h3>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h4 className="text-xl text-white mb-2">{post.author}</h4>
                <p className="text-white/70">
                  {post.authorBio || 'Thành viên của đội ngũ StarFund, chia sẻ kiến thức và kinh nghiệm về startup và đầu tư.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}