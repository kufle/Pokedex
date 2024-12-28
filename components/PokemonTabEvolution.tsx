import { PNG_IMAGE_URL } from '@/helpers/constant';
import { colorCommon } from '@/utils/colors';
import { fonts } from '@/utils/fonts';
import { globalStyles } from '@/utils/globalStyle';
import { snakeCaseToTitleCase } from '@/utils/string';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useMemo } from 'react'
import { FlatList, Image, StyleSheet, Text, View } from 'react-native'

interface Props {
    data: {
        pokemon_v2_pokemonspecies: {
            pokemon_v2_evolutionchain: {
                pokemon_v2_pokemonspecies: {
                    id: number;
                    name: string;
                    evolves_from_species_id: null | number;
                    pokemon_v2_pokemonevolutions: {
                        min_level: null | number;
                        pokemon_v2_item: {
                            name: string;
                            pokemon_v2_itemsprites: {
                                sprites: {
                                    default: string;
                                }
                            }[]
                        }
                    }[]
                }[]
            }
        }[]
    }
}

const PokemonTabEvolution = ({data}: Props) => {
    const { 
        pokemon_v2_pokemonspecies
    } = data.pokemon_v2_pokemonspecies[0].pokemon_v2_evolutionchain;

    const getNameFromEvolvesFromId = useMemo(() => {
        return pokemon_v2_pokemonspecies.reduce((map: { [key: number]: string }, species) => {
          map[species.id] = species.name;
          return map;
        }, {});
      }, [pokemon_v2_pokemonspecies]);

    return (
        <View>
            <FlatList
                showsVerticalScrollIndicator={false}
                style={{backgroundColor: colorCommon.light.background}}
                contentContainerStyle={{marginVertical: 10, paddingHorizontal: 10}}
                data={pokemon_v2_pokemonspecies}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) =>(
                    <View style={{flex: 1}}>
                        {pokemon_v2_pokemonspecies.length < 2 &&  <Text style={[globalStyles.paraghraph, {textAlign: "center"}]}>This pokemon does not have any evolutions</Text> }

                        { item?.evolves_from_species_id && (
                            <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", flex: 1, marginBottom: 20}}>
                                <View>
                                    <Image src={`${PNG_IMAGE_URL}/${item.evolves_from_species_id}.png`} style={{width: 100, height: 100}} />
                                    <Text style={styles.pokemonName}>{snakeCaseToTitleCase(getNameFromEvolvesFromId[item.evolves_from_species_id])}</Text>
                                </View>
                                <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                                    {item.pokemon_v2_pokemonevolutions[0]?.min_level && (<Text style={styles.pokemonLvLabel}>Lv {item.pokemon_v2_pokemonevolutions[0]?.min_level}</Text>)}
                                    {item.pokemon_v2_pokemonevolutions[0]?.pokemon_v2_item && (
                                        <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                                            <Text style={styles.pokemonLvLabel}>{snakeCaseToTitleCase(item.pokemon_v2_pokemonevolutions[0]?.pokemon_v2_item?.name || "")}</Text>
                                            <Image src={item.pokemon_v2_pokemonevolutions[0]?.pokemon_v2_item?.pokemon_v2_itemsprites[0]?.sprites.default} style={{width: 30, height: 30}} />
                                        </View>
                                    )}
                                    <MaterialIcons name="arrow-right-alt" size={30} color="black" />
                                </View>
                                <View>
                                    <Image src={`${PNG_IMAGE_URL}/${item.id}.png`} style={{width: 100, height: 100}} />
                                    <Text style={styles.pokemonName}>{snakeCaseToTitleCase(item.name)}</Text>
                                </View>
                            </View>
                        )}
                    </View>
                )}
            />
        </View>
    )
}

export default PokemonTabEvolution

const styles = StyleSheet.create({
    pokemonName: {
        ...globalStyles.paraghraph,
        textAlign: "center",
        fontFamily: fonts.primary.medium,
        marginTop: 5
    },
    pokemonLvLabel:  {
        fontSize: 14, 
        fontFamily: fonts.primary.bold,
        color: colorCommon.light.text
    }
});
