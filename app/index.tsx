import { gql, useQuery } from "@apollo/client";
import PokemonCard from "@/components/pokemon-card";
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Filter from "@/components/filter";
import BottomSheetList from "@/components/bottom-sheetlist";
import useBottomListSheet from "@/hooks/useBottomListSheet";
import { generations } from "@/data/generations";
import { pokemonTypes } from "@/data/pokemon-types";
import { GenerationType, PokemonSpecies, TypesType } from "@/types/pokemonTypes";

const LIMIT = 6;
const INITIAL_FILTER = { name: '', generationId: 0, typeId: 0 };

const buildQuery = (appliedFilter: AppliedFilterType) => {
  console.log("ini dipanggil berapa kali", appliedFilter)
  return gql`
    query Pokemons($name: String!, $offset: Int!, $limit: Int!, $generationId: [Int], $typeId: [Int]) {
      pokemon_v2_pokemonspecies(
        order_by: { id: asc }
        offset: $offset
        where: {
          name: { _ilike: $name },
          ${appliedFilter.generationId && appliedFilter.generationId.length > 0 ? `generation_id: { _in: $generationId },` : ''}
          ${
            appliedFilter.typeId && appliedFilter.typeId.length > 0
              ? `pokemon_v2_pokemons: { pokemon_v2_pokemontypes: { type_id: { _in: $typeId } } }`
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
}

interface AppliedFilterType {
  generationId: number[];
  typeId: number[];
}

export default function Index() {
  const [offset, setOffset] = useState(0);
  const [pokemons, setPokemons] = useState<PokemonSpecies[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');
  const [currentFilter, setCurrentFilter] = useState("");
  const [currentFilterData, setCurrentFilterData] = useState<{ id: number; name: string; }[]>([]);
  const [selectedGeneration, setSelectedGeneration] = useState<GenerationType[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<TypesType[]>([]);
  const [appliedFilter, setAppliedFilter] = useState<AppliedFilterType>({
    generationId: [],
    typeId: []
  });
  // START

  // render
  const {sheetRef, handleSnapPress} = useBottomListSheet();

  // renders
	const renderBackdrop = useCallback(
		(props: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop
				{...props}
				disappearsOnIndex={-1}
				appearsOnIndex={0}
			/>
		),
		[]
	);

  const snapPoints = useMemo(() => ["40%"], []);

  const memoizedFilterData = useMemo<{ id: number; name: string; }[]>(() => currentFilterData, [currentFilterData]);
  // const memoizedCurrentFilter = useMemo(() => currentFilter, [currentFilter]);
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

  useEffect(() => {
    setDebouncedSearchText(searchText);
    setOffset(0); // Reset offset setiap kali search berubah
    setPokemons([]); // Clear current data
    setHasMore(true); // Reset pagination
  }, [appliedFilter])

  const {loading, data, error, fetchMore} = useQuery(buildQuery(appliedFilter), {
    variables: {name: `%${debouncedSearchText}%`, offset: offset, limit: LIMIT, generationId: appliedFilter.generationId, typeId: appliedFilter.typeId},
    onCompleted: (data) => {
      console.log("Di fetch")
      //console.log(data)
      setPokemons((prev) => {
        const merged = [...prev, ...data.pokemon_v2_pokemonspecies];
        const unique = Array.from(new Map(merged.map((item) => [item.id, item])).values());
        return unique;
      });
    }
  });

  const loadMoreData = () => {
    if (!loading && hasMore) {
      fetchMore({
        variables: {name: `%${debouncedSearchText}%`, offset: offset + LIMIT, limit: LIMIT, generationId: appliedFilter.generationId, typeId: appliedFilter.typeId},
        updateQuery: (prevResult, { fetchMoreResult}) => {
          console.log("refetch")
          if (!fetchMoreResult) return prevResult;
          if (fetchMoreResult.pokemon_v2_pokemonspecies.length < LIMIT) {
            setHasMore(false);
          }
          const merged = [
            ...prevResult.pokemon_v2_pokemonspecies,
            ...fetchMoreResult.pokemon_v2_pokemonspecies,
          ];
          const unique = Array.from(new Map(merged.map((item) => [item.id, item])).values());
          return { pokemon_v2_pokemonspecies: unique };
        }
      })
      setOffset((prevOffset) => prevOffset + LIMIT);
    }
  }

  const handleFilterPress = (filterType: string) => {
    if (filterType === "generations") {
      setCurrentFilter("generations");
      setCurrentFilterData(generations);
      
    } else if (filterType === "types") {
      setCurrentFilter("types");
      setCurrentFilterData(pokemonTypes);
    }
    //console.log(currentFilter)
    handleSnapPress(0);
  }

  const handleApplyFilters = () => {
    console.log("selectedtypes",selectedTypes)
    setAppliedFilter({
      generationId: selectedGeneration.length > 0 ? selectedGeneration.map((item) => item.id) : [],
      typeId: selectedTypes.length > 0 ? selectedTypes.map((item) => item.id) : [],
    })
    sheetRef.current?.close();
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
          <Filter text={appliedFilter.generationId.length > 0 ? selectedGeneration.map(item => item.name).join(", ") : "All generations"} handlePress={() => handleFilterPress("generations")} />
          <Filter text={appliedFilter.typeId.length > 0 ? selectedTypes.map(item => item.name).join(" ,") : "All Types"}  handlePress={() => handleFilterPress("types")}/>
        </View>
       {/*  */}
      </View>
      <FlatList
        numColumns={2}
        showsVerticalScrollIndicator={false}
        data={pokemons}
        contentContainerStyle={{gap: 15, paddingBottom: 12}}
        columnWrapperStyle={{flex: 0.5, justifyContent: "space-between"}}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item}) => <PokemonCard key={item.id} id={item.id.toString()} name={item.name} pokemon_v2_pokemons={item.pokemon_v2_pokemons || []} /> }
        onEndReached={loadMoreData}
        initialNumToRender={10}
        maxToRenderPerBatch={6}
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
        animateOnMount={false}
      >
        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomWidth: 1, borderColor: "#f2f2f2", paddingHorizontal: 20, paddingVertical: 10}}>
          <Text style={{fontFamily: "poppinsBold", textAlign: "left"}}>Filter {currentFilter}</Text>
          <TouchableOpacity onPress={handleApplyFilters} style={{paddingVertical: 0, paddingHorizontal: 15}}>
              <Text style={{fontFamily: "poppinsBold", color: "black", textAlign: "right"}}>Apply</Text>
          </TouchableOpacity>
        </View>
        <BottomSheetList 
          key={currentFilter}
          data={memoizedFilterData} 
          filterType={currentFilter}
          selectedGeneration={selectedGeneration}
          setSelectedGeneration={setSelectedGeneration}
          selectedTypes={selectedTypes}
          setSelectedTypes={setSelectedTypes}
        />
      </BottomSheet>
    </View>
    </GestureHandlerRootView>
  );
}