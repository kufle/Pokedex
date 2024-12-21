import { GET_POKEMON } from '@/apollo/queries/pokemonQueries';
import { useQuery } from '@apollo/client';
import React from 'react'
import { Text, useWindowDimensions, View } from 'react-native';
import { NavigationState, SceneMap, SceneRendererProps, TabBar, TabView } from 'react-native-tab-view'

type Route = {
    key: string;
    title: string;
};

type State = NavigationState<Route>;

const FirstRoute = React.memo(({data}) => {
    console.log(data.pokemon_v2_pokemonspecies[0])
    return (
        <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
            <Text>{JSON.stringify(data.pokemon_v2_pokemonspecies[0].base_happiness)}</Text>
        </View>
    )
});
  
const SecondRoute = React.memo(() => (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <Text>Second Screen</Text>
    </View>
));
  
const routes = [
    { key: '1', title: 'About' },
    { key: '2', title: 'Stat' },
    { key: '3', title: 'Evolution' },
];

const renderTab = (props: SceneRendererProps & { navigationState: State }) => {  
    return (
        <TabBar
            {...props}
            activeColor='blue'
            inactiveColor='black'
            indicatorStyle={{ backgroundColor: 'blue' }}
            style={{ backgroundColor: 'white'}}
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
                        return <FirstRoute data={data} />;
                    case '2':
                        return <SecondRoute />;
                    case '3':
                        return <SecondRoute />;
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

export default PokemonTabView