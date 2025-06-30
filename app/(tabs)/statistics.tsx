import { View, Text, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import { colors, radius, spacingY } from "@/constants/theme";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { scale, verticalScale } from "@/utils/styling";
import { BarChart } from "react-native-gifted-charts";
import { enableScreens } from "react-native-screens";
import Typo from "@/components/Typo";
import LoadingComponent from "@/components/LoadingComponent";
import { useAuth } from "@/context/authContext";
import { fetchWeeklyStats } from "@/services/transactionService";

const Statistics = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const { user } = useAuth();

  const [chartData, setChartData] = useState([
    {
      value: 40,
      label: "Mon",
      spacing: scale(4),
      labelWidth: scale(30),
      frontColor: colors.primary,
      // topLabelComponent: () => (
      //   <Typo size={10}fontWeight={"medium"}>
      //     50
      //   </Typo>
      // ),
    },
    {
      value: 20,
      frontColor: colors.rose,
    },

    {
      value: 20,
      label: "Tues",
      spacing: scale(4),
      labelWidth: scale(30),
      frontColor: colors.primary,
    },
    {
      value: 10,
      frontColor: colors.rose,
    },

    {
      value: 50,
      label: "Wed",
      spacing: scale(4),
      labelWidth: scale(30),
      frontColor: colors.primary,
    },
    {
      value: 20,
      frontColor: colors.rose,
    },

    {
      value: 35,
      label: "Thu",
      spacing: scale(4),
      labelWidth: scale(30),
      frontColor: colors.primary,
    },
    {
      value: 20,
      frontColor: colors.rose,
    },

    {
      value: 20,
      label: "Fri",
      spacing: scale(4),
      labelWidth: scale(30),
      frontColor: colors.primary,
    },
    {
      value: 40,
      frontColor: colors.rose,
    },

    {
      value: 55,
      label: "Sat",
      spacing: scale(4),
      labelWidth: scale(30),
      frontColor: colors.primary,
    },
    {
      value: 35,
      frontColor: colors.rose,
    },

    {
      value: 30,
      label: "Sun",
      spacing: scale(4),
      labelWidth: scale(30),
      frontColor: colors.primary,
    },
    {
      value: 20,
      frontColor: colors.rose,
    },
  ]);

  const [chartLoading, setChartLoading] = useState(false);

  useEffect(() => {
    if (activeIndex == 0) {
      getWeeklyStats();
    }
    if (activeIndex == 1) {
      getMonthlyStats();
    }
    if (activeIndex == 2) {
      getYearlyStats();
    }
  }, [activeIndex]);

  const getWeeklyStats = async () => {};

  const getMonthlyStats = async () => {};

  const getYearlyStats = async () => {};

  return (
    <ScreenWrapper>
      <View className="px-6 py-2 gap-y-3">
        <View>
          <Header title="Statistics" />
        </View>
        <ScrollView
          contentContainerStyle={{
            gap: spacingY._20,
            paddingTop: spacingY._5,
            paddingBottom: verticalScale(100),
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Segmented View */}
          <SegmentedControl
            appearance="dark"
            activeFontStyle={{
              fontSize: verticalScale(13),
              fontWeight: "bold",
              color: colors.black,
            }}
            style={{ height: 36 }}
            fontStyle={{
              color: colors.white,
            }}
            tintColor={colors.neutral200}
            backgroundColor={colors.neutral800}
            values={["Weekly", "Monthly", "Yearly"]}
            selectedIndex={activeIndex}
            onChange={(event) => {
              setActiveIndex(event.nativeEvent.selectedSegmentIndex);
            }}
          />

          <View
            style={{
              position: "relative",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {chartData.length > 0 ? (
              <BarChart
                data={chartData}
                barWidth={scale(12)}
                spacing={[1, 2].includes(activeIndex) ? scale(20) : scale(16)}
                roundedTop
                roundedBottom
                hideRules
                yAxisLabelPrefix="$"
                xAxisThickness={0}
                yAxisThickness={0}
                yAxisLabelWidth={
                  [1, 2].includes(activeIndex) ? scale(35) : scale(35)
                }
                yAxisTextStyle={{ color: colors.neutral300 }}
                xAxisLabelTextStyle={{
                  color: colors.neutral300,
                  fontSize: verticalScale(12),
                }}
                noOfSections={4}
                minHeight={5}
                // isAnimated
                // animationDuration={1000}
              />
            ) : (
              <View
                style={{
                  backgroundColor: "rgba(0, 0, 0.6)",
                  height: verticalScale(20),
                }}
              />
            )}
            {chartLoading && (
              <View
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  borderRadius: radius._12,
                  backgroundColor: "rgba(0, 0, 0.6)",
                }}
              >
                <LoadingComponent color={colors.white} />
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Statistics;
