export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-teal-700 flex items-center justify-center">
      <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-16 text-center">
        <h1 className="text-6xl font-bold text-white mb mapped-8">THÀNH CÔNG!</h1>
        <p className="text-3xl text-white">Bạn đã đầu tư thành công vào dự án!</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="mt-10 px-12 py-6 bg-white text-green-600 text-2xl font-bold rounded-2xl hover:bg-green-50"
        >
          Quay về trang chủ
        </button>
      </div>
    </div>
  );
}