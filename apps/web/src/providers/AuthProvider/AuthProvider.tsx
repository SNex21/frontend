import { useCloudStorage, useInitData } from "@/lib/twa/hooks";
import { User } from "@/models";
import { getUser, updateUser } from "@/services/api/users";
import { ACCESS_TOKEN_NAME } from "@/services/auth/storage.ts";
import { LoaderSpinner } from "@repo/ui";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import posthog from "posthog-js";
import { AxiosError } from "axios";
import { logout } from "@/services/auth";
import { useNavigate } from "react-router-dom";

const authContext = React.createContext<User | null>(null);

const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate();

  const [initData] = useInitData();
  const cloudStorage = useCloudStorage();
  const userQuery = useQuery({
    queryKey: ["user"],
    queryFn: async () =>
      getUser({
        id: Number(await cloudStorage.getItem("user_id")),
        token: await cloudStorage.getItem(ACCESS_TOKEN_NAME),
      }),
  });

  React.useEffect(() => {
    if (userQuery.data) {
      posthog.identify(userQuery.data.id.toString(), {
        username: userQuery.data.username,
        telegramId: userQuery.data.telegramId,
        telegramUsername: initData?.user?.username,
        settings: userQuery.data.settings,
        create_datetime: userQuery.data.create_datetime,
      });
    }
  }, [userQuery.data]);

  React.useEffect(() => {
    const update = async () => {
      try {
        await updateUser({
          id: Number(await cloudStorage.getItem("user_id")),
          token: await cloudStorage.getItem(ACCESS_TOKEN_NAME),
          timezone: -Math.round(new Date().getTimezoneOffset() / 60) ,
          telegramUsername: initData?.user?.username ?? "",
        });
      } catch (e) {
        console.error(e);
      }
    };

    if (userQuery.data) {
      update();
    }
  }, [userQuery.data]);

  if (userQuery.isError) {
    const error = userQuery.error as AxiosError;
    const code = error.response?.status;

    if (!code) return "oops";

    logout().then(() => navigate("/welcome"));
  }

  if (userQuery.isLoading || !userQuery.data) {
    return (
      <div
        style={{
          width: "100dvw",
          height: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LoaderSpinner size={25} />
      </div>
    );
  }

  userQuery.data.avatarUrl = initData?.user?.photo_url;

  return <authContext.Provider value={userQuery.data}>{children}</authContext.Provider>;
};

const useUser = () => {
  const user = React.useContext(authContext);
  if (!user) throw new Error("useUser must be used within an AuthProvider");
  return user;
};

const useSettings = () => {
  const user = React.useContext(authContext);
  if (!user) throw new Error("useSettings must be used within an AuthProvider");
  return user.settings;
};

export { AuthProvider, useUser, useSettings };
