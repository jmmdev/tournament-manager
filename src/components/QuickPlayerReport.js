/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import QuickReportButton from './QuickReportButton';

const dimensions = Dimensions.get('window');
const width = dimensions.width;

export default function QuickPlayerReport({
  name,
  actualValue,
  playerNumber,
  setPlayerValue,
  checkDQ,
}) {
  return (
    <View style={styles.playerContainer}>
      <Text adjustsFontSizeToFit numberOfLines={1} style={styles.playerName}>
        {name}
      </Text>
      <View style={styles.buttonContainer}>
        <QuickReportButton
          playerNumber={playerNumber}
          valueToSet={0}
          actualValue={actualValue}
          setPlayerValue={setPlayerValue}
        />
        <QuickReportButton
          playerNumber={playerNumber}
          valueToSet={1}
          actualValue={actualValue}
          setPlayerValue={setPlayerValue}
        />
        <QuickReportButton
          playerNumber={playerNumber}
          valueToSet={2}
          actualValue={actualValue}
          setPlayerValue={setPlayerValue}
        />
        <QuickReportButton
          playerNumber={playerNumber}
          valueToSet={3}
          actualValue={actualValue}
          setPlayerValue={setPlayerValue}
        />
        <TouchableOpacity
          style={[
            styles.button,
            {
              borderWidth: actualValue && checkDQ === null ? 0 : 2,
              backgroundColor:
                actualValue === null && checkDQ ? '#3870e0' : '#0016',
            },
          ]}
          onPress={() => setPlayerValue(playerNumber, null)}
          activeOpacity={1}>
          <Text
            style={[
              styles.buttonText,
              {
                color: actualValue === null && checkDQ ? '#fff' : '#fffa',
              },
            ]}>
            DQ
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  playerContainer: {
    gap: 24,
  },
  playerName: {
    fontFamily: 'Roboto-Regular',
    fontSize: 24,
    color: '#fffa',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
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
    fontSize: 22,
  },
});
