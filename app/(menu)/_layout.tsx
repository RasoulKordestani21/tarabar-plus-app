import React from "react";
import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { useGlobalContext } from "../../context/GlobalProvider";

const MenuLayout = () => {
  // const { loading, isLogged } = useGlobalContext();

  return (
    <>
      <Stack>
        <Stack.Screen
          name="find-cargo-by-location"
          options={{
            headerShown: false
          }}
        />
        {/* <Stack.Screen
          name="otp-verification"
          options={{
            headerShown: false
          }}
        /> */}
      </Stack>

      {/* <Loader isLoading={loading} /> */}
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default MenuLayout;
