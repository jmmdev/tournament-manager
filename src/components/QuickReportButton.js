/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Dimensions, StyleSheet, Text, TouchableOpacity} from 'react-native';

const dimensions = Dimensions.get('window');
const width = dimensions.width;

export default function QuickReportButton({
  playerNumber,
  valueToSet,
  actualValue,
  setPlayerValue,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          borderWidth:
            actualValue !== null && actualValue === valueToSet ? 0 : 2,
          backgroundColor:
            actualValue !== null && actualValue === valueToSet
              ? '#3870e0'
              : '#0016',
        },
      ]}
      onPress={() => setPlayerValue(playerNumber, valueToSet)}
      activeOpacity={1}>
      <Text
        style={[
          styles.buttonText,
          {
            color:
              actualValue !== null && actualValue === valueToSet
                ? '#fff'
                : '#fffa',
          },
        ]}>
        {valueToSet}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: Math.min(width * 0.9 * 0.17, 96),
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 200,
    borderColor: '#fffa',
  },
  buttonText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 24,
  },
});
