export const colors = {
    undefined: '#e5e7eb',
    bug: '#9dc130',
    dark: '#5f606d',
    dragon: '#0773c7',
    electric: '#edd53f',
    fairy: '#ef97e6',
    fighting: '#d94256',
    fire: '#fc6c6d',
    flying: '#9bb4e8',
    ghost: '#7975d4',
    grass: '#5dbe62',
    ground: '#d78555',
    ice: '#98d8d8',
    normal: '#9a9da1',
    poison: '#b563ce',
    psychic: '#f85888',
    rock: '#cec18c',
    steel: '#b8b8d0',
    water: '#60a5fa',
};

export const getColor = (type: keyof typeof colors) => colors[type] || colors.undefined;