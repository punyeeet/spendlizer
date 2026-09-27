'use client';
import dynamic from 'next/dynamic';
import React from 'react';
import loadingAnimation from '@/assets/animation-loading.json';

const DynamicPlayer = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player),
  { ssr: false }
);

interface LottieLoaderProps {
  className?: string;
  autoplay?: boolean;
  loop?: boolean;
}

export const LottieLoader: React.FC<LottieLoaderProps> = ({
  className = 'w-20 h-20 text-black',
  autoplay = true,
  loop = true,
}) => {
  return (
    <DynamicPlayer
      src={loadingAnimation}
      autoplay={autoplay}
      loop={loop}
      className={className}
    />
  );
};

export default LottieLoader;
