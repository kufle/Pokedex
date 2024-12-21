import { colorsTag } from '@/utils/colors';
import React from 'react'
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import Icon from './Icon';

type ColorType = keyof typeof colorsTag;

interface Props {
    pokeType: string;
    hasIcon?: boolean;
    style?: StyleProp<ViewStyle>;
}

const Tag = React.memo(({pokeType, hasIcon, style}: Props) => {
    const styles = createDynamicStyles(pokeType as ColorType);
    return (
        <View style={[styles.pokemonTag, style]}>
            {hasIcon && (<Icon height={16} width={16} type={pokeType} key={pokeType} style={{marginRight: 5}} />)}
            <Text style={styles.pokemonType}>{pokeType}</Text>
        </View>
    )
});

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
            // marginHorizontal: 3,
            // marginTop: 8,
            // paddingVertical: 2,
            // paddingHorizontal: 10,
            borderRadius: 15,
            alignItems: "center",
            justifyContent: "center"
        }
    });
}
