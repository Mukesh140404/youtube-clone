import { createFileRoute } from "@tanstack/react-router";
import LoggedUserProfile from "@/components/user/LoggedUserProfile";
import UsersProfile from "@/components/user/UsersProfile";
import { useUserStore } from "@/store/useUserStore";
import { GetCurrentUserApi,GetUserProfileApi } from "@/client/user.api";

export const Route = createFileRoute("/(protected)/$userId")({
  loader: async ({ params }) => {
    const { userId } = params;

    const storeUser = useUserStore.getState().user;

    // 🔥 case 1: logged user apna hi profile dekh raha hai
    if (storeUser && storeUser.username === userId) {
      const user = await GetCurrentUserApi();

      return {
        type: "me",
        user :user.data,
      };
    }

    // 🔥 case 2: kisi aur ka profile
    const user = await GetUserProfileApi(userId);

    return {
      type: "other",
      user:user.data,
    };
  },
  component: ProfilePage,
});

function ProfilePage() {
  // const { userId } = Route.useParams();
  // const [isLoading, setIsLoading] = useState(true);
  // const [videos, setVideos] = useState<VideoProps[]>([]);
  const data = Route.useLoaderData();
  if(data.type === "me"){
    return <LoggedUserProfile userData = {data.user}/>
  }

  // useEffect(() => {
  //   setIsLoading(true);
  //   const timer = setTimeout(() => {
  //     setVideos(
  //       Array.from({ length: 12 }).map((_, i) => ({
  //         id: `user-vid-${i}`,
  //         title: `${userId} Video ${i + 1} - Exclusive Content`,
  //         thumbnailUrl: `https://picsum.photos/seed/${userId}${i}/640/360`,
  //         channelId: userId,
  //         channelName: userId,
  //         channelAvatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}&backgroundColor=e2e8f0`,
  //         views: `${Math.floor(Math.random() * 900 + 10)}K`,
  //         postedAt: `${Math.floor(Math.random() * 11 + 1)} months ago`,
  //         duration: `${Math.floor(Math.random() * 20 + 5)}:${Math.floor(Math.random() * 50 + 10)}`,
  //       })),
  //     );
  //     setIsLoading(false);
  //   }, 1200);
  //   return () => clearTimeout(timer);
  // }, [userId]);
  // console.log("data is here",data.user)
  return <UsersProfile userData = {data.user}/>;
}
