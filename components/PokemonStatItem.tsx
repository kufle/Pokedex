import { colorCommon } from '@/utils/colors'
import { statisticShortName } from '@/utils/statisticShortName'
import React from 'react'
import { Text, View } from 'react-native'

function PokemonStatItem({width, stat, minStat, maxStat, percentageWidth}) {
    return (
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5}}>
            <Text style={{textAlign: "left", width: width * 0.23, fontFamily: "poppins", color: colorCommon.light.text}}>{statisticShortName(stat.pokemon_v2_stat.name)}</Text>
            <Text style={{textAlign: "right", width: width * 0.09, marginRight: 10, color: colorCommon.light.text}}>{stat.base_stat}</Text>
            <View style={{flexGrow: 1, backgroundColor: "#d3d3d3", height: 8, borderRadius: 5}}>
                <View style={{width: `${percentageWidth}%`, backgroundColor: "green", height: 8, borderRadius: 5}} />
            </View>
            <Text style={{textAlign: "right", width: width * 0.2, color: colorCommon.light.text}}>{minStat} - {maxStat}</Text>
        </View>
    )
}

export default PokemonStatItem
