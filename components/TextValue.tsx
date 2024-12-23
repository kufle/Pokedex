import React from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get("window");

type Props = {
    label: string;
    value: string | number;
};

function TextValue({label, value}: Props) {
    return (
        <View style={{flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "#f2f2f2"}}>
            <Text style={styles.texLabel}>{label}</Text>
            <Text style={styles.textValue}>{value}</Text>
        </View>
    )
}

export default TextValue;

const styles = StyleSheet.create({
    texLabel:  {
        fontSize: 14, 
        fontFamily: "poppins",
        textAlign: "left", 
        width: width * 0.33,
        color: "#666666"
    },
    textValue: {
        fontSize: 14, 
        fontFamily: "poppins",
        textAlign: "left", 
        flex: 1,
        color: "#666666"
    }
});
