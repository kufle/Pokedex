import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { Dimensions, Image, ImageBackground, StyleSheet, Text, View } from 'react-native'
import ImgPokeball from "../../assets/images/pokeball.png";

const { height } = Dimensions.get("window");

const PNG_IMAGE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';
const pokeballSource: ImageSourcePropType = ImgPokeball as ImageSourcePropType;

function Pokemon() {
	const {id} = useLocalSearchParams();
	return (
		<View style={{flex: 1, backgroundColor: "red"}}>
			<View style={styles.imageContainer}>
				<View style={{flexDirection: "column", justifyContent: "space-between", flex: 1}}>
					<View style={{backgroundColor:"red"}}><Text>Bulbasaur</Text></View>
					<View style={{flexDirection: "column", zIndex: 1, justifyContent: "center", alignItems: "center"}}>
						<ImageBackground
							resizeMode="contain"
							style={{width: 170, height: 170, flexDirection: "column", alignItems: "center", justifyContent: "flex-end"}}
							source={pokeballSource}
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
		backgroundColor: "blue"
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