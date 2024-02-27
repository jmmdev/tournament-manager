/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon} from '@rneui/themed';
import Characters from './Characters';

const dimensions = Dimensions.get('window');
const width = dimensions.width;

var currentId = 0;

export default function PopupPlayerInfo({
  player1,
  player2,
  p1Value,
  p2Value,
  gameData,
  setGameData,
  videogame,
}) {
  const [showCharacters, setShowCharacters] = useState(false);
  const characterToEdit = useRef(null);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    let value = gameData ? gameData.length : 0;

    const diff = p1Value + p2Value - value;

    let actualGameData = gameData ? [...gameData] : [];

    if (diff > 0) {
      for (let i = 1; i <= diff; i++) {
        const newGame = {
          winnerId: null,
          selections: [
            {
              character: {id: null, images: null},
              entrant: player1,
            },
            {
              character: {id: null, images: null},
              entrant: player2,
            },
          ],
        };
        actualGameData.push(newGame);
      }
    } else {
      let count = 0;
      for (
        let i = actualGameData.length - 1;
        i >= 0 && count < Math.abs(diff);
        i--
      ) {
        actualGameData.splice(i, 1);
        count++;
      }
    }
    setGameData(actualGameData);
  }, []);

  const addGame = useCallback(() => {
    const newGame = {
      winnerId: null,
      selections: [
        {
          character: {id: null, images: null},
          entrant: player1,
        },
        {
          character: {id: null, images: null},
          entrant: player2,
        },
      ],
    };

    if (!gameData) {
      setGameData([newGame]);
    } else {
      const actualGames = [...gameData];

      const lastGame = actualGames[actualGames.length - 1];
      if (lastGame && lastGame.selections) {
        newGame.selections = JSON.parse(JSON.stringify(lastGame.selections));
      }

      actualGames.push(newGame);
      setGameData(actualGames);
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({animated: true});
      }, 200);
    }
  }, [gameData, player1, player2, setGameData]);

  const removeGame = index => {
    if (gameData.length === 1) {
      setGameData(null);
      return;
    }
    const actualGames = [...gameData];
    actualGames.splice(index, 1);

    setGameData(actualGames);
  };

  const declareWinner = (id, index) => {
    const actualGames = [...gameData];
    actualGames[index].winnerId = id;
    setGameData(actualGames);
  };

  const updateCharacterInGame = (newId, newImage) => {
    const actualGames = [...gameData];
    actualGames[characterToEdit.current.game].selections[
      characterToEdit.current.playerIndex
    ].character = {
      id: newId,
      images: [{url: newImage}],
    };
    for (
      let i = characterToEdit.current.game + 1;
      i < actualGames.length;
      i++
    ) {
      const actualChar =
        actualGames[i].selections[characterToEdit.current.playerIndex]
          .character;
      if (actualChar.id === null) {
        actualGames[i].selections[
          characterToEdit.current.playerIndex
        ].character = {id: newId, images: [{url: newImage}]};
      }
    }
    setGameData(actualGames);
  };

  const sortCharacters = () => {
    const sortedArray = videogame.characters.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });

    const index = sortedArray.findIndex(value =>
      value.name.toLowerCase().includes('random'),
    );

    const random = sortedArray.slice(index, index + 1)[0];
    sortedArray.splice(index, 1);
    sortedArray.push(random);

    return sortedArray;
  };

  return (
    <>
      <View style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            gap: 24,
            flexGrow: 1,
          }}>
          {gameData &&
            gameData.map((item, index) => {
              currentId++;
              return (
                <View key={currentId} style={styles.gameContainer}>
                  <View style={styles.gameTop}>
                    <Text style={styles.textTop}>Game {index + 1}</Text>
                    {gameData.length > 1 && (
                      <TouchableOpacity
                        style={{
                          paddingHorizontal: width * 0.02,
                        }}
                        onPress={() => removeGame(index)}>
                        <Icon
                          name="delete"
                          size={width * 0.07}
                          type="material"
                          color="#f9a"
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={styles.gamePlayers}>
                    <View
                      style={[
                        styles.gamePlayer,
                        {
                          backgroundColor:
                            gameData[index].winnerId === player1.id
                              ? '#0b7'
                              : 'transparent',
                          borderBottomWidth: 1,
                          borderColor: '#fff4',
                        },
                      ]}>
                      <TouchableOpacity
                        style={styles.stockContainer}
                        onPress={() => {
                          characterToEdit.current = {
                            game: index,
                            playerIndex: 0,
                          };
                          setShowCharacters(true);
                        }}>
                        <Image
                          style={{
                            width: '100%',
                            height: '100%',
                          }}
                          source={
                            item.selections &&
                            item.selections[0].character.images
                              ? {
                                  uri: item.selections[0].character.images[0]
                                    .url,
                                }
                              : require('../../assets/placeholder-stock.png')
                          }
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.nameContainer}
                        activeOpacity={1}
                        onPress={() => declareWinner(player1.id, index)}>
                        <Text
                          adjustsFontSizeToFit
                          numberOfLines={1}
                          style={styles.name}>
                          {player1.name}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={[
                        styles.gamePlayer,
                        {
                          backgroundColor:
                            gameData[index].winnerId === player2.id
                              ? '#0b7'
                              : 'transparent',
                        },
                      ]}>
                      <TouchableOpacity
                        style={styles.stockContainer}
                        onPress={() => {
                          characterToEdit.current = {
                            game: index,
                            playerIndex: 1,
                          };
                          setShowCharacters(true);
                        }}>
                        <Image
                          style={{
                            width: '100%',
                            height: '100%',
                          }}
                          source={
                            item.selections &&
                            item.selections[1].character.images
                              ? {
                                  uri: item.selections[1].character.images[0]
                                    .url,
                                }
                              : require('../../assets/placeholder-stock.png')
                          }
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.nameContainer}
                        activeOpacity={1}
                        onPress={() => declareWinner(player2.id, index)}>
                        <Text
                          adjustsFontSizeToFit
                          numberOfLines={1}
                          style={styles.name}>
                          {player2.name}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
        </ScrollView>
        {(!gameData || gameData.length < 5) && (
          <TouchableOpacity style={styles.addGame} onPress={() => addGame()}>
            <Icon
              name="add-circle"
              type="material"
              color="#fffc"
              size={width * 0.06}
            />
            <Text style={styles.addText}>Add game</Text>
          </TouchableOpacity>
        )}
      </View>
      {showCharacters && (
        <Characters
          characters={sortCharacters()}
          updateCharacterInGame={updateCharacterInGame}
          setShowCharacters={setShowCharacters}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    padding: '5%',
    backgroundColor: '#0016',
    borderRadius: width * 0.01,
    gap: width * 0.05,
  },
  gameContainer: {
    backgroundColor: '#eef2',
    borderRadius: width * 0.01,
    borderWidth: 2,
    borderColor: '#fff8',
  },
  gameTop: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopLeftRadius: width * 0.01,
    borderTopRightRadius: width * 0.01,
    backgroundColor: '#001a',
    gap: width * 0.02,
  },
  textTop: {
    color: '#fffa',
    fontSize: 22,
    fontFamily: 'Roboto-Medium',
  },
  addGame: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#3870e0',
    borderRadius: width * 0.01,
  },
  addText: {
    color: '#fffc',
    fontFamily: 'Roboto-Regular',
    fontSize: 24,
  },
  gamePlayer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomLeftRadius: width * 0.01,
    borderBottomRightRadius: width * 0.01,
  },
  stockContainer: {
    width: '18%',
    aspectRatio: 1,
    padding: 8,
    justifyContent: 'center',
  },
  nameContainer: {
    width: '82%',
    paddingVertical: 16,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  name: {
    color: '#fff',
    fontFamily: 'Roboto-Medium',
    fontSize: 22,
  },
});
