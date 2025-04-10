import React from "react";
import { Redirect, Stack } from "expo-router";
import Loader from "@/components/Loader";
import { useGlobalContext } from "../../context/GlobalProvider";
import { getHomeRoute } from "@/utils/navigation";

const AuthLayout = () => {
  const { loading, isLogged, role } = useGlobalContext();

  if (loading) {
    return <Loader isLoading={true} />;
  }

  if (isLogged) {
    const homeRoute = getHomeRoute(role);
    return <Redirect href={homeRoute} />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="otp-sender"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="otp-verification"
        options={{
          headerShown: false
        }}
      />
    </Stack>
  );
};

export default AuthLayout;
