import TweetCard from "../tweetCard";
import type { TweetProps } from "@/types/tweet.type";
import { useQuery } from "@tanstack/react-query";
import { getUserAllTweetsApi } from "@/client/tweet.api";


const CommunitySection = ({userId}: {userId:string}) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["usertweets", userId], // unique key
    queryFn: () => getUserAllTweetsApi(userId),
    enabled: !!userId,
  });

  if (isError) {
    return <div className="text-center py-10 opacity-50">Failed to load community posts.</div>;
  }

  if (isLoading) {
    return <div className="text-center py-10 opacity-50">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {!data || data.length === 0 ? (
        <div className="text-center py-10 opacity-50">
          <p>No community posts yet. Start the conversation!</p>
        </div>
      ) : (
        data.map((tweet: TweetProps) => (
          <div key={tweet._id}>
            <TweetCard tweet={tweet} />
          </div>
        ))
      )}
    </div>
  );
};

export default CommunitySection;
