/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';

const dimensions = Dimensions.get('window');
const width = dimensions.width;

export default function LogoutPopup({navigation, showModal, setShowModal}) {
  function logout() {
    EncryptedStorage.getItem('credentials')
      .then(res => {
        EncryptedStorage.removeItem('credentials').then(() => {
          setShowModal(false);
          navigation.reset({
            index: 0,
            routes: [{name: 'LoginScreen', params: {}}],
          });
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showModal}
      onRequestClose={() => {
        setShowModal(false);
      }}>
      <View style={styles.popupContainer} onPress={() => setShowModal(false)}>
        <View style={styles.popupContent}>
          <Text style={styles.popupText}>Log out?</Text>
          <View style={styles.popupButtonContainer}>
            <TouchableOpacity
              style={[styles.popupButton, {backgroundColor: '#3870e0'}]}
              onPress={() => setShowModal(false)}>
              <Text
                style={[styles.popupButtonText, styles.popupOptionButtonText]}>
                NO
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.popupButton, {backgroundColor: '#737a8f'}]}
              onPress={() => logout()}>
              <Text
                style={[styles.popupButtonText, styles.popupOptionButtonText]}>
                YES
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tournaments: {
    backgroundColor: '#121212',
  },
  item: {
    width: '100%',
    borderBottomColor: '#606770',
  },
  itemContent: {
    width: '100%',
    padding: '5%',
  },
  mainItemContent: {
    width: '100%',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  textContent: {
    width: '85%',
    marginLeft: '3%',
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontFamily: 'Roboto-Bold',
    textShadowColor: '#000000',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 0.1,
  },
  details: {
    width: '100%',
    color: '#ffffff',
    fontSize: 20,
    fontFamily: 'Roboto-Regular',
    textShadowColor: '#000000',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 0.1,
  },
  stateContent: {
    alignSelf: 'flex-end',
  },
  state: {
    color: '#a0a7b0',
    fontSize: 18,
    fontStyle: 'italic',
  },
  imageContainer: {
    backgroundColor: '#ffffff',
    width: '12%',
    aspectRatio: 1,
    borderRadius: 2000,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 2000,
    borderWidth: 2,
    borderColor: '#ffffffc0',
  },
  popupContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000c',
  },
  popupContent: {
    width: '80%',
    height: '18%',
    backgroundColor: '#252e37',
    borderRadius: width * 0.01,
    justifyContent: 'space-between',
    padding: '5%',
  },
  popupText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 28,
    color: '#c3cacf',
    alignSelf: 'center',
    width: '100%',
    textAlign: 'center',
  },
  popupButtonText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 22,
    textAlign: 'center',
  },
  popupOptionButtonText: {
    color: '#fff',
  },
  popupButtonContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  popupButton: {
    width: '30%',
    padding: '3.5%',
    borderRadius: width * 0.01,
  },
  popupOptionButtons: {
    width: '75%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
