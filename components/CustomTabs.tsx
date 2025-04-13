import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { colors, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function CustomTabs({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const tabBarIcons: any = {
    index: (isfocused: boolean) => (
      <Ionicons
        name={isfocused ? "home" : "home-outline"}
        size={verticalScale(24)}
        color={isfocused ? colors.primary : colors.neutral400}
      />
    ),

    statistics: (isfocused: boolean) => (
      <Ionicons
        name={isfocused ? "bar-chart" : "bar-chart-outline"}
        size={verticalScale(24)}
        color={isfocused ? colors.primary : colors.neutral400}
      />
    ),

    wallet: (isfocused: boolean) => (
      <Ionicons
        name={isfocused ? "wallet" : "wallet-outline"}
        size={verticalScale(24)}
        color={isfocused ? colors.primary : colors.neutral400}
      />
    ),

    profile: (isfocused: boolean) => (
      <Ionicons
        name={isfocused ? "person" : "person-outline"}
        size={verticalScale(24)}
        color={isfocused ? colors.primary : colors.neutral400}
      />
    ),
  };

  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label: string =
          options.tabBarLabel !== undefined
            ? (options.tabBarLabel as string)
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            activeOpacity={0.8}
            key={route.name}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabbarbutton}
          >
            {tabBarIcons[route.name] && tabBarIcons[route.name](isFocused)}
            {/* <Text
              style={{ color: isFocused ? colors.primary : colors.neutral400 }}
            >
              {label}
            </Text> */}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    flexDirection: "row",
    width: "100%",
    height: Platform.OS === "ios" ? verticalScale(72) : verticalScale(58),
    backgroundColor: colors.neutral800,
    justifyContent: "space-around",
    alignItems: "center",
    borderTopColor: colors.neutral700,
    borderTopWidth: 1,
  },
  tabbarbutton: {
    marginBottom: Platform.OS === "ios" ? spacingY._10 : spacingY._5,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
});
