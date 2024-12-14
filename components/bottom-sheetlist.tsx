import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import React, { useCallback, useMemo } from 'react'
import { Text, TouchableOpacity, View } from 'react-native';

const BottomSheetList = React.memo(({ data, handleFilterSelected, filterType }) => {
    const datafilter = useMemo(() => data, [data]);
    console.log("filtertype", filterType)
    const handlePress = (pressItem) => {
        handleFilterSelected(filterType, pressItem);
    }
    const renderItem = useCallback(
        ({item}) => {
            
            return (
                <TouchableOpacity style={{paddingHorizontal: 20, paddingVertical: 10}} onPress={() => handlePress(item.name)}>
                    <Text style={{fontFamily: "poppins"}}>{item.name}</Text>
                </TouchableOpacity>
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
});

export default BottomSheetList
