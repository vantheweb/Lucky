import React from 'react';
import { CreditCard, QrCode, CheckCircle2 } from 'lucide-react';

interface PaymentProps {
  amount: number;
  userEmail: string;
  onSuccess: () => void;
}

export default function Payment({ amount, userEmail, onSuccess }: PaymentProps) {
  // In a real app, you'd generate a QR code for SePay
  // using their API: https://api.sepay.vn/qr?account=...&amount=...
  
  const paymentContent = `Nội dung chuyển khoản (SePay): SPIN ${userEmail.split('@')[0].toUpperCase()}`;

  return (
    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden">
      <div className="bg-primary p-6 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CreditCard className="w-8 h-8" />
          <div>
            <h3 className="font-display font-black uppercase text-xl italic">Thanh toán tự động</h3>
            <p className="text-white/80 text-sm opacity-80">Nạp lượt quay qua SePay</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase opacity-70">Số tiền cần nạp</p>
          <p className="text-2xl font-black font-display tracking-tight">{amount.toLocaleString()}đ</p>
        </div>
      </div>

      <div className="p-8 grid md:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-white border-2 border-primary/20 rounded-2xl shadow-inner group transition-all hover:border-primary/50">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=STT:${paymentContent}`} 
              alt="QR Payment"
              className="w-48 h-48 opacity-90 group-hover:opacity-100"
              referrerPolicy="no-referrer"
            />
          </div>
          <p className="text-xs text-gray-400 text-center uppercase tracking-widest font-semibold flex items-center gap-2">
            <QrCode className="w-3 h-3" /> Quét mã để thanh toán
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">Hướng dẫn</label>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-600 leading-relaxed italic">
              Vui lòng chuyển khoản chính xác số tiền và nội dung bên dưới để hệ thống tự động cộng lượt quay.
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">Nội dung chuyển khoản</label>
            <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/10 rounded-xl">
              <code className="text-primary font-bold text-lg">{paymentContent}</code>
              <button 
                onClick={() => navigator.clipboard.writeText(paymentContent)}
                className="text-xs text-primary font-bold hover:underline"
              >
                Sao chép
              </button>
            </div>
          </div>

          <div className="pt-4">
            <button 
              onClick={onSuccess}
              className="w-full py-4 bg-secondary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all shadow-lg"
            >
              <CheckCircle2 className="w-5 h-5" /> Tôi đã chuyển khoản
            </button>
            <p className="text-[10px] text-gray-400 mt-4 text-center">
              * Hệ thống SePay sẽ tự động xử lý trong 30s - 2 phút.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
