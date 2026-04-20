import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { LogIn, UserPlus, Mail, Lock, User as UserIcon } from 'lucide-react';

const authSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải từ 6 ký tự'),
  displayName: z.string().optional(),
});

type AuthFormData = z.infer<typeof authSchema>;

interface AuthProps {
  onSuccess: (user: any) => void;
}

export default function Auth({ onSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (data: AuthFormData) => {
    setLoading(true);
    setError(null);
    try {
      // Logic would normally go here once Firebase is active
      // For now, simulated success if Firebase not ready
      console.log("Auth attempt:", isLogin ? "Login" : "Register", data);
      
      // Simulated delay
      await new Promise(r => setTimeout(r, 1000));
      
      onSuccess({ email: data.email, displayName: data.displayName || data.email.split('@')[0] });
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-2xl border border-gray-100">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
          {isLogin ? <LogIn className="text-primary w-8 h-8" /> : <UserPlus className="text-primary w-8 h-8" />}
        </div>
        <h2 className="text-2xl font-black font-display uppercase tracking-tight text-secondary">
          {isLogin ? 'Chào mừng quay trở lại' : 'Đăng ký thành viên'}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {isLogin ? 'Đăng nhập để bắt đầu vận may' : 'Tạo tài khoản mới để nhận quà'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {!isLogin && (
          <div className="relative">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              {...register('displayName')}
              placeholder="Tên hiển thị"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>
        )}

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            {...register('email')}
            type="email"
            placeholder="Địa chỉ Email"
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1 ml-4">{errors.email.message}</p>}
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            {...register('password')}
            type="password"
            placeholder="Mật khẩu"
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1 ml-4">{errors.password.message}</p>}
        </div>

        {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? 'Đang xử lý...' : (isLogin ? 'Đăng Nhập' : 'Đăng Ký Ngay')}
        </button>
      </form>

      <div className="mt-8 text-center pt-6 border-t border-gray-100">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-primary font-semibold hover:underline text-sm"
        >
          {isLogin ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
        </button>
      </div>
    </div>
  );
}
