import { Route } from "expo-router";

type Box = {
  id: number;
  source: any;
  text: string;
  route: Route;
};

const homeBoxes: Box[] = [
  {
    id: 1,
    source: require("@/assets/images/find-cargo-by-origin-destination-icon.png"),
    text: "باریابی با مبدا و مقصد",
    route: "/find-cargo-by-origin-destination"
  },
  {
    id: 2,
    source: require("@/assets/images/find-cargo-by-location-icon.png"),
    text: "باریابی با موقعیت جغرافیایی",
    route: "/find-cargo-by-location"
  },
  {
    id: 3,
    source: require("@/assets/images/tools-icon.png"),
    text: "ابزار",
    route: "/tools"
  },
  {
    id: 4,
    source: require("@/assets/images/account-icon.png"),
    text: "حساب کاربری",
    route: "/account"
  },
  {
    id: 5,
    source: require("@/assets/images/support-icon.png"),
    text: "پشتیبانی",
    route: "/support"
  },
  {
    id: 6,
    source: require("@/assets/images/inquiries-icon.png"),
    text: "استعلام ها",
    route: "/inquiries"
  }
];

const tabBoxes = [
  {
    name: "account",
    title: "کاربر",
    iconName: "person.crop.circle"
  },
  {
    name: "inquiry",
    title: "استعلام",
    iconName: "doc.plaintext.fill"
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

export { homeBoxes, tabBoxes };
