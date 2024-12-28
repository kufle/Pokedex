import React from 'react';
import Bug from "../assets/images/icons/Bug.svg";
import Dark from "../assets/images/icons/Dark.svg";
import Dragon from "../assets/images/icons/Dragon.svg";
import Electric from "../assets/images/icons/Electric.svg";
import Fairy from "../assets/images/icons/Fairy.svg";
import Fighting from "../assets/images/icons/Fighting.svg";
import Fire from "../assets/images/icons/Fire.svg";
import Flying from "../assets/images/icons/Flying.svg";
import Ghost from "../assets/images/icons/Ghost.svg";
import Grass from "../assets/images/icons/Grass.svg";
import Ground from "../assets/images/icons/Ground.svg";
import Ice from "../assets/images/icons/Ice.svg";
import Normal from "../assets/images/icons/Normal.svg";
import Poison from "../assets/images/icons/Poison.svg";
import Psychic from "../assets/images/icons/Psychic.svg";
import Rock from "../assets/images/icons/Rock.svg";
import Steel from "../assets/images/icons/Steel.svg";
import Water from "../assets/images/icons/Water.svg";
import { StyleProp, View, ViewStyle } from 'react-native';

interface Props {
    height: number;
    width: number;
    type: string;
    style?: StyleProp<ViewStyle>;
}

function Icon({height = 24, width = 24, type, style}: Props) {
    let RenderIcon;
    switch (type) {
        case 'bug':
            RenderIcon = Bug;
            break;
        case 'dark':
            RenderIcon = Dark;
            break;
        case 'dragon':
            RenderIcon = Dragon;
            break;
        case 'electric':
            RenderIcon = Electric;
            break;
        case 'fairy':
            RenderIcon = Fairy;
            break;
        case 'fighting':
            RenderIcon = Fighting;
            break;
        case 'fire':
            RenderIcon = Fire;
            break;
        case 'flying':
            RenderIcon = Flying;
            break;
        case 'ghost':
            RenderIcon = Ghost;
            break;
        case 'grass':
            RenderIcon = Grass;
            break;
        case 'ground':
            RenderIcon = Ground;
            break;
        case 'ice':
            RenderIcon = Ice;
            break;
        case 'normal':
            RenderIcon = Normal;
            break;
        case 'poison':
            RenderIcon = Poison;
            break;
        case 'psychic':
            RenderIcon = Psychic;
            break;
        case 'rock':
            RenderIcon = Rock;
            break;
        case 'steel':
            RenderIcon = Steel;
            break;
        case 'water':
            RenderIcon = Water;
            break;
        default:
            RenderIcon = Dark;
    }
    return (
        <View style={style}>
            <RenderIcon height={height} width={width} />
        </View>
    )
}

export default Icon
