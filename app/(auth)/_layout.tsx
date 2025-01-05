import React from "react";
import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Loader from "@/components/Loader";
import { useGlobalContext } from "../../context/GlobalProvider";

const AuthLayout = () => {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/" />;

  return (
    <>
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

      {/* <Loader isLoading={loading} /> */}
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default AuthLayout;
