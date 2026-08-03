import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import type { Video } from '@/types/video.type';
import  VideoCard  from '@/components/VideoCard';
import { SidebarVideoCard } from '@/components/watch';
import { HistoryPageSkeleton } from '@/components/HistoryPageSkeleton';
import { Clock } from 'lucide-react';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { getWatchlistApi } from '@/client/user.api';

export const Route = createFileRoute('/(protected)/history')({
  component: HistoryPage,
});

// API se aane wala raw history entry
interface HistoryEntry {
  _id: string;
  video: Video;
  createdAt: string; // watch hone ka time
  updatedAt: string;
}

// Grouping ke liye video + watchedAt ek saath rakhenge
interface HistoryVideo extends Video {
  watchedAt: string;
  historyId: string;
}

function groupVideosByDate(entries: HistoryVideo[]): Record<string, HistoryVideo[]> {
  const groups: Record<string, HistoryVideo[]> = {};

  for (const item of entries) {
    const watchedAt = parseISO(item.watchedAt);
    let groupKey: string;

    if (isToday(watchedAt)) {
      groupKey = 'Today';
    } else if (isYesterday(watchedAt)) {
      groupKey = 'Yesterday';
    } else {
      groupKey = format(watchedAt, 'MMMM d, yyyy');
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
  }
  return groups;
}

function HistoryPage() {
  const { data: watchHistory, isLoading, isError } = useQuery<HistoryEntry[]>({
    queryKey: ['watchHistory'],
    queryFn: getWatchlistApi,
  });

  if (isLoading) {
    return <HistoryPageSkeleton />;
  }

  if (isError || !watchHistory || watchHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center">
        <Clock className="w-20 h-20 text-gray-400 dark:text-gray-500 mb-4" />
        <h2 className="text-2xl font-bold dark:text-white">No watch history yet</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Videos you watch will appear here.</p>
      </div>
    );
  }

  console.log(watchHistory);

  // history entries ko flatten karke video + watchedAt ek object me le aayenge
  const flattenedVideos: HistoryVideo[] = watchHistory
    .filter((entry) => entry.video) // deleted/null video ko skip karo
    .map((entry) => ({
      ...entry.video,
      watchedAt: entry.createdAt,
      historyId: entry._id,
    }));

  const groupedVideos = groupVideosByDate(flattenedVideos);

  const sortedGroupKeys = Object.keys(groupedVideos).sort((a, b) => {
    if (a === 'Today') return -1;
    if (b === 'Today') return 1;
    if (a === 'Yesterday') return -1;
    if (b === 'Yesterday') return 1;
    return new Date(b).getTime() - new Date(a).getTime();
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 mx-auto">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Watch History</h1>
      <div className="space-y-10">
        {sortedGroupKeys.map((date) => (
          <div key={date}>
            <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 dark:text-white">
              {date}
            </h2>

            {/* Desktop / tablet grid */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
              {groupedVideos[date].map((video) => (
                <VideoCard key={video.historyId} video={video} />
              ))}
            </div>

            {/* Mobile list */}
            <div className="md:hidden space-y-4">
              {groupedVideos[date].map((video) => (
                <SidebarVideoCard key={video.historyId} video={video} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
