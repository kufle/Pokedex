type PokemonType = {
    pokemon_v2_type: {
      name: string;
    };
  };
  
  type Pokemon = {
    pokemon_v2_pokemontypes: PokemonType[];
  };
  
export type PokemonSpecies = {
    id: number;
    name: string;
    pokemon_v2_pokemons: Pokemon[];
  };
  
export type PokemonSpeciesResponse = PokemonSpecies[];

export interface GenerationType {
    id: number;
    name: string;
}

export interface TypesType {
    id: number;
    name: string;
}

export interface AppliedFilterType {
  generationId: number[];
  typeId: number[];
}
