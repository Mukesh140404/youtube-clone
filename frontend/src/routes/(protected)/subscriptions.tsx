import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { allSubscribedChannelOfUser } from '@/client/subscription.api';
import { useUserStore } from '@/store/useUserStore';

export const Route = createFileRoute('/(protected)/subscriptions')({
  component: SubscriptionsMobilePage,
});

function SubscriptionsMobilePage() {
  const user = useUserStore((state) => state.user);
  
  const { data: subscriptions, isLoading, isError } = useQuery({
      queryKey: ["userSubscribers", user?._id],
      queryFn: () => allSubscribedChannelOfUser(user?._id),
      enabled: !!user?._id
  });

  if (isLoading) {
    return <div className="p-4 text-center">Loading subscriptions...</div>;
  }

  if (isError) {
    return <div className="p-4 text-center text-red-500">Failed to load subscriptions.</div>;
  }

  return (
    <div className="p-4 md:p-6 w-full max-w-2xl mx-auto pb-20">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">All Subscriptions</h1>
      
      {subscriptions && subscriptions.count > 0 ? (
        <div className="space-y-2">
          {subscriptions.channels.map((sub: any) => (
            <Link
              key={sub.channel._id}
              to="/$userId"
              params={{ userId: sub.channel.username }}
              className="flex items-center justify-between p-3 bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-[#3f3f3f] rounded-xl hover:bg-gray-50 dark:hover:bg-[#161616] transition-colors"
            >
              <div className="flex items-center gap-4">
                <img
                  src={sub.channel.avatar}
                  alt={sub.channel.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{sub.channel.username}</h3>
                  {/* You can add more info here like subscriber count if available in the API response */}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500 flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            <p>You haven't subscribed to any channels yet.</p>
        </div>
      )}
    </div>
  );
}
