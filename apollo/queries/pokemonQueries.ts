import { gql } from "@apollo/client";

export const GET_POKEMON = gql`query Pokemon($id: Int!) {
  pokemon_v2_pokemonspecies(where: {id: {_eq: $id}}) {
    capture_rate
    generation_id
    base_happiness
    gender_rate
    hatch_counter
    pokemon_v2_pokemonhabitat {
      name
    }
    pokemon_v2_pokemons(limit: 1) {
      height
      weight
      base_experience
      pokemon_v2_pokemontypes {
        pokemon_v2_type {
          name
        }
      }
      pokemon_v2_pokemonstats {
        base_stat
        effort
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
    pokemon_v2_pokemonspeciesflavortexts(where: {language_id: {_eq: 9}}, limit: 1) {
      flavor_text
    }
    pokemon_v2_evolutionchain {
      pokemon_v2_pokemonspecies(order_by: {order: asc}) {
        name
        id
        evolves_from_species_id
        pokemon_v2_pokemonevolutions {
          min_level
          pokemon_v2_item {
            name
            pokemon_v2_itemsprites {
              sprites
            }
          }
        }
      }
    }
    pokemon_v2_pokemonspeciesnames(where: {language_id: {_eq: 9}}) {
      genus
    }
    pokemon_v2_growthrate {
      name
    }
    pokemon_v2_pokemonegggroups {
      pokemon_v2_egggroup {
        pokemon_v2_egggroupnames(where: {language_id: {_eq: 9}}) {
          name
        }
      }
    }
  }
}
`