import React from 'react'
import { GET_POKEMON } from '@/apollo/queries/pokemonQueries';
import { useQuery } from '@apollo/client';
import { Text, useWindowDimensions, View } from 'react-native';
import { NavigationState, SceneRendererProps, TabBar, TabView } from 'react-native-tab-view'
import { colorCommon } from '@/utils/colors';
import PokemonTabStats from './PokemonTabStats';
import PokemonTabEvolution from './PokemonTabEvolution';
import PokemonTabAbout from './PokemonTabAbout';
import Loading from './Loading';
import { fonts } from '@/utils/fonts';

type Route = {
    key: string;
    title: string;
};

type State = NavigationState<Route>;
  
const routes = [
    { key: '1', title: 'About' },
    { key: '2', title: 'Stats' },
    { key: '3', title: 'Evolutions' },
];

const renderTab = (props: SceneRendererProps & { navigationState: State }) => {  
    return (
        <TabBar
            {...props}
            activeColor='white'
            inactiveColor='black'
            indicatorStyle={{ backgroundColor: "white" }}
            style={{ backgroundColor: colorCommon.light.background }}
            tabStyle={{padding: 0, margin: 0}}
        />
    )
}

function PokemonTabView({id, backgroundColor}: {id: string, backgroundColor: string}) {
    const [index, setIndex] = React.useState(0);
    const layout = useWindowDimensions();
    
    const { data, loading, error } = useQuery(GET_POKEMON, {
        variables: { id: id },
        fetchPolicy: 'cache-first',
    });

    if (loading) return <Loading />;
    if (error) return <Text>Error: {error.message}</Text>;

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={({route}) => {
                switch (route.key) {
                    case '1':
                        return <PokemonTabAbout id={id} data={data} />;
                    case '2':
                        return <PokemonTabStats data={data} />;
                    case '3':
                        return <PokemonTabEvolution data={data} />;
                    default:
                        return null;
                }
            }}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            commonOptions={{
                label: ({ route, labelText, color, focused }) => (
                    <View style={{backgroundColor: focused ? backgroundColor : "white", paddingHorizontal: 20, paddingVertical: 5, borderRadius: 30}}>
                        <Text style={{ color, margin: 0, fontFamily: fonts.primary.medium }}>{labelText ?? route.title}</Text>
                    </View>
                ),
            }}
            renderTabBar={renderTab}
        />
    )
}

export default PokemonTabView;