import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { Stack } from "expo-router";

const client = new ApolloClient({
  uri: "https://beta.pokeapi.co/graphql/v1beta",
  cache: new InMemoryCache(),
});

export default function RootLayout() {
  return (
    <ApolloProvider client={client}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Pokémon Wiki'}} />
      </Stack>
    </ApolloProvider>
  );
}
