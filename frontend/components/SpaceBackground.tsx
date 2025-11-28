import React from 'react';

// Import video từ đường dẫn bạn cung cấp
// Lưu ý: Dấu .. để lùi ra khỏi thư mục components, sau đó vào assets/video
import videoBg from '../assets/video/video_background.mp4';

export default function SpaceBackground() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden bg-[#020817]">
      
      {/* 1. Lớp phủ tối (Overlay) 
          Giúp video tối xuống một chút để chữ trắng bên trên dễ đọc hơn.
          Bạn có thể chỉnh opacity-40 thành 30 hoặc 50 tùy video sáng hay tối.
      */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* 2. Video Player */}
      <video
        autoPlay
        loop
        muted       // Bắt buộc muted để tự chạy
        playsInline // Hỗ trợ mobile
        className="w-full h-full object-cover" // object-cover giúp video full màn hình không bị méo
      >
        <source src={videoBg} type="video/mp4" />
        Trình duyệt của bạn không hỗ trợ thẻ video.
      </video>
    </div>
  );
}