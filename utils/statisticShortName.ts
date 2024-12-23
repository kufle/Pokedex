export const statisticShortName = (name: string) => {
    switch (name) {
        case "hp":
            return "HP";
        case "attack":
            return "Attack";
        case "defense":
            return "Defense";
        case "special-attack":
            return "Sp. Attack";
        case "special-defense":
            return "Sp. Defense";
        case "speed":
            return "Speed";
        default:
            return name;
    }
}