import { motion } from "motion/react";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";

interface Reward {
  label: string;
  value: number;
  color: string;
}

const REWARDS: Reward[] = [
  { label: "500.000đ", value: 500000, color: "#FF6321" },
  { label: "Chúc bạn may mắn", value: 0, color: "#1a1a1a" },
  { label: "100.000đ", value: 100000, color: "#FF6321" },
  { label: "50.000đ", value: 50000, color: "#1a1a1a" },
  { label: "20.000đ", value: 20000, color: "#FF6321" },
  { label: "10.000đ", value: 10000, color: "#1a1a1a" },
  { label: "Chúc bạn may mắn", value: 0, color: "#FF6321" },
  { label: "200.000đ", value: 200000, color: "#1a1a1a" },
  { label: "1.000.000đ", value: 1000000, color: "#FFD700" }, // Special color for jackpot
  { label: "Chúc bạn may mắn", value: 0, color: "#1a1a1a" },
];

export default function LuckyWheel({ onWin }: { onWin: (reward: Reward) => void }) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const spin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    const stopAt = Math.floor(Math.random() * 360);
    const fullSpins = 5 + Math.floor(Math.random() * 5);
    const totalRotation = rotation + (fullSpins * 360) + stopAt;
    
    setRotation(totalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      // Calculate reward based on rotation
      const actualRotation = (360 - (totalRotation % 360)) % 360;
      const degPerReward = 360 / REWARDS.length;
      const rewardIndex = Math.floor(actualRotation / degPerReward);
      const reward = REWARDS[rewardIndex];
      
      if (reward.value > 0) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      onWin(reward);
    }, 4100);
  };

  return (
    <div className="flex flex-col items-center gap-8 py-12">
      <div className="relative w-80 h-80 md:w-96 md:h-96">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20 w-8 h-12 bg-white rounded-t-full shadow-lg flex items-center justify-center">
          <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-primary" />
        </div>

        {/* Wheel */}
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 4, ease: [0.15, 0, 0.15, 1] }}
          className="w-full h-full rounded-full border-8 border-white shadow-2xl overflow-hidden relative bg-white"
        >
          {REWARDS.map((reward, i) => {
            const angle = 360 / REWARDS.length;
            const rotation = angle * i;
            return (
              <div
                key={i}
                className="absolute top-0 left-1/2 h-1/2 w-1 origin-bottom"
                style={{
                  transform: `translateX(-50%) rotate(${rotation}deg)`,
                }}
              >
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] origin-bottom px-2 pt-8 text-center text-white font-bold text-xs md:text-sm whitespace-nowrap"
                  style={{
                    backgroundColor: reward.color,
                    clipPath: `polygon(50% 100%, ${50 - Math.tan((angle / 2) * (Math.PI / 180)) * 100}% 0%, ${50 + Math.tan((angle / 2) * (Math.PI / 180)) * 100}% 0%)`,
                    transform: `translateX(-50%)`,
                  }}
                >
                  <span className="inline-block transform -rotate-0 mt-4 h-full">
                    {reward.label}
                  </span>
                </div>
              </div>
            );
          })}
          {/* Inner circle */}
          <div className="absolute inset-0 m-auto w-12 h-12 bg-white rounded-full shadow-inner z-10 flex items-center justify-center border-4 border-primary">
             <div className="w-4 h-4 bg-primary rounded-full animate-pulse" />
          </div>
        </motion.div>
      </div>

      <button
        onClick={spin}
        disabled={isSpinning}
        className={`px-12 py-4 rounded-full font-display text-2xl font-black uppercase tracking-widest shadow-xl transition-all
          ${isSpinning ? 'bg-gray-400 cursor-not-allowed opacity-50' : 'bg-primary text-white hover:scale-105 active:scale-95'}`}
      >
        {isSpinning ? 'Đang quay...' : 'Quay Ngay!'}
      </button>
    </div>
  );
}
