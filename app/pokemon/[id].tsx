import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { Dimensions, Image, ImageBackground, ImageSourcePropType, StyleSheet, Text, View } from 'react-native'
import ImgPokeball from "../../assets/images/pokeball.png";
import { colors } from '@/utils/colors';
import { formatPokemonId } from '@/helpers/pokemon';
import { snakeCaseToTitleCase } from '@/utils/string';
import Tag from '@/components/tag';
import { pokemonTypes } from './../../data/pokemon-types';

type ColorType = keyof typeof colors;

const { height } = Dimensions.get("window");

const PNG_IMAGE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

function Pokemon() {
	const { id, pokemonType, name } = useLocalSearchParams<{ id: string; name: string, pokemonType: ColorType }>();
	const pokemonArrayType: ColorType[] = pokemonType.split(",") as ColorType[];
	return (
		<View style={{flex: 1, backgroundColor: "red"}}>
			<View style={[styles.imageContainer, { backgroundColor: colors[pokemonArrayType[0]] || colors.undefined }]}>
				<View style={{flexDirection: "column", justifyContent: "space-between", flex: 1}}>
					<View style={{backgroundColor:"red", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start"}}>
						<View>
							<Text style={{textAlign: "left", fontSize: 20, fontFamily: "poppinsBold", color: "#FFFFFF"}}>{snakeCaseToTitleCase(name)}</Text>
							<View style={{flexDirection: "row"}}>
								{pokemonArrayType.map((pokeType) => (
									<Tag key={pokeType} pokeType={pokeType} />
								))}
							</View>
						</View>
						<Text style={{textAlign: "left", fontSize: 20, fontFamily: "poppinsBold", color: "#FFFFFF"}}>#{formatPokemonId(id)}</Text>
					</View>
					<View style={{flexDirection: "column", zIndex: 1, justifyContent: "center", alignItems: "center"}}>
						<ImageBackground
							resizeMode="contain"
							style={styles.imageBackground}
							source={ImgPokeball as ImageSourcePropType}
						>
							<Image src={`${PNG_IMAGE_URL}/${id}.png`} style={{width: 150, height: 150}} />
						</ImageBackground>
					</View>
				</View>
			</View>
			<View style={styles.descriptionContainer}>
				<Text>Hello</Text>
			</View>
		</View>
	)
}

export default Pokemon

const styles = StyleSheet.create({
	imageContainer: {
		height: height * 0.33,
	},
	imageBackground: {
		width: 160, 
		height: 160, 
		flexDirection: "column", 
		alignItems: "center", 
		justifyContent: "flex-end",
		backgroundColor: "red",
	},
	descriptionContainer: {
		backgroundColor: "#FFFFFF",
		marginTop: -20,
		flex: 1,
		borderTopRightRadius: 20,
		borderTopLeftRadius: 20,
		paddingHorizontal: 16,
		paddingTop: 26
	}
})