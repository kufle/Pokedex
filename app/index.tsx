import { gql, useQuery } from "@apollo/client";
import PokemonCard from "@/components/pokemon-card";
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Filter from "@/components/filter";
import BottomSheetList from "@/components/bottom-sheetlist";
import useBottomListSheet from "@/hooks/useBottomListSheet";
import { generations } from "@/data/generations";
import { pokemonTypes } from "@/data/pokemon-types";

const LIMIT = 6;
const INITIAL_FILTER = { name: '', generationId: 0, typeId: 0 };

const query = gql`
  query Pokemons($name: String!, $offset: Int!, $limit: Int!) {
    pokemon_v2_pokemonspecies(
      order_by: { id: asc }
      offset: $offset
      where: {
        name: { _ilike: $name }
        ${INITIAL_FILTER.generationId ? `generation_id: { _eq: ${INITIAL_FILTER.generationId} }` : ''}
        ${
          INITIAL_FILTER.typeId
            ? `pokemon_v2_pokemons: { pokemon_v2_pokemontypes: { type_id: { _eq: ${INITIAL_FILTER.typeId} } } }`
            : ''
        }
      }
      limit: $limit
    ) {
      id
      name
      pokemon_v2_pokemons {
        pokemon_v2_pokemontypes {
          pokemon_v2_type {
            name
          }
        }
      }
    }
  }
`

export default function Index() {
  const [offset, setOffset] = useState(0);
  const [pokemons, setPokemons] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');
  const [currentFilterData, setCurrentFilterData] = useState([]);

  // START

  // render
  const {sheetRef, handleSnapPress} = useBottomListSheet();

  // renders
	const renderBackdrop = useCallback(
		(props) => (
			<BottomSheetBackdrop
				{...props}
				disappearsOnIndex={-1}
				appearsOnIndex={0}
			/>
		),
		[]
	);

  const snapPoints = useMemo(() => ["40%"], []);
  // END

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
      setOffset(0); // Reset offset setiap kali search berubah
      setPokemons([]); // Clear current data
      setHasMore(true); // Reset pagination
    }, 500); // 500ms debounce time

    return () => {
      clearTimeout(handler); // Clear timeout jika user mengetik sebelum 500ms
    };
  }, [searchText]);

  const {loading, data, error, fetchMore} = useQuery(query, {
    variables: {name: `%${debouncedSearchText}%`, offset: offset, limit: LIMIT},
    onCompleted: (data) => {
      console.log("Di fetch")
      console.log(data)
      setPokemons((prev) => [...prev, ...data.pokemon_v2_pokemonspecies]);
    }
  });

  const loadMoreData = () => {
    if (!loading) {
      fetchMore({
        variables: {name: `%${debouncedSearchText}%`, offset: offset + LIMIT, limit: LIMIT},
        updateQuery: (prevResult, { fetchMoreResult}) => {
          console.log("refetch")
          if (!fetchMoreResult) return prevResult;
          if (fetchMoreResult.pokemon_v2_pokemonspecies.length < LIMIT) {
            setHasMore(false);
          }
          return {
            pokemon_v2_pokemonspecies: [
              ...prevResult.pokemon_v2_pokemonspecies,
              ...fetchMoreResult.pokemon_v2_pokemonspecies,
            ]
          }
        }
      })
      setOffset((prevOffset) => prevOffset + LIMIT);
    }
  }

  const handleFilterPress = (filterType: string) => {
    if (filterType === "generations") {
      setCurrentFilterData(generations);
    } else if (filterType === "types") {
      setCurrentFilterData(pokemonTypes);
    }
    handleSnapPress(0);
  }
  
  return (
    <GestureHandlerRootView>
    <View style={{ flex: 1, paddingHorizontal: 16, flexDirection: "column", backgroundColor: "#FFFFFF"}}>
      <View style={{paddingBottom: 15}}>
        <Text style={{fontSize: 28, fontFamily: "poppinsBold"}}>Pokédex</Text>
        <Text style={{fontFamily: "poppins", fontSize: 14}}>Search for Pokémon by name.</Text>
        
        <View style={{flexDirection: "row", alignItems: "center", padding: 2, backgroundColor: "#f2f2f2", borderRadius: 10}}>
          <Ionicons name="search-outline" size={24} color="#ccc" style={{paddingHorizontal: 5}} />
          <TextInput placeholder="What Pokémon are you looking for?" style={{ flex: 1, backgroundColor: "#f2f2f2", borderRadius: 10, fontFamily: "poppins"}} onChangeText={(text) => setSearchText(text)} value={searchText} />
        </View>
        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10, gap: 10}}>
          <Filter text="Any Generations" handlePress={() => handleFilterPress("generations")} />
          <Filter text="Any Types"  handlePress={() => handleFilterPress("types")}/>
        </View>
       {/*  */}
      </View>
      <FlatList
        numColumns={2}
        showsVerticalScrollIndicator={false}
        data={pokemons}
        contentContainerStyle={{gap: 15, paddingBottom: 12}}
        columnWrapperStyle={{flex: 0.5, justifyContent: "space-between"}}
        keyExtractor={(item, index) => `${item.id}-index-${index}`}
        renderItem={({item}) => <PokemonCard {...item}/> }
        onEndReached={loadMoreData}
        ListFooterComponent={
          hasMore ? <ActivityIndicator /> : <Text>No more data</Text>
        }
      />

      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
      >
        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomWidth: 1, borderColor: "#f2f2f2", paddingHorizontal: 20, paddingVertical: 10}}>
          <Text style={{fontFamily: "poppinsBold"}}>Filter Generation</Text>
          <Text style={{fontFamily: "poppinsBold"}}>Apply</Text>
        </View>
        <BottomSheetList data={currentFilterData} />
      </BottomSheet>
    </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "white",
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: "#eee",
  },
});