import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native';

export default function ErrorMessage({message, setShowError, refresh}) {
  return (
    <View style={styles.modalContent}>
      <View style={styles.container}>
        <Text style={styles.text}>
          {message
            ? message
            : "An error ocurred, please make sure you're connected to the internet and try again"}
        </Text>
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setShowError(false);
              refresh();
            }}>
            <Text style={styles.buttonText}>Try again</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000a',
  },
  container: {
    width: '90%',
    backgroundColor: '#252e37',
    alignItems: 'center',
    borderRadius: 10,
  },
  text: {
    width: '85%',
    fontSize: 22,
    color: '#c3cacf',
    marginTop: '5%',
    marginBottom: '10%',
  },
  buttons: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#656e77',
  },
  button: {
    width: '100%',
    justifyContent: 'space-between',
    paddingBottom: '5%',
    paddingTop: '5%',
  },
  buttonText: {
    color: '#3870e0',
    fontSize: 28,
    textAlign: 'center',
  },
});
