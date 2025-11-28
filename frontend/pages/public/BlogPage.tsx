import { useState } from "react";
import {
  BookOpen,
  Calendar,
  User,
  ArrowRight,
  Search,
  Tag,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { mockBlogPosts } from "../../utils/mockData";

export default function BlogPage({ currentUser, onNavigate, onLogout }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Get unique categories
  const categories = [
    "all",
    ...new Set(mockBlogPosts.map((post) => post.category)),
  ];

  // Filter posts
  const filteredPosts = mockBlogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Featured post (latest)
  const featuredPost = mockBlogPosts[0];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        currentUser={currentUser}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      {/* Hero Section */}
      <div className="pt-4 pb-12  mt-4 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-xl md:text-7xl text-white mb-4 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent animate-pulse font-semibold ">
            Blog StarFund
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-4">
            Tin tức, kiến thức và câu chuyện từ cộng đồng startup
          </p>
        </div>
      </div>

      {/* Featured Post */}
      {featuredPost && (
        <div className="w-3/4 mx-auto px-10 pb-12 mb-4">
          <div className="w-3/4 mx-auto">
            <div
              className="bg-white/10 backdrop-blur-xl rounded-xl overflow-hidden border border-gray-700/30 hover:border-emerald-400/50 transition-all cursor-pointer group"
              onClick={() => onNavigate("blog-detail", featuredPost)}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-80 lg:h-auto">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-emerald-600 text-white border-0">
                      Nổi bật
                    </Badge>
                  </div>
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/50 w-fit mb-4">
                    {featuredPost.category}
                  </Badge>
                  <h2 className="text-3xl md:text-4xl text-white mb-4 group-hover:text-green-400 transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-white/70 mb-6 text-lg">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-white/60 text-sm mb-6">
                    <div className="flex items-center gap-2 mt-2">
                      <User className="w-4 h-4" />
                      <span>{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 ">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(featuredPost.publishedAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    </div>
                  </div>
                  <button className="flex mt-4 items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors text-white/70">
                    Đọc tiếp
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="w-3/4 mx-auto pb-8 mt-4 mb-4 px-10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 " />

              <Input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-gray-700/30 text-white placeholder:text-white/50 focus:border-emerald-400"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <Badge
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`cursor-pointer transition-all ${
                    selectedCategory === cat
                      ? "bg-emerald-600 text-white border-0"
                      : "bg-white/10 text-white/70 border-white/20 hover:bg-white/20"
                  }`}
                >
                  {cat === "all" ? "Tất cả" : cat}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="w-3/4 mx-auto pb-20 flex-1 px-10">
        <div className="container mx-auto">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <p className="text-white/70 text-xl">
                Không tìm thấy bài viết phù hợp
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => onNavigate("blog-detail", post)}
                  className="bg-white/10 backdrop-blur-xl rounded-xl overflow-hidden border border-gray-700/30 hover:border-emerald-400/50 transition-all cursor-pointer group"
                >
                  <div className="relative h-48">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-4 left-4 bg-emerald-600/20 text-emerald-400 border-emerald-600/50">
                      {post.category}
                    </Badge>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl text-white mb-3 group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-white/70 mb-4 line-clamp-3 text-sm">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-white/60 text-sm mb-4">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(post.publishedAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="border-white/20 text-white/60 text-xs"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
