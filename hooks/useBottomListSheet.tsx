import BottomSheet from "@gorhom/bottom-sheet";
import { useCallback, useRef } from "react";

const useBottomListSheet = () => {
    const sheetRef = useRef<BottomSheet>(null);

    const handleSnapPress = useCallback((index) => {
        sheetRef.current?.snapToIndex(index);
    }, []);

    return {sheetRef, handleSnapPress}
}

export default useBottomListSheet;