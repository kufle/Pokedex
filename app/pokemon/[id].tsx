import { useLocalSearchParams } from 'expo-router'
import React, { useMemo } from 'react'
import { Dimensions, Image, ImageSourcePropType, ScrollView, StyleSheet, Text, View } from 'react-native'
import ImgPokeball from "../../assets/images/pokeball.png";
import { colors } from '@/utils/colors';
import { formatPokemonId } from '@/helpers/pokemon';
import { snakeCaseToTitleCase } from '@/utils/string';
import Tag from '@/components/Tag';
import PokemonTabView from '@/components/PokemonTabView';
import { PNG_IMAGE_URL } from '@/helpers/constant';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BackHeader from '@/components/BackHeader';
import { fonts } from '@/utils/fonts';

type ColorType = keyof typeof colors;

const { height } = Dimensions.get("window");

function Pokemon() {
	const { id, pokemonType, name } = useLocalSearchParams<{ id: string; name: string, pokemonType: ColorType }>();
	const pokemonArrayType: ColorType[] = useMemo(() => pokemonType.split(",") as ColorType[], [pokemonType]);
	
	return (
		<View style={{flex: 1}}>
			<View style={[styles.imageContainer, { backgroundColor: colors[pokemonArrayType[0]] || colors.undefined }]}>
				<View style={{marginBottom: 10, flexDirection: "row", justifyContent: "space-between"}}>
					<BackHeader />
					<MaterialCommunityIcons name="cards-heart-outline" size={24} color="white" style={{textAlign: "left"}} />
				</View>
				<View style={{flex: 1}}>
					<View style={{flexDirection: "row", justifyContent: "space-between"}}>
						<View>
							<Text style={{textAlign: "left", fontSize: 20, fontFamily: fonts.primary.bold, color: "#FFFFFF"}}>{snakeCaseToTitleCase(name)}</Text>
						</View>
						<Text style={{textAlign: "left", fontSize: 20, fontFamily: fonts.primary.bold, color: "#FFFFFF"}}>#{formatPokemonId(id)}</Text>
						
					</View>
					<View style={{justifyContent: "space-around", flexDirection: "row", alignItems: "center", flex: 1}}>
						<View style={{flexDirection: "column", marginHorizontal: -5}}>
							{pokemonArrayType.map((pokeType) => (
								<Tag key={pokeType} pokeType={pokeType} hasIcon style={styles.tag} />
							))}
						</View>
						<View>
							<Image src={`${PNG_IMAGE_URL}/${id}.png`} style={{width: 190, height: 190, position: "relative", zIndex: 1}} />
							<Image source={ImgPokeball as ImageSourcePropType} style={{position: "absolute", width: 300, height: 300, transform: [{rotate: '30deg'}]}} />
						</View>
					</View>
				</View>
				
			</View>
			<View style={styles.descriptionContainer}>
				<PokemonTabView backgroundColor={colors[pokemonArrayType[0]] ||colors.undefined } id={id} />
			</View>
		</View>
	)
}

export default Pokemon

const styles = StyleSheet.create({
	imageContainer: {
		height: height * 0.37,
		paddingHorizontal: 16, 
		paddingTop: 10
	},
	imageBackground: {
		width: 180, 
		height: 180, 
		flexDirection: "column", 
		alignItems: "center", 
		justifyContent: "flex-end",
		//backgroundColor: "yellow"
	},
	descriptionContainer: {
		backgroundColor: "#FFFFFF",
		// marginTop: -20,
		flex: 1,
		// borderTopRightRadius: 20,
		// borderTopLeftRadius: 20,
		//paddingTop: 10
	},
	tag: {
		paddingHorizontal: 15, 
		paddingVertical: 6, 
		borderRadius: 60, 
		marginHorizontal: 5,
		marginBottom: 10
	}
})