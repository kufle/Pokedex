import { ScrollView, StyleSheet, Text, View } from "react-native";
import TextValue from "./TextValue";
import Gap from "./Gap";
import { globalStyles } from "@/utils/globalStyle";
import { snakeCaseToTitleCase } from "@/utils/string";
import { colorCommon } from "@/utils/colors";
import React, { useMemo } from "react";
import convertValues from "@/utils/convertValues";
import getPokemonGenderStats from "@/utils/getPokemonGenderStats";
import { fonts } from "@/utils/fonts";

interface Props {
    id: string;
    data: {
        pokemon_v2_pokemonspecies: {
            hatch_counter: number;
            gender_rate: number;
            capture_rate: number;
            base_happiness: number;
            pokemon_v2_pokemonspeciesflavortexts: {
                flavor_text: string;
            }[];
            pokemon_v2_pokemonspeciesnames: {
                genus: string
            }[]
            pokemon_v2_pokemonhabitat: {
                name: string;
            },
            pokemon_v2_pokemons: {
                height: number;
                weight: number;
                base_experience: number;
                pokemon_v2_pokemonstats: {
                    effort: number;
                    pokemon_v2_stat: {
                        name: string;
                    }
                }[]
            }[],
            pokemon_v2_growthrate: {
                name: string;
            },
            pokemon_v2_pokemonegggroups: {
                pokemon_v2_egggroup: {
                    pokemon_v2_egggroupnames: {
                        name: string;
                    }[]
                }
            }[]
        }[]
    }
}

const PokemonTabAbout = React.memo(({id, data}: Props) => {
    const { 
        hatch_counter,
        gender_rate,
        pokemon_v2_pokemonspeciesflavortexts, 
        pokemon_v2_pokemonspeciesnames, 
        pokemon_v2_pokemonhabitat,
        pokemon_v2_pokemons,
        capture_rate,
        base_happiness,
        pokemon_v2_growthrate,
        pokemon_v2_pokemonegggroups
    } = data.pokemon_v2_pokemonspecies[0];

    const pokemonFormatted = useMemo(() => {
        return {
            heightInMeters: convertValues.decimeterToMeter(pokemon_v2_pokemons[0].height),
            heightInFeet: convertValues.decimeterToFeet(pokemon_v2_pokemons[0].height),
            weightInKilograms: convertValues.hectogramsToKilograms(pokemon_v2_pokemons[0].weight),
            weightInPounds: convertValues.hectogramsToPounds(pokemon_v2_pokemons[0].weight),
            pokemonGendersRate: getPokemonGenderStats(gender_rate).map((gender) => `${gender?.rate + "% "}${gender.gender}` ).join(", "),
            eggGroup: pokemon_v2_pokemonegggroups.map((eggGroup) => eggGroup.pokemon_v2_egggroup.pokemon_v2_egggroupnames[0].name).join(", "),
            ev_yield: pokemon_v2_pokemons[0].pokemon_v2_pokemonstats.filter((stat) => stat.effort > 0).map((stat) => `${stat.effort} ${snakeCaseToTitleCase(stat.pokemon_v2_stat.name)}`).join(", "),
        }
    }, [id]);

    return (
        <View style={styles.containter}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{marginVertical: 15, paddingHorizontal: 16}}>
                    <Text style={globalStyles.paraghraph}>{pokemon_v2_pokemonspeciesflavortexts[0].flavor_text.replace(/\n|\f/g, ' ')}</Text>
                    <Text style={styles.sectionHeader}>Pokédex data</Text>
                    <TextValue label="Species" value={pokemon_v2_pokemonspeciesnames[0]?.genus} />
                    <TextValue label="Habitat" value={snakeCaseToTitleCase(pokemon_v2_pokemonhabitat?.name || "")} />
                    <TextValue label="Height" value={`${pokemonFormatted.heightInMeters} m (${pokemonFormatted.heightInFeet}) ft`} />
                    <TextValue label="Weight" value={`${pokemonFormatted.weightInKilograms} kg (${pokemonFormatted.weightInPounds}) lbs`} />

                    <Gap height={10} />
                    <Text style={styles.sectionHeader}>Training</Text>
                    <TextValue label="EV Yield" value={pokemonFormatted.ev_yield} />
                    <TextValue label="Catch rate" value={capture_rate} />
                    <TextValue label="Base Friendship" value={base_happiness} />
                    <TextValue label="Base Exp." value={pokemon_v2_pokemons[0].base_experience} />
                    <TextValue label="Growth Rate" value={snakeCaseToTitleCase(pokemon_v2_growthrate?.name)} />
                    <Gap height={10} />
                    <Text style={styles.sectionHeader}>Breeding</Text>
                    <TextValue label="Egg Groups" value={pokemonFormatted.eggGroup} />
                    <TextValue label="Gender Rate" value={pokemonFormatted.pokemonGendersRate} />
                    <TextValue label="Egg cycles" value={hatch_counter} />
                </View>
            </ScrollView>
        </View>
    )
});

export default PokemonTabAbout;

const styles = StyleSheet.create({
    containter: {
        flex: 1, 
        backgroundColor: colorCommon.light.background,
    },
    sectionHeader:  {
        fontSize: 16, 
        fontFamily: fonts.primary.bold,
        color: "#333333"
    }
});