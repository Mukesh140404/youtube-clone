import { CheckAuthApi } from "@/client/user.api";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)")({
  beforeLoad: async () => {
    const isAuth = await CheckAuthApi();
    if (isAuth) {
      throw redirect({
        to: "..",
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet/>
}
