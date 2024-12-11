import { gql, useQuery } from "@apollo/client";
import PokemonCard from "@/components/pokemon-card";
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Filter from "@/components/filter";

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

  // START
  const sheetRef = useRef<BottomSheet>(null);
  const generations = useMemo(
    () =>
      [
        { id: 1, name: "Gen I", select: false },
        { id: 2, name: "Gen II", select: false },
        { id: 3, name: "Gen III", select: false },
        { id: 4, name: "Gen IV", select: false },
        { id: 5, name: "Gen V", select: false },
        { id: 6, name: "Gen VI", select: false },
        { id: 7, name: "Gen VII", select: false },
        { id: 8, name: "Gen VIII", select: false },
        { id: 9, name: "Gen IX", select: false },
      ],
    []
  );
  const snapPoints = useMemo(() => ["40%"], []);

  // callbacks
  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
  }, []);
  const handleSnapPress = useCallback((index) => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  // render
  

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

  const renderItem = useCallback(
    ({item}) => {
      return (<View style={{paddingHorizontal: 20, paddingVertical: 10}}>
        <Text style={{fontFamily: "poppins"}}>{item.name}</Text>
      </View>)
    },
    []
  );

  const handleCloseSheet = () => {
    sheetRef.current?.close();
};
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
          <Filter text="Any Generations" handlePress={() => handleSnapPress(0)} />
          <Filter text="Any Types"  handlePress={() => handleSnapPress(0)}/>
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
        onChange={handleSheetChange}
        backdropComponent={renderBackdrop}
      >
        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomWidth: 1, borderColor: "#f2f2f2", paddingHorizontal: 20, paddingVertical: 10}}>
          <Text style={{fontFamily: "poppins"}}>Filter Generation</Text>
          <Text>Apply</Text>
        </View>
        <BottomSheetFlatList
          data={generations}
          renderItem={renderItem}
        />
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