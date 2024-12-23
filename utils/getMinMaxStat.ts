export const getMinMaxStat = (type, val) => {
    const maxEV = 31;
    const maxIV = 63;
    const beneficialNature = 1.1;
    const negativeNature = 0.9;

    let minStat = 0;
    let maxStat = 0;
    if (type === "hp") {
        minStat = 2 * val + 110;;
        maxStat = 2 * val + 110 + 31 + 63;
    } else {
        minStat = Math.floor((2 * val+ 5) * negativeNature);
        maxStat = Math.floor((2 * val + maxEV + maxIV + 5) * beneficialNature);
    }

    return { minStat, maxStat };
}