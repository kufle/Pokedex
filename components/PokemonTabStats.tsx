import { getMinMaxStat } from "@/utils/getMinMaxStat";
import { statisticShortName } from "@/utils/statisticShortName";
import React from "react";
import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import PokemonStatItem from "./PokemonStatItem";
import { colorCommon } from "@/utils/colors";
import Gap from "./Gap";
import { snakeCaseToTitleCase } from "@/utils/string";
import { globalStyles } from '@/utils/globalStyle';

const { width } = Dimensions.get("window");

const PokemonTabStats = React.memo(({id, data}) => {
    const { 
        pokemon_v2_pokemonstats,
        pokemon_v2_pokemonabilities
    } = data.pokemon_v2_pokemonspecies[0].pokemon_v2_pokemons[0];

    return (
        <View style={{marginVertical: 15, paddingHorizontal: 16}}>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={pokemon_v2_pokemonstats}
                keyExtractor={(item) => item.pokemon_v2_stat.name}
                renderItem={({ item }) => {
                    const {minStat, maxStat} = getMinMaxStat(item.pokemon_v2_stat.name, item.base_stat);
                    const percentageWidth = (item.base_stat * 100) / 150
                    return (
                        <PokemonStatItem 
                            width={width} 
                            stat={item} 
                            minStat={minStat} 
                            maxStat={maxStat} 
                            percentageWidth={percentageWidth}
                        />
                    )
                }}
                ListFooterComponent={
                    <>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5}}>
                            <Text style={{textAlign: "left", width: width * 0.23, fontFamily: "poppins", color: colorCommon.light.text}}>Total</Text>
                            <Text style={{textAlign: "right", width: width * 0.09, color: colorCommon.light.text}}>{pokemon_v2_pokemonstats.reduce((total: number, stat: number) => total + stat.base_stat, 0)}</Text>
                            <View style={{flexGrow: 1}}></View>
                            <Text style={{textAlign: "right", width: width * 0.2, fontFamily: "poppins", color: colorCommon.light.text}}>Min-Max</Text>
                        </View>
                        <Gap height={10} />
                        <Text style={styles.sectionHeader}>Abilities</Text>
                        <View>
                            {pokemon_v2_pokemonabilities.map((ability, index) => (
                                <View style={{marginBottom: 7}} key={ability.pokemon_v2_ability.name}>
                                    <Text style={{fontFamily: "poppinsMedium", fontSize: 16, textAlign: "justify"}}>{snakeCaseToTitleCase(ability.pokemon_v2_ability.name)}</Text>
                                    <Text style={globalStyles.paraghraph}>{ability.pokemon_v2_ability.pokemon_v2_abilityeffecttexts[0].short_effect}</Text>
                                </View>
                            ))}
                        </View>
                    </>
                }
            />
        </View>
    );
});

export default PokemonTabStats;

const styles = StyleSheet.create({
    containter: {
        flex: 1, 
        backgroundColor: colorCommon.light.background,
    },
    sectionHeader:  {
        fontSize: 16, 
        fontFamily: "poppinsBold",
        color: "#333333"
    }
});