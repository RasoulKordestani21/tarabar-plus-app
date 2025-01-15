import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import tw from "@/libs/twrnc"; // Tailwind-style library

const SupportAndFaq = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const faqData = [
    {
      id: 1,
      question: "آیا امکان واریز کرایه از اپلیکیشن وجود دارد ؟",
      answer:
        "بله، به این صورت که می‌توانید از قسمت پرداخت این فرآیند را انجام دهید."
    },
    {
      id: 2,
      question: "چگونه می‌توانم اپلیکیشن را دانلود کنم؟",
      answer:
        "شما می‌توانید اپلیکیشن را از فروشگاه‌های معتبر مانند Google Play یا App Store دانلود کنید."
    },
    {
      id: 3,
      question: "آیا اپلیکیشن در سیستم‌عامل iOS پشتیبانی می‌شود؟",
      answer: "بله، این اپلیکیشن برای هر دو سیستم‌عامل iOS و Android موجود است."
    },
    {
      id: 4,
      question: "چگونه با پشتیبانی تماس بگیرم؟",
      answer:
        "برای تماس با پشتیبانی، از شماره موجود در بخش اطلاعات تماس استفاده کنید."
    },
    {
      id: 5,
      question: "هزینه استفاده از اپلیکیشن چقدر است؟",
      answer:
        "استفاده از اپلیکیشن رایگان است، اما خدمات خاص ممکن است هزینه داشته باشند."
    }
  ];

  const toggleExpanded = (id: number) => {
    setExpandedId(prevId => (prevId === id ? null : id));
  };

  return (
    <View style={tw`flex-1 bg-white p-4`}>
      {/* Support Card */}
      <View style={tw`bg-green-100 p-4 rounded-lg  flex items-end`}>
        <Text style={tw`text-blue-900 font-vazir text-base text-right`}>
          ارتباط با پشتیبانی سایت:
        </Text>
        <Text style={tw`text-blue-900 font-vazir text-sm mt-2 text-right`}>
          ساعت‌های پاسخگویی: شنبه تا چهارشنبه - ۸ صبح تا ۶ عصر
        </Text>
        <View style={tw`flex-row items-center mt-2`}>
          <FontAwesome name="phone" size={16} color="#0055AA" />
          <Text style={tw`text-blue-900 font-vazir text-base ml-2`}>
            093-22349811
          </Text>
        </View>
      </View>

      {/* FAQ Section */}
      <Text
        style={tw`text-blue-900 text-right font-vazir-bold text-lg mt-6 mb-4`}
      >
        سوالات متداول:
      </Text>

      {faqData.map(item => (
        <View key={item.id} style={tw`mb-4`}>
          {/* Question Box */}
          <Pressable
            style={tw`flex-row justify-between items-center bg-black-100 p-4 rounded-lg shadow-sm`}
            onPress={() => toggleExpanded(item.id)}
          >
             <FontAwesome
              name={expandedId === item.id ? "chevron-up" : "chevron-down"}
              size={16}
              color="#0055AA"
            />
            <Text style={tw`text-blue-900 font-vazir text-base text-right`}>
              {item.question}
            </Text>
          </Pressable>

          {/* Answer Section */}
          {expandedId === item.id && (
            <View style={tw`bg-black-200 p-4 mt-2 rounded-lg shadow-inner`}>
              <Text style={tw`text-gray-700 font-vazir text-sm text-right`}>
                {item.answer}
              </Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

export default SupportAndFaq;
