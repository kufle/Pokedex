import { gql, useQuery } from "@apollo/client";
import PokemonCard from "@/components/pokemon-card";
import { ActivityIndicator, FlatList, Text, TextInput, View } from "react-native";
import { useEffect, useState } from "react";

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
    <View style={{ flex: 1, paddingHorizontal: 16, flexDirection: "column", backgroundColor: "#FFFFFF"}}>
      <View style={{paddingTop: 15}}>
        <Text style={{fontSize: 28, fontFamily: "poppinsBold"}}>Pokédex</Text>
        <Text style={{fontFamily: "poppins", fontSize: 14}}>Search for Pokémon by name.</Text>
        <View style={{ marginBottom: 15 }}>
        <TextInput
          placeholder="Search Pokémon"
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 8,
            fontSize: 16,
          }}
        />
      </View>
      </View>
      <FlatList
        numColumns={2}
        showsVerticalScrollIndicator={false}
        data={pokemons}
        contentContainerStyle={{gap: 15, paddingVertical: 12}}
        columnWrapperStyle={{flex: 0.5, justifyContent: "space-between"}}
        keyExtractor={(item, index) => `${item.id}-index-${index}`}
        renderItem={({item}) => <PokemonCard {...item}/>
        }
        onEndReached={loadMoreData}
        ListFooterComponent={
          hasMore ? <ActivityIndicator /> : <Text>No more data</Text>
        }
      />
    </View>
  );
}
