// hooks/usePaymentDeepLink.ts
import { useEffect } from "react";
import { Linking } from "react-native";
import apiClient from "@/api/apiClient";
import Toast from "react-native-toast-message";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/QueryKeys";
import { useGlobalContext } from "@/context/GlobalProvider";

interface PaymentDeepLinkParams {
  Authority?: string;
  Status?: string;
  RefId?: string;
}

interface UsePaymentDeepLinkProps {
  onPaymentVerified?: () => void;
  onPaymentCancelled?: () => void;
  onPaymentError?: () => void;
}

export const usePaymentDeepLink = ({
  onPaymentVerified,
  onPaymentCancelled,
  onPaymentError
}: UsePaymentDeepLinkProps = {}) => {
  const { phoneNumber } = useGlobalContext();
  const queryClient = useQueryClient();

  const handlePaymentResponse = async (params: PaymentDeepLinkParams) => {
    const { Authority, Status, RefId } = params;

    if (!Authority || !Status) {
      console.log("Invalid payment parameters");
      return;
    }

    // If we receive a direct response from the verification page
    if (Status === "OK" && RefId) {
      // Payment was already verified by the server and we have the RefId
      // Just show success message and invalidate queries
      queryClient.invalidateQueries([QUERY_KEYS.CARGO_OWNER_INFO, phoneNumber]);
      queryClient.invalidateQueries([QUERY_KEYS.DRIVER_INFO, phoneNumber]);

      Toast.show({
        type: "success",
        text1: "موفق",
        text2: "پرداخت با موفقیت انجام شد"
      });

      onPaymentVerified?.();
      return;
    }

    if (Status === "CANCELLED") {
      Toast.show({
        type: "info",
        text1: "لغو شد",
        text2: "پرداخت لغو شد"
      });

      onPaymentCancelled?.();
      return;
    }

    if (Status === "ERROR") {
      Toast.show({
        type: "error",
        text1: "خطا",
        text2: "خطا در تایید پرداخت"
      });

      onPaymentError?.();
      return;
    }

    // If we need to verify the payment status with the server
    try {
      const response = await apiClient.post("api/payment/verify", {
        Authority,
        Status
      });

      if (response.data.success) {
        queryClient.invalidateQueries([
          QUERY_KEYS.CARGO_OWNER_INFO,
          phoneNumber
        ]);
        queryClient.invalidateQueries([QUERY_KEYS.DRIVER_INFO, phoneNumber]);

        Toast.show({
          type: "success",
          text1: "موفق",
          text2: "پرداخت با موفقیت انجام شد"
        });

        onPaymentVerified?.();
      } else {
        Toast.show({
          type: "error",
          text1: "خطا",
          text2: "پرداخت ناموفق بود"
        });

        onPaymentError?.();
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      Toast.show({
        type: "error",
        text1: "خطا",
        text2: "خطا در تایید پرداخت"
      });

      onPaymentError?.();
    }
  };

  const parseDeepLink = (url: string): PaymentDeepLinkParams => {
    const params: PaymentDeepLinkParams = {};
    try {
      const urlObj = new URL(url);
      const queryParams = new URLSearchParams(urlObj.search);

      params.Authority = queryParams.get("Authority") || undefined;
      params.Status = queryParams.get("Status") || undefined;
      params.RefId = queryParams.get("RefId") || undefined;
    } catch (error) {
      console.error("Error parsing deep link:", error);
    }
    return params;
  };

  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const url = event.url;
      if (url.includes("payment-verify")) {
        const params = parseDeepLink(url);
        handlePaymentResponse(params);
      }
    };

    // Subscribe to incoming links
    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Check if app was opened via deep link
    Linking.getInitialURL().then(url => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return { handlePaymentResponse };
};
