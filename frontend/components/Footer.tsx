import React from 'react';
import { Rocket, Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';

// 1. Interface từ File 1 (Để code chặt chẽ)
interface FooterProps {
  onNavigate: (path: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  // --- GIAO DIỆN (UI TỪ FILE 2) ---
  return (
    <footer className="relative bg-black/40 backdrop-blur-xl border-t border-white/10 mt-20 px-10">
      {/* Layout w-4/5 từ File 2 */}
      <div className="w-4/5 mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Brand & Description */}
          <div className="space-y-4">
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => onNavigate("home")}
            >
              {/* SỬ DỤNG ẢNH TỪ ASSETS NHƯ YÊU CẦU */}
              <img
                src="/assets/logo.png"
                alt="TreFund Logo"
                className="h-20 w-auto group-hover:scale-110 transition-transform -mt-7"
              />
            </div>
            <p className="text-white/70 text-sm font-semibold">
              Nền tảng gọi vốn cộng đồng hàng đầu Việt Nam, kết nối nhà đầu tư
              với các Startup tiềm năng.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white mb-4 font-semibold">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate("home")}
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  Trang chủ
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("explore")}
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  Khám phá dự án
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("about")}
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  Giới thiệu
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("blog")}
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  Blog
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white mb-4 font-semibold">Hỗ trợ</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate("faq")}
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  Câu hỏi thường gặp
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("contact")}
                  className="text-white/70 hover:text-white transition-colors text-sm"
                >
                  Liên hệ
                </button>
              </li>
              <li>
                <button className="text-white/70 hover:text-white transition-colors text-sm">
                  Điều khoản sử dụng
                </button>
              </li>
              <li>
                <button className="text-white/70 hover:text-white transition-colors text-sm font-semibold">
                  Chính sách bảo mật
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info - Dữ liệu từ File 1, Style File 2 */}
          <div>
            <h3 className="text-white mb-4 font-semibold">Thông tin liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-white/70 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-2 text-white/70 text-sm">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a
                  href="tel:+84123456789"
                  className="hover:text-white transition-colors"
                >
                  +84 123 456 789
                </a>
              </li>
              <li className="flex items-center gap-2 text-white/70 text-sm">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a
                  href="mailto:nhom12@trefund.vn"
                  className="hover:text-white transition-colors"
                >
                  nhom12@trefund.vn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">
              © {currentYear} TreFund. All rights reserved.
            </p>
            <p className="text-white/60 text-sm">
              Được xây dựng bởi Nhóm 12 ❤️
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}