import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react'
import { Text, TouchableOpacity } from 'react-native';

interface Props {
    text: string;
    handlePress: (index: number) => void
}
function Filter({text, handlePress}: Props) {
  return (
    <TouchableOpacity style={{backgroundColor: "#f2f2f2", flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8}} onPress={() => handlePress(0)}>
        <Text style={{flex: 1, fontFamily: "poppins", fontSize: 12, color: "#7a7a7a"}} ellipsizeMode="tail" numberOfLines={1}>{text}</Text>
        <MaterialCommunityIcons name="filter" size={15} color="#303030" />
    </TouchableOpacity>
  )
}

export default Filter;
