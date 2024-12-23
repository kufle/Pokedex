const EIGHTHS = 8;

type Gender = {
  gender: 'Genderless' | 'Male' | 'Female';
  rate?: number;
};

const getPokemonGenderStats = (gender_rate: number): Gender[] => {
  if (gender_rate === -1) {
    return [
      {
        gender: 'Genderless',
      },
    ];
  }

  const femalePercentage = (gender_rate / EIGHTHS) * 100;
  const malePercentage = 100 - femalePercentage;

  return [
    { gender: 'Male', rate: malePercentage },
    { gender: 'Female', rate: femalePercentage },
  ];
};

export default getPokemonGenderStats;