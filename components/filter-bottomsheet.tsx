import { GenerationType, TypesType } from '@/types/pokemonTypes';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo } from 'react'
import { FlatList, Text, TouchableOpacity } from 'react-native';

interface BottomSheetListProps {
    data: { id: number; name: string }[];  // Tipe untuk data
    filterType: string;
    selectedGeneration: GenerationType[];
    setSelectedGeneration: React.Dispatch<React.SetStateAction<GenerationType[]>>;
    selectedTypes: TypesType[];
    setSelectedTypes: React.Dispatch<React.SetStateAction<TypesType[]>>;
}

const FilterBottomSheet =  React.memo(({ data, filterType, selectedGeneration, setSelectedGeneration, selectedTypes, setSelectedTypes }: BottomSheetListProps) => {
    //const datafilter = useMemo(() => data, [data]);

    const handlePress = useCallback((selectedItem: { id: number; name: string }) => {
        if (filterType === 'generations') {
            setSelectedGeneration((prev) => {
                const exists = prev.find((gen) => gen.id === selectedItem.id);
                if (exists) {
                    return prev.filter((gen) => gen.id !== selectedItem.id);
                }
                return [...prev, selectedItem];
            });
        } else if (filterType === 'types') {
            setSelectedTypes((prev) => {
                if (prev.includes(selectedItem)) {
                    return prev.filter((type) => type.id !== selectedItem.id);
                }
                return [...prev, selectedItem];
            });
        }
    }, [filterType, setSelectedGeneration, setSelectedTypes]);

    const renderItem = useCallback(
        ({item}: { item: { id: number; name: string } }) => {
            const isSelected = filterType === "generations" 
                    ? selectedGeneration.some((gen) => gen.id === item.id)
                    : selectedTypes.some((type) => type.id === item.id);
            return (
                <TouchableOpacity style={{paddingHorizontal: 20, paddingVertical: 10, flexDirection: "row"}} onPress={() => handlePress(item)}>
                    <Text style={{fontFamily: "poppins", textAlign: "left", marginRight: 5}}>{item.name}</Text>
                    {isSelected && (<Ionicons name="checkmark" size={20} color="green" />)}
                </TouchableOpacity>
            )
        },
        [filterType, selectedGeneration, selectedTypes, handlePress]
    );

    return (
        <FlatList
            keyExtractor={(item) => item.id.toString()}
            data={data}
            renderItem={renderItem}
        />
    )
})

export default FilterBottomSheet
