import {
  Target,
  Eye,
  Heart,
  Award,
  Users,
  TrendingUp,
  Rocket,
  Shield,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Button } from "../../components/ui/button";

export default function AboutPage({ currentUser, onNavigate, onLogout }) {
  const stats = [
    { label: "Dự án thành công", value: "100+", icon: Rocket },
    { label: "Nhà đầu tư", value: "5000+", icon: Users },
    { label: "Vốn huy động", value: "50 tỷ+", icon: TrendingUp },
    { label: "Tỷ lệ thành công", value: "85%", icon: Award },
  ];

  const values = [
    {
      icon: Shield,
      title: "Minh bạch",
      description:
        "Mọi thông tin dự án được công khai rõ ràng. Quy trình thẩm định nghiêm ngặt bởi Hội đồng CVA đảm bảo tính xác thực.",
      color: "purple",
    },
    {
      icon: Heart,
      title: "Cộng đồng",
      description:
        "Kết nối những người có chung đam mê khởi nghiệp và đầu tư. Xây dựng mạng lưới hỗ trợ lẫn nhau phát triển.",
      color: "green",
    },
    {
      icon: TrendingUp,
      title: "Phát triển bền vững",
      description:
        "Ưu tiên các dự án có tác động tích cực đến xã hội và môi trường. Hỗ trợ startup phát triển lâu dài.",
      color: "blue",
    },
    {
      icon: Award,
      title: "Chất lượng",
      description:
        "Cam kết chất lượng dịch vụ tốt nhất. Đội ngũ chuyên gia hỗ trợ 24/7 cho mọi thắc mắc.",
      color: "green",
    },
  ];

  const team = [
    {
      name: "Nguyễn Văn A",
      role: "CEO & Co-Founder",
      description:
        "10+ năm kinh nghiệm trong lĩnh vực đầu tư khởi nghiệp và fintech.",
    },
    {
      name: "Trần Thị B",
      role: "CTO & Co-Founder",
      description:
        "Chuyên gia công nghệ với nhiều dự án blockchain và nền tảng số thành công.",
    },
    {
      name: "Lê Văn C",
      role: "CFO",
      description:
        "Chuyên gia tài chính doanh nghiệp, từng làm việc tại các tập đoàn lớn.",
    },
    {
      name: "Phạm Thị D",
      role: "Head of Community",
      description:
        "Đam mê xây dựng cộng đồng và hỗ trợ các startup phát triển.",
    },
  ];

  const milestones = [
    {
      year: "2023",
      title: "Thành lập",
      description:
        "TreFund chính thức ra mắt với sứ mệnh kết nối startup và nhà đầu tư",
    },
    {
      year: "2023 ",
      title: "Dự án đầu tiên",
      description:
        "10 dự án đầu tiên được phê duyệt và huy động thành công 5 tỷ đồng",
    },
    {
      year: "2024 ",
      title: "Mở rộng",
      description: "Đạt 1000+ nhà đầu tư và 50+ dự án thành công",
    },
    {
      year: "2025 ",
      title: "Hiện tại",
      description: "5000+ nhà đầu tư, 100+ dự án, 50 tỷ vốn huy động",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        currentUser={currentUser}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      {/* Hero Section */}
      <div className="pt-4 mt-4 md:pt-32 mb-4 ">
        <div className="w-3/4 mx-auto px-10 ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-xl md:text-6xl text-white mb-6 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent text-center animate-pulse font-semibold ">
                Về TreFund
              </h1>
              <p className="text-lg text-white/80 mb-8 leading-relaxed px-10 mt-4">
                Nền tảng gọi vốn cộng đồng hàng đầu Việt Nam, nơi những ý tưởng
                tuyệt vời gặp gỡ những nhà đầu tư tiềm năng. Chúng tôi tin rằng
                mọi Startup đều xứng đáng có cơ hội biến ước mơ thành hiện thực.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-4 justify-center ">
                <Button
                  onClick={() => onNavigate("explore")}
                  className="bg-gradient-to-r from-green-600 p-2 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white  text-lg"
                >
                  Khám phá dự án
                </Button>
                <Button
                  onClick={() => onNavigate("contact")}
                  variant="outline"
                  className="border-white/20 bg-white/10 hover:bg-white/20 text-white p-2 text-lg"
                >
                  Liên hệ với chúng tôi
                </Button>
              </div>
            </div>
            <div className="flex gap-2 justify-center">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-xl
                     p-6 border border-white/20 text-center rounded-xl "
                  >
                    <Icon className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                    <div className="text-3xl text-white mb-1">{stat.value}</div>
                    <div className="text-white/70 text-sm">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className=" pb-20 mt-4 mb-4 w-3/4 mx-auto  px-10">
        <div className="container mx-auto ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-8 border border-white/20 ">
              <div className="p-1 bg-emerald-600/20 rounded-xl inline-block mb-4 ">
                <Target className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-xl text-white mb-4 font-bold ">Sứ mệnh</h2>
              <p className="text-white/80 text-lg leading-relaxed">
                Dân chủ hóa quyền tiếp cận vốn cho các startup Việt Nam, tạo cơ
                hội cho mọi người tham gia vào hành trình xây dựng những doanh
                nghiệp tương lai. Chúng tôi cam kết xây dựng một hệ sinh thái
                minh bạch, công bằng và bền vững.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-8 border border-white/20">
              <div className="p-3 bg-emerald-600/20 rounded-xl inline-block mb-4">
                <Eye className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-xl text-white mb-4">Tầm nhìn</h2>
              <p className="text-white/80 text-lg leading-relaxed">
                Trở thành nền tảng crowdfunding số 1 Đông Nam Á vào năm 2030, hỗ
                trợ hàng nghìn startup thành công và tạo ra hàng trăm nghìn việc
                làm. Chúng tôi hướng tới một tương lai nơi mọi ý tưởng tốt đều
                có cơ hội phát triển.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className=" pb-20 mb-4 mt-4 w-3/4 mx-auto px-10">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-xl text-white mt-4 mb-4">Giá trị cốt lõi</h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-4">
              Những nguyên tắc định hướng mọi hoạt động của chúng tôi
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4  ">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-gray-700/30 hover:border-emerald-400/50 transition-all group  "
                >
                  <div
                    className={` bg-${value.color}-500/20 rounded-xl inline-block  mb-2 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`w-8 h-8 text-${value.color}-400`} />
                  </div>
                  <h3 className="text-xl text-white mb-3">{value.title}</h3>
                  <p className="text-white/70">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="px-4 pb-20 mb-4 mt-4">
        <div className="w-3/4 mx-auto px-10">
          <div className="text-center mb-12">
            <h2 className="text-xl text-white mt-4 mb-4">
              Hành trình phát triển
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Từ những bước đi đầu tiên đến thành công hôm nay
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-6 items-center group">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br mt-2 from-green-500 to-emerald-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform font-semibold">
                      <span className="text-white">{milestone.year}</span>
                    </div>
                  </div>
                  <div
                    className="flex-1 
                  bg-white/10 backdrop-blur-xl rounded-xl p-2 border border-gray-700/30 group-hover:border-emerald-400/50 transition-all mt-2 h-64 w-70%"
                  >
                    <h3 className="text-2xl text-white mb-2 text-center font-semibold">
                      {milestone.title}
                    </h3>
                    <p className="text-white/70 text-center ">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className=" w-3/4 mx-auto pb-20 mt-4 px-10">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-xl text-white mt-4 mb-4">Đội ngũ lãnh đạo</h2>
            <p className="text-white/70 text-lg max-w-2xl mb-4">
              Những con người đam mê xây dựng cầu nối giữa startup và nhà đầu tư
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 text-center hover:border-green-400/50 transition-all group"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl text-white mb-1">{member.name}</h3>
                <p className="text-green-400 mb-3">{member.role}</p>
                <p className="text-white/70 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-3/4 mx-auto pb-20 mt-4 px-10">
        <div className="container mx-auto ">
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-xl p-12 border border-white/20 mt-4 text-center px-4">
            <h2 className="text-xl md:text-4xl text-white mt-4 mb-4">
              Sẵn sàng bắt đầu hành trình?
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto text-lg px-4">
              Tham gia cộng đồng StarFund ngay hôm nay để khám phá cơ hội đầu tư
              hoặc gọi vốn cho dự án của bạn
            </p>
            <div className="flex flex-col sm:flex-row gap-8 justify-center mb-4">
              <Button
                onClick={() => onNavigate("register")}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-lg"
              >
                Đăng ký ngay
              </Button>
              <Button
                onClick={() => onNavigate("explore")}
                variant="outline"
                className="border-white/20 bg-white/10 hover:bg-white/20 text-white  text-lg"
              >
                Khám phá dự án
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
