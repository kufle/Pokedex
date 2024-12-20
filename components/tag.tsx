import { colorsTag } from '@/utils/colors';
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

type ColorType = keyof typeof colorsTag;

interface Props {
    pokeType: string;
}

function Tag({pokeType}: Props) {
    const styles = createDynamicStyles(pokeType as ColorType);
    return (
        <View style={styles.pokemonTag}>
            <Text style={styles.pokemonType}>{pokeType}</Text>
        </View>
    )
}

export default Tag;

const createDynamicStyles = (type: ColorType) => {
    return StyleSheet.create({
        pokemonType: {
            //textAlign: "center",
            fontSize: 12,
            textTransform: "capitalize",
            color: '#FFFFFF',
            fontFamily: "poppins",
        },
        pokemonTag: {
            backgroundColor: colorsTag[type],
            flexDirection: "row",
            marginHorizontal: 3,
            marginTop: 8,
            paddingVertical: 2,
            paddingHorizontal: 10,
            borderRadius: 15,
            alignItems: "center",
            justifyContent: "center"
        }
    });
}
