import { GET_POKEMON } from '@/apollo/queries/pokemonQueries';
import { useQuery } from '@apollo/client';
import React, { useMemo } from 'react'
import { Dimensions, FlatList, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { NavigationState, SceneRendererProps, TabBar, TabView } from 'react-native-tab-view'
import TextValue from './TextValue';
import getPokemonGenderStats from '@/utils/getPokemonGenderStats';
import convertValues from '@/utils/convertValues';
import { snakeCaseToTitleCase } from '@/utils/string';
import Gap from './Gap';
import { colorCommon } from '@/utils/colors';
import { globalStyles } from '@/utils/globalStyle';
import { statisticShortName } from '@/utils/statisticShortName';
import { getMinMaxStat } from '@/utils/getMinMaxStat';
import PokemonTabStats from './PokemonTabStats';
import PokemonTabEvolution from './PokemonTabEvolution';

const { width } = Dimensions.get("window");

type Route = {
    key: string;
    title: string;
};

type State = NavigationState<Route>;

const FirstRoute = React.memo(({id, data}) => {
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
                    <TextValue label="Species" value={pokemon_v2_pokemonspeciesnames[0].genus} />
                    <TextValue label="Habitat" value={snakeCaseToTitleCase(pokemon_v2_pokemonhabitat.name)} />
                    <TextValue label="Height" value={`${pokemonFormatted.heightInMeters} m (${pokemonFormatted.heightInFeet}) ft`} />
                    <TextValue label="Weight" value={`${pokemonFormatted.weightInKilograms} kg (${pokemonFormatted.weightInPounds}) lbs`} />

                    <Gap height={10} />
                    <Text style={styles.sectionHeader}>Training</Text>
                    <TextValue label="EV Yield" value={pokemonFormatted.ev_yield} />
                    <TextValue label="Catch rate" value={capture_rate} />
                    <TextValue label="Base Friendship" value={base_happiness} />
                    <TextValue label="Base Exp." value={pokemon_v2_pokemons[0].base_experience} />
                    <TextValue label="Growth Rate" value={snakeCaseToTitleCase(pokemon_v2_growthrate.name)} />
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



const ThirdRoute = React.memo(() => (
    <View style={{ flex: 1 }}>
        <Text>Second Screen</Text>
    </View>
));
  
const routes = [
    { key: '1', title: 'About' },
    { key: '2', title: 'Stats' },
    { key: '3', title: 'Evolution' },
];

const renderTab = (props: SceneRendererProps & { navigationState: State }) => {  
    return (
        <TabBar
            {...props}
            activeColor='blue'
            inactiveColor='black'
            indicatorStyle={{ backgroundColor: 'blue' }}
            style={{ backgroundColor: colorCommon.light.background }}
        />
    )
}

function PokemonTabView({id}: {id: string}) {
    const [index, setIndex] = React.useState(0);
    const layout = useWindowDimensions();
    
    const { data, loading, error } = useQuery(GET_POKEMON, {
        variables: { id: id },
        fetchPolicy: 'cache-first',
    });

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error.message}</Text>;

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={({route}) => {
                switch (route.key) {
                    case '1':
                        return <FirstRoute id={id} data={data} />;
                    case '2':
                        return <PokemonTabStats id={id} data={data} />;
                    case '3':
                        return <PokemonTabEvolution id={id} data={data} />;
                    default:
                        return null;
                }
            }}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            commonOptions={{
                label: ({ route, labelText, color }) => (
                    <Text style={{ color, margin: 0, fontFamily: "poppins" }}>{labelText ?? route.name}</Text>
                )
            }}
            renderTabBar={renderTab}
        />
    )
}

export default PokemonTabView;

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