import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { getAllTweetsApi } from '@/client/tweet.api';
import TweetCard from '@/components/tweetCard';
import type { TweetProps } from '@/types/tweet.type';

export const Route = createFileRoute('/(protected)/tweets')({
  component: TweetsPage,
});

function TweetsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['allTweets'],
    queryFn: getAllTweetsApi,
  });

  if (isError) {
    return <div className="p-4 text-center text-red-500">Failed to load tweets.</div>;
  }

  if (isLoading) {
    return <div className="p-4 text-center">Loading tweets...</div>;
  }

  return (
    <div className="p-4 md:p-6 w-full max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Recent Tweets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data && data.length > 0 ? (
          data.map((tweet: TweetProps) => (
            <div key={tweet._id} className="bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-[#3f3f3f] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
               <TweetCard tweet={tweet} />
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500 col-span-full">No tweets found.</div>
        )}
      </div>
    </div>
  );
}
