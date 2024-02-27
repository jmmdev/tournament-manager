import {Icon} from '@rneui/themed';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export default function NotFound({message, refresh}) {
  return (
    <View style={styles.emptyList}>
      <Text style={styles.emptyListMessage}>{message}</Text>
      <TouchableOpacity style={styles.reloadMessage} onPress={() => refresh()}>
        <Icon color={'#3870e0'} size={40} name={'refresh'} type={'material'} />
        <Text style={styles.text}>REFRESH</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyList: {
    width: '100%',
    height: '92%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#121212',
  },
  emptyListMessage: {
    color: '#656e77',
    fontFamily: 'Roboto-Italic',
    fontSize: 30,
    textAlign: 'center',
    padding: '5%',
  },
  reloadMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
  },
  text: {
    fontFamily: 'Roboto-Regular',
    fontSize: 40,
    color: '#3870e0',
    marginLeft: '2%',
  },
});
