import React from 'react';
import {View} from 'react-native';

type Props = {
  width?: number;
  height?: number;
};

const Gap = ({width, height}: Props) => {
  return <View style={{width: width, height: height}} />;
};

export default Gap;