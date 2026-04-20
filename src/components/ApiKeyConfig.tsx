import React from 'react';
import { useForm } from 'react-hook-form';
import { Key, Info } from 'lucide-react';

interface ApiKeyConfigProps {
  currentKey: string;
  onSave: (key: string) => void;
}

export default function ApiKeyConfig({ currentKey, onSave }: ApiKeyConfigProps) {
  const { register, handleSubmit } = useForm({
    defaultValues: { apiKey: currentKey }
  });

  const onSubmit = (data: { apiKey: string }) => {
    onSave(data.apiKey);
  };

  return (
    <div className="w-full max-w-xl p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
          <Key className="text-amber-500 w-6 h-6" />
        </div>
        <div>
          <h3 className="font-display font-black uppercase text-lg tracking-tight">Cấu hình Google Studio API</h3>
          <p className="text-gray-500 text-xs mt-0.5">Dành cho học viên tự sử dụng API cá nhân</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">API Key của bạn</label>
          <input
            {...register('apiKey')}
            type="password"
            placeholder="Nhập API Key tại đây..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none font-mono text-sm transition-all"
          />
        </div>

        <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl flex gap-3">
          <Info className="w-5 h-5 text-amber-500 shrink-0" />
          <p className="text-xs text-amber-900 leading-relaxed">
            API Key này chỉ được lưu trữ trên thiết bị của bạn hoặc tài khoản bảo mật của bạn. 
            Nó dùng để xử lý các logic AI trong ứng dụng.
          </p>
        </div>

        <button 
          type="submit"
          className="w-full py-4 bg-secondary text-white font-bold rounded-xl hover:bg-secondary/90 transition-all shadow-md active:scale-[0.98]"
        >
          Lưu Cấu Hình
        </button>
      </form>
    </div>
  );
}
