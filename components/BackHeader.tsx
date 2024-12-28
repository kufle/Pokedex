import { MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { TouchableOpacity } from 'react-native'

function BackHeader() {
    return (
        <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons name="keyboard-backspace" size={26} color="white" style={{textAlign: "left"}} />
        </TouchableOpacity>
    )
}

export default BackHeader
