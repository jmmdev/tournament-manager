/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon} from '@rneui/themed';
import {FlatList} from 'react-native-gesture-handler';

const dimensions = Dimensions.get('window');
const width = dimensions.width;
const height = dimensions.height;

export default function Characters({
  characters,
  updateCharacterInGame,
  setShowCharacters,
}) {
  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        key={item.id}
        activeOpacity={1}
        style={[
          styles.character,
          {borderBottomWidth: index < characters.length - 1 ? 1 : 0},
        ]}
        onPress={() => {
          updateCharacterInGame(item.id, item.images[0].url);
          setShowCharacters(false);
        }}>
        <Image style={styles.image} source={{uri: item.images[0].url}} />
        <Text style={styles.name} adjustsFontSizeToFit={true}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.charactersContainer}>
        <FlatList
          contentContainerStyle={{flexGrow: 1}}
          data={characters}
          renderItem={renderItem}
        />
      </View>
      <TouchableOpacity onPress={() => setShowCharacters(false)}>
        <Icon
          name="close-circle-outline"
          type="material-community"
          size={width * 0.08}
          color="#fffc"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#000',
    zIndex: 5,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },
  charactersContainer: {
    width: width * 0.8,
    height: '50%',
    backgroundColor: '#fff',
    borderRadius: width * 0.02,
  },
  character: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomColor: '#0004',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  image: {
    width: 64,
    aspectRatio: 1,
  },
  name: {
    width: width - 160,
    fontFamily: 'Roboto-Medium',
    fontSize: 24,
    color: '#000',
  },
});
