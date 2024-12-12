import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import React, { useCallback, useMemo } from 'react'
import { Text, View } from 'react-native';

function BottomSheetList({data}) {
    const datafilter = useMemo(() => data, [data]);

    const renderItem = useCallback(
        ({item}) => {
            return (
                <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
                    <Text style={{fontFamily: "poppins"}}>{item.name}</Text>
                </View>
            )
        },
        []
    );

    return (
        <BottomSheetFlatList
            data={datafilter}
            renderItem={renderItem}
        />
    )
}

export default BottomSheetList
