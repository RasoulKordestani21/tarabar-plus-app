// hooks/usePaymentDeepLink.ts
import { useEffect } from "react";
import { Linking } from "react-native";
import apiClient from "@/api/apiClient";
import Toast from "react-native-toast-message";

interface PaymentDeepLinkParams {
  Authority?: string;
  Status?: string;
}

interface UsePaymentDeepLinkProps {
  onPaymentVerified?: () => void;
}

export const usePaymentDeepLink = ({
  onPaymentVerified
}: UsePaymentDeepLinkProps = {}) => {
  const handlePaymentResponse = async (params: PaymentDeepLinkParams) => {
    const { Authority, Status } = params;

    if (!Authority || !Status) {
      console.log("Invalid payment parameters");
      return;
    }

    try {
      const response = await apiClient.post("api/payment/verify", {
        Authority,
        Status
      });

      if (response.data.success) {
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
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      Toast.show({
        type: "error",
        text1: "خطا",
        text2: "خطا در تایید پرداخت"
      });
    }
  };

  const parseDeepLink = (url: string): PaymentDeepLinkParams => {
    const params: PaymentDeepLinkParams = {};
    try {
      const urlObj = new URL(url);
      const queryParams = new URLSearchParams(urlObj.search);

      params.Authority = queryParams.get("Authority") || undefined;
      params.Status = queryParams.get("Status") || undefined;
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
      console.log(url);
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
