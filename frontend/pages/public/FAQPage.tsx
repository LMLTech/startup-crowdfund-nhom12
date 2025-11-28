import { HelpCircle, Users, Rocket, Shield, DollarSign } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";

export default function FAQPage({ currentUser, onNavigate, onLogout }) {
  const faqCategories = [
    {
      title: "Câu hỏi chung",
      icon: HelpCircle,
      color: "purple",
      faqs: [
        {
          question: "TreFund là gì?",
          answer:
            "TreFund là nền tảng gọi vốn cộng đồng (crowdfunding) hàng đầu tại Việt Nam, kết nối các nhà đầu tư với các Startup tiềm năng. Chúng tôi cung cấp môi trường minh bạch, an toàn để các dự án khởi nghiệp có thể huy động vốn từ cộng đồng.",
        },
        {
          question: "TreFund hoạt động như thế nào?",
          answer:
            "Startup đăng ký và tạo dự án trên nền tảng. Hội đồng CVA thẩm định và phê duyệt dự án. Sau khi được duyệt, dự án sẽ được công khai trên trang Khám phá để nhà đầu tư có thể xem và đầu tư. Tất cả giao dịch được xử lý an toàn qua VNPay.",
        },
        {
          question: "Tôi có thể tin tưởng vào các dự án trên TreFund không?",
          answer:
            "Tất cả các dự án trên TreFund đều được Hội đồng CVA (Community Validation Authority) thẩm định kỹ lưỡng về tính khả thi, tiềm năng và tính minh bạch trước khi được công khai. Tuy nhiên, đầu tư luôn có rủi ro và bạn nên nghiên cứu kỹ trước khi quyết định.",
        },
        {
          question: "TreFund có thu phí không?",
          answer:
            "TreFund thu phí 5% từ tổng số vốn huy động được của dự án thành công. Nhà đầu tư không phải trả bất kỳ khoản phí nào. Phí thanh toán VNPay sẽ được áp dụng theo chính sách của nhà cung cấp.",
        },
      ],
    },
    {
      title: "Dành cho Nhà đầu tư",
      icon: Users,
      color: "pink",
      faqs: [
        {
          question: "Làm thế nào để bắt đầu đầu tư?",
          answer:
            'Đăng ký tài khoản với vai trò Nhà đầu tư. Xác thực email và hoàn thiện hồ sơ cá nhân. Khám phá các dự án đã được duyệt. Chọn dự án bạn quan tâm và nhấn "Đầu tư ngay". Nhập số tiền và hoàn tất thanh toán qua VNPay.',
        },
        {
          question: "Số tiền đầu tư tối thiểu là bao nhiêu?",
          answer:
            "Mức đầu tư tối thiểu là 1.000.000 VNĐ cho mỗi dự án. Bạn có thể đầu tư vào nhiều dự án khác nhau để đa dạng hóa danh mục đầu tư của mình.",
        },
        {
          question: "Tôi có thể rút lại khoản đầu tư không?",
          answer:
            "Sau khi hoàn tất thanh toán, khoản đầu tư sẽ được chuyển cho dự án và không thể hoàn lại. Vui lòng cân nhắc kỹ trước khi đầu tư. Bạn có thể xem lịch sử giao dịch tại Dashboard của mình.",
        },
        {
          question: "Tôi sẽ nhận được lợi nhuận như thế nào?",
          answer:
            "Hình thức lợi nhuận phụ thuộc vào từng dự án: cổ phiếu (equity), trái phiếu chuyển đổi, hoặc chia sẻ doanh thu. Thông tin chi tiết sẽ được ghi rõ trong mô tả dự án. Startup sẽ liên hệ trực tiếp với nhà đầu tư sau khi chiến dịch thành công.",
        },
        {
          question: "Làm sao để theo dõi dự án tôi đã đầu tư?",
          answer:
            'Bạn có thể xem tất cả các dự án đã đầu tư tại mục "Lịch sử đầu tư" trong Dashboard. Startup sẽ cập nhật tiến độ định kỳ và gửi thông báo qua email cho các nhà đầu tư.',
        },
      ],
    },
    {
      title: "Dành cho Startup",
      icon: Rocket,
      color: "blue",
      faqs: [
        {
          question: "Startup của tôi có đủ điều kiện gọi vốn không?",
          answer:
            "Startup cần: Là doanh nghiệp đã đăng ký hợp pháp tại Việt Nam. Có sản phẩm/dịch vụ rõ ràng và kế hoạch kinh doanh khả thi. Có đội ngũ sáng lập cam kết lâu dài. Minh bạch về tài chính và pháp lý. Không vi phạm pháp luật Việt Nam.",
        },
        {
          question: "Quy trình tạo dự án như thế nào?",
          answer:
            "Đăng ký tài khoản Startup. Điền đầy đủ thông tin dự án: mô tả, mục tiêu vốn, kế hoạch sử dụng, đội ngũ, v.v. Tải lên tài liệu chứng minh: giấy phép kinh doanh, kế hoạch tài chính, v.v. Gửi đến Hội đồng CVA thẩm định (thời gian 7-14 ngày). Sau khi được duyệt, dự án sẽ tự động xuất hiện trên trang Khám phá.",
        },
        {
          question: "Mất bao lâu để dự án được duyệt?",
          answer:
            "Thông thường mất 7-14 ngày làm việc để Hội đồng CVA thẩm định dự án. Thời gian có thể kéo dài nếu cần bổ sung thêm tài liệu. Bạn sẽ nhận được email thông báo kết quả cùng với phản hồi chi tiết.",
        },
        {
          question: "Tôi có thể chỉnh sửa dự án sau khi gửi không?",
          answer:
            "Trước khi được duyệt: Bạn có thể chỉnh sửa tự do. Sau khi được duyệt: Chỉ được cập nhật tiến độ và tin tức. Không được thay đổi thông tin cốt lõi như mục tiêu vốn, mô tả dự án. Nếu cần thay đổi lớn, vui lòng liên hệ Admin.",
        },
        {
          question: "Nếu dự án không đạt mục tiêu vốn thì sao?",
          answer:
            'TreFund áp dụng mô hình "All or Nothing". Nếu dự án không đạt ít nhất 80% mục tiêu vốn khi hết hạn, toàn bộ số tiền sẽ được hoàn lại cho nhà đầu tư. Dự án cần đạt tối thiểu 80% mới được nhận vốn.',
        },
      ],
    },
    {
      title: "Thanh toán & Bảo mật",
      icon: Shield,
      color: "green",
      faqs: [
        {
          question: "Các phương thức thanh toán nào được hỗ trợ?",
          answer:
            "TreFund sử dụng VNPay - cổng thanh toán hàng đầu Việt Nam. Bạn có thể thanh toán qua: Thẻ ATM nội địa, Thẻ tín dụng/ghi nợ quốc tế (Visa, Mastercard), Ví điện tử (VNPay, MoMo, ZaloPay), Internet Banking.",
        },
        {
          question: "Thông tin thanh toán của tôi có an toàn không?",
          answer:
            "TreFund không lưu trữ bất kỳ thông tin thẻ thanh toán nào. Tất cả giao dịch được xử lý trực tiếp qua VNPay với chuẩn bảo mật PCI DSS. Mọi dữ liệu cá nhân được mã hóa SSL/TLS. Chúng tôi cam kết bảo vệ quyền riêng tư theo Luật An toàn thông tin mạng Việt Nam.",
        },
        {
          question: "Tôi sẽ nhận hóa đơn/chứng từ không?",
          answer:
            "Sau mỗi giao dịch thành công, bạn sẽ nhận được: Email xác nhận từ TreFund, Biên lai thanh toán từ VNPay, Giấy xác nhận đầu tư (được gửi sau khi chiến dịch kết thúc).",
        },
        {
          question: "Làm gì nếu giao dịch bị lỗi?",
          answer:
            "Nếu tiền đã bị trừ nhưng đầu tư chưa được ghi nhận: Giữ lại mã giao dịch từ VNPay, Liên hệ bộ phận hỗ trợ qua support@trefund.vn hoặc hotline 1900-xxxx, Cung cấp thông tin: email đăng ký, mã giao dịch, số tiền. Chúng tôi sẽ xử lý trong vòng 24 giờ làm việc.",
        },
      ],
    },
    {
      title: "Chính sách & Hỗ trợ",
      icon: DollarSign,
      color: "yellow",
      faqs: [
        {
          question: "Tôi có thể liên hệ hỗ trợ bằng cách nào?",
          answer:
            "Email: support@trefund.vn (phản hồi trong 24h), Hotline: 1900-xxxx (8h-20h hàng ngày), Form liên hệ: Truy cập trang Liên hệ, Chat trực tiếp: Có trên website (9h-18h T2-T6).",
        },
        {
          question: "TreFund có ứng dụng mobile không?",
          answer:
            "Hiện tại TreFund chỉ có phiên bản web responsive, tương thích tốt với mọi thiết bị. Ứng dụng mobile iOS và Android đang trong quá trình phát triển và dự kiến ra mắt trong Q2/2025.",
        },
        {
          question: "Làm sao để cập nhật thông tin tài khoản?",
          answer:
            'Đăng nhập vào tài khoản, Nhấn vào tên người dùng góc phải trên, Chọn "Cài đặt tài khoản", Cập nhật thông tin cần thiết, Lưu thay đổi. Lưu ý: Email đăng ký không thể thay đổi. Nếu cần đổi email, vui lòng liên hệ Admin.',
        },
        {
          question: "Chính sách bảo mật thông tin như thế nào?",
          answer:
            "TreFund tuân thủ nghiêm ngặt Luật An toàn thông tin mạng và Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân. Chúng tôi: Không chia sẻ thông tin cá nhân cho bên thứ ba, Mã hóa tất cả dữ liệu nhạy cảm, Cho phép người dùng xóa tài khoản và dữ liệu bất kỳ lúc nào, Thực hiện kiểm tra bảo mật định kỳ.",
        },
      ],
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
      <div className="pt-4 pb-12 px-10 mt-4">
        <div className="container mx-auto text-center">
          <h1 className="text-xl md:text-7xl text-white mb-4 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent animate-pulse font-semibold ">
            Các Câu Hỏi Thường Gặp
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-4">
            Tìm câu trả lời cho các câu hỏi phổ biến về TreFund
          </p>
        </div>
      </div>

      {/* FAQ Sections */}
      <div className="w-3/4 px-10 mx-auto pb-20 flex-1 mt-4 ">
        <div className="container mx-auto max-w-4xl space-y-8">
          {faqCategories.map((category, categoryIndex) => {
            const Icon = category.icon;
            return (
              <div
                key={categoryIndex}
                className="bg-white/10 backdrop-blur-xl rounded-xl p-8 border border-white/20 mt-4"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-3 bg-${category.color}-500/20 rounded-xl`}>
                    <Icon className={`w-6 h-6 text-${category.color}-400`} />
                  </div>
                  <h2 className="text-2xl text-white">{category.title}</h2>
                </div>

                <Accordion type="single" collapsible className="space-y-4">
                  {category.faqs.map((faq, faqIndex) => (
                    <AccordionItem
                      key={faqIndex}
                      value={`item-${categoryIndex}-${faqIndex}`}
                      className="border border-white/20 rounded-lg px-6 bg-white/5"
                    >
                      <AccordionTrigger className="text-white hover:text-green-400 text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-white/80 whitespace-pre-line">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            );
          })}

          {/* Contact CTA */}
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-xl p-6 border border-white/20 text-center mt-4">
            <h3 className="text-2xl text-white mb-4">
              Không tìm thấy câu trả lời?
            </h3>
            <p className="text-white/80 mb-4 mb-6">
              Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn
            </p>
            <button
              onClick={() => onNavigate("contact")}
              className="px-4 py-2 mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all "
            >
              Liên hệ với chúng tôi
            </button>
          </div>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
