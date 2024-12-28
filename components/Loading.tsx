import { fonts } from '@/utils/fonts';
import React from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'

function Loading() {
    return (
        <View style={{flex: 1, flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
            <ActivityIndicator size="large" />
            <Text style={styles.text}>Loading...</Text>
        </View>
    )
}

export default Loading

const styles = StyleSheet.create({
    text: {
      marginTop: 12,
      fontFamily: fonts.primary.medium,
      fontSize: 16,
    },
});