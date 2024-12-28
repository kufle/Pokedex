import { StyleSheet } from "react-native";
import { colorCommon } from "./colors";
import { fonts } from "./fonts";

export const globalStyles = StyleSheet.create({
    header: {
        fontFamily: fonts.primary.bold,
        fontSize: 24,
        color: colorCommon.light.text,
    },
    subheader: {
        fontFamily: fonts.primary.medium,
        fontSize: 20,
        color: colorCommon.light.text,
    },
    paraghraph: {
        fontFamily: fonts.primary.regular,
        fontSize: 14,
        color: colorCommon.light.text,
        textAlign: "justify"
    }
})