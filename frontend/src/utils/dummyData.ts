import { VideoProps } from '@/components/VideoCard';

export const getDummyVideos = (count: number): VideoProps[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `vid-${Math.random().toString(36).substring(7)}`,
    title: `Amazing Video Title ${i + 1} - Exploring the unknown`,
    thumbnailUrl: `https://picsum.photos/seed/${Math.random().toString(36).substring(7)}/640/360`,
    channelId: i % 2 === 0 ? 'Fireship' : 'CodeWithHarry',
    channelName: i % 2 === 0 ? 'Fireship' : 'CodeWithHarry',
    channelAvatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i % 2 === 0 ? 'Jeff' : 'Harry'}&backgroundColor=e2e8f0`,
    views: `${Math.floor(Math.random() * 900 + 10)}K`,
    postedAt: `${Math.floor(Math.random() * 11 + 1)} months ago`,
    duration: `${Math.floor(Math.random() * 20 + 5)}:${Math.floor(Math.random() * 50 + 10).toString().padStart(2, '0')}`,
  }));
};
