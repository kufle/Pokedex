import { gql, useQuery } from "@apollo/client";
import PokemonCard from "@/components/pokemon-card";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { useState } from "react";

const LIMIT = 6;
const INITIAL_FILTER = { name: '', generationId: 0, typeId: 0 };

const query = gql`
  query Pokemons($offset: Int!, $limit: Int!) {
    pokemon_v2_pokemonspecies(
      order_by: { id: asc }
      offset: $offset
      where: {
        name: { _ilike: "%${INITIAL_FILTER.name}%" }
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

  const {loading, data, error, fetchMore} = useQuery(query, {
    variables: {offset: offset, limit: LIMIT},
    onCompleted: (data) => {
      console.log("Di fetch")
      console.log(data)
      setPokemons((prev) => [...prev, ...data.pokemon_v2_pokemonspecies]);
    }
  });

  const loadMoreData = () => {
    if (!loading) {
      fetchMore({
        variables: {offset: offset + LIMIT, limit: LIMIT},
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
    <View style={{ flex: 1, paddingHorizontal: 16, flexDirection: "column"}}>
      <FlatList
        numColumns={2}
        showsVerticalScrollIndicator={false}
        data={pokemons}
        contentContainerStyle={{gap: 15, paddingVertical: 12}}
        columnWrapperStyle={{flex: 0.5, justifyContent: "space-between"}}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => <PokemonCard key={item.id} {...item}/>
        }
        onEndReached={loadMoreData}
        ListFooterComponent={
          hasMore ? <ActivityIndicator /> : <Text>No more data</Text>
        }
      />
    </View>
  );
}
