import { gql } from "@apollo/client";

export const GET_POKEMON = gql`query Pokemon($id: Int!) {
    pokemon_v2_pokemonspecies(where: {id: {_eq: $id}}) {
      id
      name
      capture_rate
      generation_id
      base_happiness
      pokemon_v2_pokemonhabitat {
        name
      }
      pokemon_v2_pokemons {
        height
        weight
        pokemon_v2_pokemontypes {
          pokemon_v2_type {
            name
          }
        }
        pokemon_v2_pokemonstats {
          base_stat
          stat_id
          pokemon_v2_stat {
            name
          }
        }
        pokemon_v2_pokemonabilities {
          pokemon_v2_ability {
            name
            pokemon_v2_abilityeffecttexts(where: {language_id: {_eq: 9}}) {
              short_effect
            }
          }
        }
        pokemon_v2_pokemonforms {
          form_name
          name
        }
      }
      pokemon_v2_pokemonspeciesflavortexts(where: {language_id: {_eq: 9}}, limit: 3) {
        flavor_text
      }
      pokemon_v2_evolutionchain {
        pokemon_v2_pokemonspecies {
          name
          id
        }
      }
    }
  }
`