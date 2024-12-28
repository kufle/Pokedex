import { gql, useQuery } from "@apollo/client";
import PokemonCard from "@/components/PokemonCard";
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { generations } from "@/data/generations";
import { pokemonTypes } from "@/data/pokemon-types";
import { GenerationType, PokemonSpecies, TypesType } from "@/types/pokemonTypes";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import FilterBottomSheet from "@/components/FilterBottomSheet";
import { fonts } from "@/utils/fonts";
import Filter from "@/components/Filter";

const LIMIT = 6;

const buildQuery = (appliedFilter: AppliedFilterType) => {
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

  const actionSheetRef = useRef<ActionSheetRef>(null);

  const memoizedFilterData = useMemo<{ id: number; name: string; }[]>(() => currentFilterData, [currentFilterData]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
      setOffset(0); // Reset offset when search input change
      setPokemons([]); // Clear current data
      setHasMore(true); // Reset pagination
    }, 500); // 500ms debounce time

    return () => {
      clearTimeout(handler); // Clear timeout when user type before 500ms
    };
  }, [searchText]);

  useEffect(() => {
    setDebouncedSearchText(searchText);
    setOffset(0); // Reset offset when search input change
    setPokemons([]); // Clear current data
    setHasMore(true); // Reset pagination
  }, [appliedFilter])

  const {loading, data, error, fetchMore} = useQuery(buildQuery(appliedFilter), {
    variables: {name: `%${debouncedSearchText}%`, offset: offset, limit: LIMIT, generationId: appliedFilter.generationId, typeId: appliedFilter.typeId},
    onCompleted: (data) => {
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
    actionSheetRef.current?.show();
  }

  const handleApplyFilters = () => {
    setAppliedFilter({
      generationId: selectedGeneration.length > 0 ? selectedGeneration.map((item) => item.id) : [],
      typeId: selectedTypes.length > 0 ? selectedTypes.map((item) => item.id) : [],
    })
    actionSheetRef.current?.hide();
  }
  
  return (
    <GestureHandlerRootView>
    <View style={{ flex: 1, paddingHorizontal: 16, flexDirection: "column", backgroundColor: "#FFFFFF"}}>
      <View style={{paddingBottom: 15}}>
        <Text style={{fontSize: 28, fontFamily: fonts.primary.bold}}>Pokédex</Text>
        <Text style={{fontFamily: fonts.primary.regular, fontSize: 14}}>Search for Pokémon by name.</Text>
        <View style={{flexDirection: "row", alignItems: "center", padding: 2, backgroundColor: "#f2f2f2", borderRadius: 10}}>
          <Ionicons name="search-outline" size={24} color="#ccc" style={{paddingHorizontal: 5}} />
          <TextInput placeholder="What Pokémon are you looking for?" style={{ flex: 1, backgroundColor: "#f2f2f2", borderRadius: 10, fontFamily: fonts.primary.regular}} onChangeText={(text) => setSearchText(text)} value={searchText} />
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
        onEndReachedThreshold={0.1}
        initialNumToRender={10}
        maxToRenderPerBatch={6}
        ListFooterComponent={
          hasMore ? <ActivityIndicator /> : <Text>No more data</Text>
        }
      />

      <ActionSheet ref={actionSheetRef} containerStyle={{height: "40%"}}>
        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomWidth: 1, borderColor: "#f2f2f2", paddingHorizontal: 20, paddingVertical: 10}}>
          <Text style={{fontFamily: fonts.primary.bold, textAlign: "left"}}>Filter {currentFilter}</Text>
          <TouchableOpacity onPress={handleApplyFilters} style={{paddingVertical: 0, paddingHorizontal: 15}}>
              <Text style={{fontFamily: fonts.primary.bold, color: "black", textAlign: "right"}}>Apply</Text>
          </TouchableOpacity>
        </View>
        <FilterBottomSheet 
          data={memoizedFilterData} 
          filterType={currentFilter}
          selectedGeneration={selectedGeneration}
          setSelectedGeneration={setSelectedGeneration}
          selectedTypes={selectedTypes}
          setSelectedTypes={setSelectedTypes}
        />
      </ActionSheet>
    </View>
    </GestureHandlerRootView>
  );
}