const tintColor = "#2f95dc";

const theme = {
  // Ionic name styles
  primary: "#3cb371", //mediumseagreen
  secondary: "#87cefa", //lightskyblue
  danger: "#cd5c5c", //indianred
  primaryLight: "#9acd32",
  light: "#f4f4f4",
  lightGray: "#dedede",
  gray: "#aaa",
  dark: "#222",
  warning: "#ffd700", //gold
  muted: "#888888",
  background: "#efefef"
};

const social = {
  facebook: "#3b5998",
  whatsapp: "#128c7e"
};

export default {
  tintColor,
  transparent: "transparent",
  text: "#444",
  text2: "#666",
  listBackground: "#fff",
  tabIconDefault: "#ccc",
  tabIconSelected: tintColor,
  tabBar: "#fefefe",
  errorBackground: "red",
  errorText: "#fff",
  warningBackground: "#EAEB5E",
  warningText: "#666804",
  noticeBackground: tintColor,
  noticeText: "#fff",
  white: "#fff",
  whiteTransparent: "rgba(0,0,0,0.2)",
  ...theme,
  ...social
};
