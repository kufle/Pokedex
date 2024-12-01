interface RootObject {
    pokemon_v2_pokemon: Pokemonv2pokemon[];
}
interface Pokemonv2pokemon {
    id: number;
    name: string;
    pokemon_v2_pokemontypes: Pokemonv2pokemontype[];
}
    interface Pokemonv2pokemontype {
    pokemon_v2_type: Pokemonv2type;
}
interface Pokemonv2type {
    name: string;
}