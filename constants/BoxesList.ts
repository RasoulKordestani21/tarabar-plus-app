import { Route } from "expo-router";
import { useGlobalContext } from "@/context/GlobalProvider";

const homeBoxes = (role: string) => {
  if (role === "1") {
    return [
      {
        id: 1,
        source: require("@/assets/images/find-cargo-by-location-icon.png"),
        text: "باریابی",
        route: "/find-cargo-by-location"
      },

      {
        id: 2,
        source: require("@/assets/images/account-icon.png"),
        text: "حساب کاربری",
        route: "/account"
      },
      {
        id: 3,
        source: require("@/assets/images/tools-icon.png"),
        text: "ابزار",
        route: "/tools"
      }
    ];
  } else {
    return [
      {
        id: 7,
        source: require("@/assets/images/add-cargo-icon.png"),
        text: "ایجاد بار جدید",
        route: "/create-cargo"
      },
      {
        id: 8,
        source: require("@/assets/images/add-cargo-icon.png"),
        text: "تاریخچه بارها",
        route: "/cargo-history"
      }
    ];
  }
};

const tabBoxes = (role: string) => {
  const role1Tabs = [
    {
      name: "tools",
      title: "ابزار",
      iconName: "wrench.fill"
    },
    {
      name: "account",
      title: "کاربر",
      iconName: "person.crop.circle"
    },

    {
      name: "home",
      title: "خانه",
      iconName: "house.fill"
    }
  ];
  const role2Tabs = [
    {
      name: "account",
      title: "کاربر",
      iconName: "person.crop.circle"
    },
    {
      name: "tools",
      title: "ابزار",
      iconName: "wrench.fill"
    },
    {
      name: "home",
      title: "خانه",
      iconName: "house.fill"
    }
  ];
  if (role === "1") {
    return role1Tabs;
  } else {
    return role2Tabs;
  }
};

const truckTypes = [
  { label: "ده چرخ", value: "1" },
  { label: "شش چرخ", value: "2" },
  { label: "تخت", value: "3" },
  { label: "یخچالی", value: "4" },
  { label: "تانکر", value: "5" },
  { label: "کفی", value: "6" },
  { label: "کمپرسی", value: "7" },
  { label: "لبه دار", value: "8" },
  { label: "بغل بازشو", value: "9" },
  { label: "مسقف", value: "10" },
  { label: "حمل خودرو", value: "11" },
  { label: "چادری", value: "12" },
  { label: "وانت", value: "13" },
  { label: "تریلی معمولی", value: "14" }
];

const cargoTypes = [
  { label: "پالت", value: "1" },
  { label: "کارتن", value: "2" },
  { label: "بشکه", value: "3" },
  { label: "جامبو بگ", value: "4" },
  { label: "رول", value: "5" },
  { label: "گونی", value: "6" },
  { label: "کیسه", value: "7" },
  { label: "تانکر", value: "8" },
  { label: "مایعات فله", value: "9" },
  { label: "گاز فله", value: "10" },
  { label: "محموله حجیم", value: "11" },
  { label: "محموله ترافیکی", value: "12" },
  { label: "دستگاه", value: "13" },
  { label: "لوله", value: "14" },
  { label: "میلگرد", value: "15" },
  { label: "خودرو", value: "16" },
  { label: "دام", value: "17" },
  { label: "مصالح ساختمانی", value: "18" },
  { label: "اثاثیه منزل", value: "19" }
];

export { homeBoxes, tabBoxes, truckTypes, cargoTypes };
