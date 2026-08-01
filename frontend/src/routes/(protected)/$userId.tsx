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
  const data = Route.useLoaderData();
  if(data.type === "me"){
    return <LoggedUserProfile userData = {data.user}/>
  }
  return <UsersProfile userData = {data.user}/>;
}
