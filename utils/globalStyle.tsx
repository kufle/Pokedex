import { StyleSheet } from "react-native";
import { colorCommon } from "./colors";

export const globalStyles = StyleSheet.create({
    header: {
        fontFamily: "poppinsBold",
        fontSize: 24,
        color: colorCommon.light.text,
    },
    subheader: {
        fontFamily: "poppinsMedium",
        fontSize: 20,
        color: colorCommon.light.text,
    },
    paraghraph: {
        fontFamily: "poppins",
        fontSize: 14,
        color: colorCommon.light.text,
        textAlign: "justify"
    }
})