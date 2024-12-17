import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { Text } from 'react-native'

function Pokemon() {
    const {id} = useLocalSearchParams();
  return (
    <Text>
    Hello {id}
    </Text>
  )
}

export default Pokemon
