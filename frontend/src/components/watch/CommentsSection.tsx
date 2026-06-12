import { ThumbsUp, ThumbsDown, ListVideo } from "lucide-react";
import { timeAgo } from "@/utils/timeAgo";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addCommentApi, getAllCommentApi } from "@/client/comment.api";
import { toggleLikeOnCommentApi } from "@/client/like.api";
import type { GetCommentsResponse, Comment } from "@/types/comment.type";
import { useUserStore } from "@/store/useUserStore";
import type {Video} from './VideoDetails'

const CommentItem = ({ c }: { c: Comment }) => {
  const [isLiked, setIsLiked] = useState(c.isLiked || false);
  const [likeCount, setLikeCount] = useState(c.likeCount || 0);

  useEffect(() => {
    setIsLiked(c.isLiked || false);
    setLikeCount(c.likeCount || 0);
  }, [c]);

  const likeMutation = useMutation({
    mutationFn: toggleLikeOnCommentApi,
    onSuccess: () => {},
    onError: (err) => {
      setIsLiked(prev => !prev);
      setLikeCount(prev => isLiked ? prev + 1 : prev - 1);
      console.log(err);
    }
  });

  const handleLike = () => {
    setIsLiked(prev => !prev);
    setLikeCount(prev => !isLiked ? prev + 1 : prev - 1);
    likeMutation.mutate(c._id);
  };

  return (
    <div className="flex gap-4 mb-6 group">
      <img
        src={c.owner?.avatar || "/user.png"}
        className="w-10 h-10 rounded-full object-cover shrink-0"
      />

      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold">@{c.owner?.username}</span>
          <span className="text-gray-500">{timeAgo(c.createdAt)}</span>
        </div>

        <p className="text-sm">{c.content}</p>

        <div className="flex items-center gap-4 mt-2">
          <button onClick={handleLike} className={`flex items-center gap-1 ${isLiked ? 'text-blue-500' : ''}`}>
            <ThumbsUp size={14} className={`cursor-pointer ${isLiked ? 'fill-current' : ''}`} />
            {likeCount > 0 && <span className="text-xs">{likeCount}</span>}
          </button>
          <ThumbsDown size={14} className="cursor-pointer" />
          <span className="text-xs font-bold cursor-pointer">Reply</span>
        </div>
      </div>
    </div>
  );
};

// type Comment = {
//   _id: string;
//   content: string;
//   createdAt: string;
//   owner: {
//     username: string;
//     avatar: string;
//   };
// };

type Props = {
  video: Video;
};

const CommentsSection = ({ video }: Props) => {
  const [text, setText] = useState("");
  const queryClient = useQueryClient();
  const user = useUserStore((state)=>state.user)

  const { data, isLoading } = useQuery<GetCommentsResponse>({
    queryKey: ["userComment", video._id],
    queryFn: () => getAllCommentApi(video._id),
  });

  const addCommentMutation = useMutation({
    mutationFn: addCommentApi,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userComment", video._id] });
    },

    onError: (err) => {
      console.log("MUTATION ERROR:", err);
    },
  });

  const handleSubmit = () => {
    if (!text.trim()) return;
    addCommentMutation.mutate({
      videoId: video._id,
      content: text,
    });
    // onAddComment?.(text);
    setText("");
  };

  return (
    <div className="pt-4">
      {/* Header */}
      <div className="flex items-center gap-6 mb-6">
        <h2 className="text-xl font-bold">{data?.commentCount} Comments</h2>
        <button className="flex items-center gap-2 font-medium text-sm">
          <ListVideo size={18} /> Sort by
        </button>
      </div>

      {/* Add Comment */}
      {user?.username && video?.owner?.username && user?.username !== video?.owner.username && (
      <div className="flex gap-4 mb-8">
        <img
          src={user?.avatar|| "/user.png"}
          className="w-10 h-10 rounded-full object-cover shrink-0"
        />
        <div className="flex-1">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            type="text"
            placeholder="Add a comment..."
            className="w-full bg-transparent border-b border-gray-300 dark:border-[#3f3f3f] pb-1 focus:border-black dark:focus:border-white outline-none transition text-sm"
          />

          {text && (
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => setText("")} className="px-3 py-1 text-sm">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-1 bg-blue-600 text-white rounded-full text-sm"
              >
                Comment
              </button>
            </div>
          )}
        </div>
      </div>
     )}

      {/* Comment List */}

      {isLoading ? (
        // 🔄 Loading state
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-[#272727]" />
              <div className="flex-1 space-y-2">
                <div className="w-32 h-3 bg-gray-300 dark:bg-[#272727] rounded" />
                <div className="w-full h-3 bg-gray-300 dark:bg-[#272727] rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : data?.comments.length === 0 ? (
        // 📭 Empty state
        <p className="text-gray-500 text-sm">No comments yet</p>
      ) : (
        // ✅ Data state
        data?.comments.map((c) => (
          <CommentItem key={c._id} c={c} />
        ))
      )}
    </div>
  );
};

export default CommentsSection;
