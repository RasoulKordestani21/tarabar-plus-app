// hooks/usePaymentService.ts with better deep link handling
import { useState, useEffect } from "react";
import { Linking, Platform, AppState } from "react-native";
import Toast from "react-native-toast-message";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/QueryKeys";
import apiClient from "@/api/apiClient";

// Try to import InAppBrowser
let InAppBrowser;
try {
  InAppBrowser = require("react-native-inappbrowser-reborn").default;
} catch (e) {
  console.warn("InAppBrowser module not available:", e);
  InAppBrowser = null;
}

interface UsePaymentServiceProps {
  onPaymentVerified?: () => void;
  onPaymentCancelled?: () => void;
  onPaymentError?: () => void;
  userType: "driver" | "cargoOwner";
  phoneNumber: string;
}

export const usePaymentService = ({
  onPaymentVerified,
  onPaymentCancelled,
  onPaymentError,
  userType,
  phoneNumber
}: UsePaymentServiceProps) => {
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTransactionId, setActiveTransactionId] = useState<string | null>(
    null
  );

  // Handle deep links for payment verification
  useEffect(() => {
    // Function to handle deep link
    const handleDeepLink = (event: { url: string }) => {
      const url = event.url;

      // Check if this is a payment verification deep link
      if (url.includes("payment-verify")) {
        console.log("Payment verification deep link received:", url);

        // Parse URL parameters
        const params = new URL(url).searchParams;
        const status = params.get("Status");

        if (status === "OK") {
          // Payment successful via deep link
          console.log("Payment successful via deep link");

          // If we have an active transaction ID, verify it
          if (activeTransactionId) {
            verifyPaymentByTransaction(activeTransactionId);
          } else {
            // No active transaction ID, just show success message
            Toast.show({
              type: "success",
              text1: "موفق",
              text2: "پرداخت با موفقیت انجام شد"
            });

            // Refresh data
            queryClient.invalidateQueries([
              QUERY_KEYS.CARGO_OWNER_INFO,
              phoneNumber
            ]);
            queryClient.invalidateQueries([
              QUERY_KEYS.DRIVER_INFO,
              phoneNumber
            ]);

            onPaymentVerified?.();
          }
        } else {
          // Payment failed or cancelled via deep link
          console.log("Payment failed or cancelled via deep link");
          Toast.show({
            type: "info",
            text1: "پرداخت ناموفق",
            text2: "پرداخت با موفقیت انجام نشد"
          });

          onPaymentCancelled?.();
        }

        // Clear active transaction ID
        setActiveTransactionId(null);
      }
    };

    // Set up listeners for deep links
    const linkingSubscription = Linking.addEventListener("url", handleDeepLink);

    // Check if app was opened via deep link
    Linking.getInitialURL().then(url => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    // Clean up
    return () => {
      linkingSubscription.remove();
    };
  }, [
    activeTransactionId,
    phoneNumber,
    queryClient,
    onPaymentVerified,
    onPaymentCancelled
  ]);

  // Handle app state changes for payment verification
  useEffect(() => {
    if (!activeTransactionId) return;

    // Function to handle app state changes
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === "active" && activeTransactionId) {
        // App has come back to the foreground
        console.log("App returned to foreground, verifying payment...");
        verifyPaymentByTransaction(activeTransactionId);
      }
    };

    // Listen for app state changes
    const appStateSubscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    // Clean up
    return () => {
      appStateSubscription.remove();
    };
  }, [activeTransactionId]);

  // Create a transaction ID for secure payment tracking
  const generateTransactionId = () => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  };

  // Check if InAppBrowser is available
  const isInAppBrowserAvailable = async () => {
    if (!InAppBrowser) return false;

    try {
      return await InAppBrowser.isAvailable();
    } catch (e) {
      console.warn("Error checking InAppBrowser availability:", e);
      return false;
    }
  };

  // Initialize payment process
  const initiatePayment = async (
    amount: number,
    description: string,
    metadata: any = {}
  ) => {
    if (!amount || amount <= 0) {
      Toast.show({
        type: "error",
        text1: "خطا",
        text2: "مبلغ پرداخت نامعتبر است"
      });
      return false;
    }

    try {
      setIsProcessing(true);
      console.log("Starting payment process...");

      // Generate unique transaction ID
      const transactionId = generateTransactionId();
      console.log("Generated transaction ID:", transactionId);

      // Store active transaction ID for deep link handling
      setActiveTransactionId(transactionId);

      // Create payment request
      console.log("Sending payment creation request to API...");
      const response = await apiClient.post("api/payment/create", {
        amount: 12000,
        description,
        userType,
        transactionId,
        phoneNumber,
        metadata
      });

      console.log("Payment creation response:", response.data);

      if (!response.data.success) {
        throw new Error(response.data.message || "خطا در ایجاد پرداخت");
      }

      const paymentUrl = response.data.paymentUrl;
      console.log("Payment URL received:", paymentUrl);

      // Check if in-app browser is available
      const browserAvailable = await isInAppBrowserAvailable();
      console.log("InAppBrowser available:", browserAvailable);

      if (browserAvailable) {
        console.log("Opening payment URL in InAppBrowser...");
        // Open payment URL in in-app browser
        const result = await InAppBrowser.open(paymentUrl, {
          // Security and UX focused configuration
          showTitle: true,
          enableUrlBarHiding: false,
          enableDefaultShare: false,
          forceCloseOnRedirection: false,
          // Customize to match your app branding
          toolbarColor: "#059669",
          secondaryToolbarColor: "black",
          navigationBarColor: "black",
          dismissButtonStyle: "cancel"
        });

        console.log("InAppBrowser result:", result);

        // Handle result based on browser outcome
        if (result.type === "success") {
          console.log("Browser returned success, verifying payment...");
          // Verify the payment status on server
          await verifyPaymentByTransaction(transactionId);
        } else {
          console.log("Browser was closed/cancelled");
          // User cancelled or closed the browser
          Toast.show({
            type: "info",
            text1: "پرداخت لغو شد",
            text2: "فرآیند پرداخت ناتمام ماند"
          });

          // Clear active transaction ID
          setActiveTransactionId(null);

          onPaymentCancelled?.();
        }

        return true;
      } else {
        console.log("Falling back to external browser...");
        // Fallback to external browser if in-app browser not available
        await Linking.openURL(paymentUrl);

        // Show instructions to user
        Toast.show({
          type: "info",
          text1: "پرداخت",
          text2: "پس از تکمیل پرداخت، دوباره به برنامه برگردید",
          visibilityTime: 6000
        });

        // App state change listener will handle verification when app comes back to foreground
        // We'll also set a fallback timeout just in case
        console.log("Setting up payment verification timeout...");
        setTimeout(() => {
          console.log("Checking payment status after timeout...");
          if (activeTransactionId === transactionId) {
            verifyPaymentByTransaction(transactionId);
          }
        }, 60000); // Check after 1 minute as a fallback

        return true;
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      Toast.show({
        type: "error",
        text1: "خطا",
        text2: error.message || "خطا در فرآیند پرداخت"
      });

      // Clear active transaction ID
      setActiveTransactionId(null);

      onPaymentError?.();
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // Verify payment using transaction ID
  const verifyPaymentByTransaction = async (transactionId: string) => {
    try {
      console.log(
        "Starting payment verification for transaction:",
        transactionId
      );
      // Try verification up to 3 times with delay
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        attempts++;
        console.log(`Verification attempt ${attempts}/${maxAttempts}`);

        const verifyResponse = await apiClient.post(
          "api/payment/verify-transaction",
          {
            transactionId,
            userType,
            phoneNumber
          }
        );

        console.log("Verification response:", verifyResponse.data);

        if (verifyResponse.data.success) {
          // Payment verified successfully
          console.log("Payment verified successfully!");
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

          // Clear active transaction ID
          setActiveTransactionId(null);

          onPaymentVerified?.();
          return true;
        }

        if (verifyResponse.data.status === "pending") {
          // Payment is still being processed, wait and try again
          console.log("Payment still pending, waiting before next attempt...");
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }

        // Payment failed or was cancelled
        console.log("Payment verification failed");
        Toast.show({
          type: "error",
          text1: "خطا",
          text2: "پرداخت ناموفق بود"
        });

        // Clear active transaction ID
        setActiveTransactionId(null);

        onPaymentError?.();
        return false;
      }

      // If we get here, verification is still pending after max attempts
      console.log(
        "Maximum verification attempts reached, status still pending"
      );
      Toast.show({
        type: "info",
        text1: "در حال بررسی",
        text2: "وضعیت پرداخت شما در حال بررسی است"
      });

      // We'll keep the active transaction ID in case it completes later

      return false;
    } catch (error) {
      console.error("Error verifying payment:", error);
      Toast.show({
        type: "error",
        text1: "خطا",
        text2: "خطا در تایید پرداخت"
      });

      // Clear active transaction ID on error
      setActiveTransactionId(null);

      onPaymentError?.();
      return false;
    }
  };

  return {
    initiatePayment,
    verifyPaymentByTransaction,
    isProcessing
  };
};
