import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import LuckyWheel from './components/LuckyWheel';
import Payment from './components/Payment';
import ApiKeyConfig from './components/ApiKeyConfig';
import { User, LogOut, Coins, Settings, History, Sparkles, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AppUser {
  email: string;
  displayName: string;
  balance: number;
  apiKey: string;
}

import { generateLuckyMessage } from './services/aiService';

export default function App() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [activeTab, setActiveTab] = useState<'spin' | 'payment' | 'config' | 'history'>('spin');
  const [history, setHistory] = useState<any[]>([]);

  // Load user session from local storage for demo purposes
  useEffect(() => {
    const savedUser = localStorage.getItem('lucky_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    
    const savedHistory = localStorage.getItem('spin_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const handleAuthSuccess = (userData: any) => {
    const newUser = { ...userData, balance: 20000, apiKey: '' };
    setUser(newUser);
    localStorage.setItem('lucky_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('lucky_user');
  };

  const handleWin = async (reward: any) => {
    if (!user) return;
    
    const newHistory = [{ ...reward, date: new Date().toLocaleString() }, ...history].slice(0, 50);
    setHistory(newHistory);
    localStorage.setItem('spin_history', JSON.stringify(newHistory));

    if (reward.value > 0) {
      const updatedUser = { ...user, balance: user.balance + reward.value };
      setUser(updatedUser);
      localStorage.setItem('lucky_user', JSON.stringify(updatedUser));
      
      const aiMessage = await generateLuckyMessage(user.apiKey);
      alert(`${aiMessage}\n\nBạn nhận được: ${reward.label}`);
    } else {
      alert(`Hụt rồi! ${reward.label}`);
    }
  };


  const handlePaymentSuccess = () => {
    if (!user) return;
    const updatedUser = { ...user, balance: user.balance + 50000 };
    setUser(updatedUser);
    localStorage.setItem('lucky_user', JSON.stringify(updatedUser));
    setActiveTab('spin');
    alert("Nạp tiền thành công! Bạn có thêm 50.000đ");
  };

  const handleSaveApiKey = (apiKey: string) => {
    if (!user) return;
    const updatedUser = { ...user, apiKey };
    setUser(updatedUser);
    localStorage.setItem('lucky_user', JSON.stringify(updatedUser));
    alert("Cập nhật API Key thành công!");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary p-4 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="grid grid-cols-12 gap-4 h-full">
            {Array.from({ length: 48 }).map((_, i) => (
              <Sparkles key={i} className="w-12 h-12 text-white animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        </div>
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full flex justify-center"
        >
          <Auth onSuccess={handleAuthSuccess} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-80 bg-secondary md:h-screen flex flex-col border-r border-white/10 shrink-0">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <h1 className="font-display font-black uppercase text-2xl text-white italic tracking-tighter">Lucky Spin</h1>
          </div>

          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black">
              {user.displayName[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-white font-bold truncate text-sm">{user.displayName}</p>
              <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest flex items-center gap-1">
                <Coins className="w-3 h-3" /> {user.balance.toLocaleString()}đ
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 flex flex-col gap-2">
          {[
            { id: 'spin', label: 'Vòng Quay', icon: Trophy },
            { id: 'payment', label: 'Nạp Tiền', icon: CreditCardCustom },
            { id: 'history', label: 'Lịch Sử', icon: History },
            { id: 'config', label: 'Cài Đặt AI', icon: Settings },
          ].map((item: any) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full p-4 rounded-xl flex items-center gap-4 font-bold transition-all
                ${activeTab === item.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
            >
              <item.icon className="w-5 h-5 text-current" />
              {item.label}
            </button>
          ))}
        </div>

        <div className="p-4 mt-auto border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full p-4 text-white/40 hover:text-red-400 font-bold flex items-center gap-4 transition-colors"
          >
            <LogOut className="w-5 h-5" /> Đăng Xuất
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto bg-[#f5f5f0] p-6 md:p-12">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-display font-black uppercase italic tracking-tighter text-secondary">
              {activeTab === 'spin' && 'Thử Thách Vận May'}
              {activeTab === 'payment' && 'Nạp Lượt Quay'}
              {activeTab === 'history' && 'Lịch Sử Trúng Thưởng'}
              {activeTab === 'config' && 'Cấu Hình API AI'}
            </h2>
            <div className="h-1 w-20 bg-primary mt-2" />
          </div>
          
          <div className="hidden md:flex items-center gap-6">
             <div className="text-right">
                <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Số dư khả dụng</p>
                <p className="text-2xl font-display font-black text-secondary">{user.balance.toLocaleString()}đ</p>
             </div>
             <button 
                onClick={() => setActiveTab('payment')}
                className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center hover:border-primary transition-all shadow-sm"
              >
                <Coins className="text-primary w-6 h-6" />
             </button>
          </div>
        </header>

        <div className="max-w-5xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'spin' && (
                <div className="flex flex-col lg:flex-row gap-12 items-center">
                  <LuckyWheel onWin={handleWin} />
                  <div className="flex-1 space-y-6">
                    <div className="p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
                      <h3 className="text-xl font-display font-black uppercase italic mb-4">Mẹo lượm tiền</h3>
                      <ul className="space-y-3 text-sm text-gray-600 font-medium">
                        <li className="flex gap-2">🔥 <span className="opacity-80">Quay vào ô 1.000.000đ để đổi đời.</span></li>
                        <li className="flex gap-2">⚡ <span className="opacity-80">Mỗi lượt quay tốn 10.000đ tiền mặt.</span></li>
                        <li className="flex gap-2">💎 <span className="opacity-80">Càng quay nhiều, tỉ lệ nổ hũ càng cao.</span></li>
                      </ul>
                    </div>
                    <div className="p-8 bg-secondary rounded-3xl shadow-xl text-white">
                      <p className="text-[10px] uppercase font-black text-white/40 tracking-widest mb-1">Tin tức</p>
                      <p className="text-sm italic">"Người dùng <span className="text-primary font-bold">An Nguyen</span> vừa trúng <span className="text-primary font-bold">500.000đ</span>!"</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'payment' && (
                <div className="flex justify-center">
                  <Payment amount={50000} userEmail={user.email} onSuccess={handlePaymentSuccess} />
                </div>
              )}

              {activeTab === 'config' && (
                <div className="flex justify-center">
                  <ApiKeyConfig currentKey={user.apiKey} onSave={handleSaveApiKey} />
                </div>
              )}

              {activeTab === 'history' && (
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="p-6 text-xs font-black uppercase text-gray-400 tracking-widest italic">Thời gian</th>
                        <th className="p-6 text-xs font-black uppercase text-gray-400 tracking-widest italic">Phần quà</th>
                        <th className="p-6 text-xs font-black uppercase text-gray-400 tracking-widest italic">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {history.length > 0 ? history.map((item, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-6 text-sm text-gray-500 font-medium">{item.date}</td>
                          <td className="p-6 font-bold text-secondary">
                            {item.label}
                          </td>
                          <td className="p-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                              ${item.value > 0 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                              {item.value > 0 ? 'Đã nhận' : 'Hụt'}
                            </span>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={3} className="p-12 text-center text-gray-400 italic">Chưa có lịch sử quay</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// Custom icon component for Payment since Lucide doesn't have a direct "CreditCardCustom"
function CreditCardCustom(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}
