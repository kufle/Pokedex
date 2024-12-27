import { PNG_IMAGE_URL } from '@/helpers/constant';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import React from 'react'
import { FlatList, Image, Text, View } from 'react-native'

const PokemonTabEvolution = ({id, data}) => {
    const { 
        pokemon_v2_pokemonspecies
    } = data.pokemon_v2_pokemonspecies[0].pokemon_v2_evolutionchain;
    return (
        <FlatList
            data={pokemon_v2_pokemonspecies}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({item, index}) =>(
                <View style={{flexDirection: "row", alignItems: "center", borderLeftWidth: 1}}>
                    
                        {/* {index > 0 && (<AntDesign name="arrowdown" size={24} color="black" style={{textAlign: "center"}} />)} */}
                        {index > 0 ? (<MaterialIcons name="arrow-right-alt" size={24} color="black" />) : <View style={{backgroundColor:"red"}}></View>}
                        <View style={{borderWidth: 1, borderColor: "blue"}}>
                            <Image src={`${PNG_IMAGE_URL}/${item.id}.png`} style={{width: 75, height: 75}} />
                            <Text style={{textAlign: "center"}}>{item.name}</Text>
                        </View>
                </View>
            )}
        />
    )
}

export default PokemonTabEvolution
