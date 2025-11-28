export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-pink-700 flex items-center justify-center">
      <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-16 text-center">
        <h1 className="text-6xl font-bold text-white mb-8">THẤT BẠI</h1>
        <p className="text-3xl text-white mb-10">Thanh toán không thành công</p>
        <button onClick={() => window.location.href = '/'} 
                className="px-12 py-6 bg-white text-red-600 text-2xl font-bold rounded-2xl hover:bg-red-50">
          Thử lại
        </button>
      </div>
    </div>
  );
}