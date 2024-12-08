import { formatPokemonId } from '@/helpers/pokemon';
import { colors, colorsTag } from '@/utils/colors';
import { snakeCaseToTitleCase } from '@/utils/string'
import React from 'react'
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native'
import ImgPokeball from '@/assets/images/pokeball.png';
import Tag from './tag';

interface Props {
    id: string;
    name: string;
    pokemon_v2_pokemons: {
        pokemon_v2_pokemontypes: {
            pokemon_v2_type: {
                name: string
            }
        }[]
    }[]
}

type ColorType = keyof typeof colors;

const PNG_IMAGE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

const PokemonCard = ({id, name, pokemon_v2_pokemons}: Props) => {
    const pokemonType = pokemon_v2_pokemons[0].pokemon_v2_pokemontypes.map((pokeType) => pokeType.pokemon_v2_type.name);
    const styles = createDynamicStyles(pokemonType[0] as ColorType);

    return (
        <View style={styles.container}>
            <Text style={styles.pokemonId}>#{formatPokemonId(id)}</Text>
            <Text style={styles.pokemonName}>{snakeCaseToTitleCase(name)}</Text>
            <View style={{flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: 8}}>
                <ImageBackground
                    resizeMode="contain"
                    style={{width: 100, height: 100}}
                    source={ImgPokeball}
                >
                    <Image
                        src={`${PNG_IMAGE_URL}/${id}.png`}
                        style={{ height: 100, width: 100 }}
                        resizeMode="contain"
                    />
                </ImageBackground>
            </View>
            <View>
                <Text style={styles.pokemonTypeTitle}>Type:</Text>
                <View style={styles.row}>
                    {pokemonType.map((pokeType) => (
                        <Tag key={pokeType} pokeType={pokeType}/>
                    ))}
                </View>
            </View>
        </View>
    )
}

export default PokemonCard;

const createDynamicStyles = (type: ColorType) => {
    return StyleSheet.create({
        container : {
            flex: 1,
            maxWidth: '48%',
            paddingVertical: 12,
            paddingHorizontal: 10,
            borderRadius: 8,
            backgroundColor: colors[type] || colors.undefined
        },
        wrapper: {
            flexDirection: 'row',  
            justifyContent: 'space-between'
        },
        textContainer: {
            flexDirection: 'column', 
            justifyContent: 'space-between'
        },
        pokemonName: {
            textAlign: "center",
            fontSize: 18, 
            fontWeight: '600',
            color: '#FFFFFF',
            fontFamily: "poppinsBold",
        },
        pokemonId: {
            fontSize: 14,
            color: '#FFFFFF',
            textAlign: 'right',
            fontWeight: "bold",
            fontFamily: "poppinsMedium",
        },
        pokemonTypeTitle: {
            textAlign: "center",
            fontSize: 14,
            color: '#FFFFFF',
            fontWeight: "bold",
            fontFamily: "poppinsMedium",
        },
        row: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
        }
    });
}