// components/RulesModal.tsx - Simplified Version
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from "react-native";
import tw from "@/libs/twrnc";
import { Feather, AntDesign, MaterialIcons } from "@expo/vector-icons";
import { getRules } from "@/api/services/otpServices";
import { useToast } from "@/context/ToastContext";

type RulesModalProps = {
  visible: boolean;
  onAccept: () => void;
  onClose: () => void;
};

const RulesModal: React.FC<RulesModalProps> = ({
  visible,
  onAccept,
  onClose
}) => {
  const [rulesContent, setRulesContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const { showToast } = useToast();

  // Fetch rules when modal opens
  useEffect(() => {
    if (visible && !rulesContent) {
      fetchRules();
    }
  }, [visible]);

  const fetchRules = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getRules();
      setRulesContent(response.rules);
    } catch (err: any) {
      setError("خطا در دریافت قوانین و مقررات");
      showToast("خطا در دریافت قوانین و مقررات", "error");

      // Fallback content
      setRulesContent(`۱. کلیات
استفاده شما از این اپلیکیشن به منزله پذیرش کامل تمامی قوانین و مقررات است.

۲. شرایط استفاده  
کاربر متعهد می‌شود از سرویس‌های ارائه شده مطابق قوانین استفاده نماید.

۳. حریم خصوصی
ما به حفظ حریم خصوصی کاربران خود متعهد هستیم.

۴. مسئولیت‌ها
مسئولیت تمامی فعالیت‌ها به عهده کاربر است.

۵. محدودیت‌ها
کاربر حق ندارد از خدمات برای فعالیت‌های غیرقانونی استفاده کند.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if scrolled to bottom
  const handleScroll = event => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    const isScrolledToBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;

    if (isScrolledToBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

  const handleAcceptRules = () => {
    onAccept();
    showToast("قوانین و مقررات پذیرفته شد", "success");
  };

  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <View
        style={tw`flex-1 justify-center items-center bg-black bg-black-50 h-[50%]`}
      >
        <View
          style={tw`bg-white m-5 rounded-xl w-[90%] h-[80%] overflow-hidden`}
        >
          {/* Header */}
          <View
            style={tw`bg-primary py-4 px-4 flex-row justify-between items-center`}
          >
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="white" />
            </TouchableOpacity>
            <Text style={tw`text-white font-vazir-bold text-lg`}>
              قوانین و مقررات
            </Text>
            <View style={tw`w-6`} />
          </View>

          {/* Content */}
          {isLoading ? (
            <View style={tw`flex-1 justify-center items-center py-20`}>
              <ActivityIndicator size="large" color="#003366" />
              <Text style={tw`mt-4 font-vazir text-gray-600`}>
                در حال دریافت قوانین...
              </Text>
            </View>
          ) : error ? (
            <View style={tw`flex-1 justify-center items-center py-20`}>
              <MaterialIcons name="error-outline" size={48} color="#ef4444" />
              <Text style={tw`mt-4 font-vazir text-red-600 text-center px-4`}>
                {error}
              </Text>
              <TouchableOpacity
                style={tw`mt-4 bg-blue-500 px-4 py-2 rounded-lg`}
                onPress={fetchRules}
              >
                <Text style={tw`text-white font-vazir-bold`}>تلاش مجدد</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView
              style={tw`flex-1 px-4 py-4 bg-yellow-100`}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              <Text
                style={tw`text-right font-vazir text-background leading-6 px-3 bg-yellow-100`}
              >
                {rulesContent}
              </Text>
              <View style={tw`h-4`} />
            </ScrollView>
          )}

          {/* Buttons */}
          {!isLoading && !error && (
            <View style={tw`px-4 pb-4 border-t border-black-900 `}>
              {!hasScrolledToBottom && (
                <View style={tw`mb-3 bg-yellow-50 p-2 rounded-lg`}>
                  <Text style={tw`text-yellow-700 font-vazir text-center`}>
                    لطفا قوانین را تا انتها مطالعه کنید
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={[
                  tw`rounded-lg py-3 items-center my-2 mt-3`,
                  hasScrolledToBottom ? tw`bg-primary` : tw`bg-card`
                ]}
                onPress={handleAcceptRules}
                disabled={!hasScrolledToBottom}
              >
                <View style={tw`flex-row items-center`}>
                  <Text style={tw`text-white font-vazir-bold`}>
                    قوانین را می‌پذیرم
                  </Text>
                  {hasScrolledToBottom && (
                    <AntDesign
                      name="checkcircle"
                      size={16}
                      color="white"
                      style={tw`ml-2`}
                    />
                  )}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={tw`border border-primary rounded-lg py-2 items-center`}
                onPress={onClose}
              >
                <Text style={tw`text-primary font-vazir-bold`}>بستن</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default RulesModal;
