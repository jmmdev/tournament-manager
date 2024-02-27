/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useState} from 'react';
import {useEffect} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Linking,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {TouchableOpacity} from 'react-native';
import PopupPlayerInfo from './PopupPlayerInfo';
import QuickPlayerReport from './QuickPlayerReport';
import {Icon} from '@rneui/themed';

const dimensions = Dimensions.get('window');
const width = dimensions.width;

export default function ResultInput({
  setId,
  mainEntrant,
  player1,
  player2,
  setShowModal,
  getSets,
  token,
  videogame,
  eventSlug,
  replaceSetAtIndex,
}) {
  const [p1Value, setP1Value] = useState(0);
  const [p2Value, setP2Value] = useState(0);
  const [winnerId, setWinnerId] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [gameData, setGameData] = useState(null);
  const [reportMode, setReportMode] = useState('quick');
  const [setState, setSetState] = useState(null);

  const originalGameData = useRef(null);

  useEffect(() => {
    fetch('https://api.start.gg/gql/alpha', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        query: `query Set ($id: ID!, $entrant: ID) {
                  set (id: $id) {
                    displayScore(mainEntrantId: $entrant)
                    games {
                      winnerId
                      selections {
                        character {
                          id
                          images(type: "stockIcon") {
                            url
                          }
                        }
                        entrant {
                          id
                        }
                      }
                    }
                    state
                    winnerId
                  }
                }`,
        operationName: 'Set',
        variables: {
          id: setId,
          entrant: mainEntrant,
        },
      }),
    })
      .then(response => response.json())
      .then(json => {
        setSetState(json.data.set.state);
        if (json.data.set.displayScore) {
          const setScores = json.data.set.displayScore.split(' - ');
          setWinnerId(json.data.set.winnerId);
          setP1Value(Number(setScores[0]));
          setP2Value(Number(setScores[1]));
        } else {
          setP1Value(0);
          setP2Value(0);
        }
        const games = json.data.set.games;
        if (games) {
          setGameData(games);
          originalGameData.current = games;
        }
        setIsLoaded(true);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (gameData) {
      let results = {};
      for (let g of gameData) {
        if (g.winnerId !== null) {
          if (results[g.winnerId]) {
            results[g.winnerId]++;
          } else {
            results[g.winnerId] = 1;
          }
        }
      }

      const resultsToCompare = [];
      for (const [key, value] of Object.entries(results)) {
        resultsToCompare.push({id: key, wins: value});
      }

      if (resultsToCompare.length > 0) {
        if (resultsToCompare.length === 1) {
          if (resultsToCompare[0].wins === gameData.length) {
            setWinnerId(resultsToCompare[0].id);
          } else {
            setWinnerId(null);
          }
        }

        if (resultsToCompare.length === 2) {
          if (
            resultsToCompare[0].wins + resultsToCompare[1].wins ===
            gameData.length
          ) {
            if (resultsToCompare[0].wins > resultsToCompare[1].wins) {
              setWinnerId(resultsToCompare[0].id);
            } else if (resultsToCompare[0].wins < resultsToCompare[1].wins) {
              setWinnerId(resultsToCompare[1].id);
            } else {
              setWinnerId(null);
            }
          } else {
            setWinnerId(null);
          }
        }
      } else {
        setWinnerId(null);
      }
    } else {
      setWinnerId(null);
    }
  }, [gameData]);

  useEffect(() => {
    if (p1Value !== null && p2Value !== null) {
      if (p1Value > p2Value) {
        setWinnerId(player1.id);
      } else if (p2Value > p1Value) {
        setWinnerId(player2.id);
      } else {
        setWinnerId(null);
      }
    }
  }, [p1Value, p2Value]);

  const quickReport = () => {
    const isDQ =
      (p1Value === null && p2Value !== null) ||
      (p2Value === null && p1Value !== null);

    let data = [];
    let gameNum = 1;

    if (!isDQ) {
      for (let i = 1; i <= p1Value; i++) {
        data.push({winnerId: player1.id, gameNum: gameNum});
        gameNum++;
      }

      for (let j = 1; j <= p2Value; j++) {
        data.push({winnerId: player2.id, gameNum: gameNum});
        gameNum++;
      }
    }

    fetch('https://api.start.gg/gql/alpha', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        query: `mutation reportSet($setId: ID!, $winnerId: ID!
          ${isDQ ? ', $isDQ: Boolean' : ''}
          ${!isDQ ? ', $gameData: [BracketSetGameDataInput]' : ''}) {
          reportBracketSet(setId: $setId, winnerId: $winnerId
            ${isDQ ? ', isDQ: $isDQ' : ''}
            ${!isDQ ? ', gameData: $gameData' : ''}) {
            id
            state
          }
        }`,
        operationName: 'reportSet',
        variables: {
          setId: setId,
          winnerId: winnerId,
          isDQ: isDQ,
          gameData: data,
        },
      }),
    })
      .then(response => response.json())
      .then(json => {
        const set = getIndexAndSetFromArray(json.data.reportBracketSet);
        replaceSetAtIndex(set.index, set.value);
      });
  };

  const detailedReport = () => {
    fetch('https://api.start.gg/gql/alpha', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        query: `mutation reportSet($setId: ID!, $winnerId: ID!, $gameData: [BracketSetGameDataInput]) {
          reportBracketSet(setId: $setId, winnerId: $winnerId, gameData: $gameData) {
            id
            state
          }
        }`,
        operationName: 'reportSet',
        variables: {
          setId: setId,
          winnerId: winnerId,
          gameData: getGameData(),
        },
      }),
    })
      .then(response => response.json())
      .then(json => {
        const set = getIndexAndSetFromArray(json.data.reportBracketSet);
        replaceSetAtIndex(set.index, set.value);
      });
  };

  const getGameData = () => {
    const finalGameData = [];

    for (let [index, g] of gameData.entries()) {
      finalGameData.push({
        winnerId: g.winnerId,
        gameNum: index + 1,
        selections: [
          {
            entrantId: g.selections[0].entrant.id,
            characterId: g.selections[0].character.id,
          },
          {
            entrantId: g.selections[1].entrant.id,
            characterId: g.selections[1].character.id,
          },
        ],
      });
    }
    return finalGameData;
  };

  const setPlayerValue = (player, value) => {
    if (player === 1) {
      if (value === null) {
        setP2Value(null);
        setWinnerId(player2.id);
      } else {
        if (value === 3) {
          if (p2Value === 3) {
            setP2Value(2);
          }
        }
        if (p2Value === null) {
          setP2Value(0);
        }
      }
      setP1Value(value);
      return;
    } else {
      if (value === null) {
        setP1Value(null);
        setWinnerId(player1.id);
      } else {
        if (value === 3) {
          if (p1Value === 3) {
            setP1Value(2);
          }
        }
        if (p1Value === null) {
          setP1Value(0);
        }
      }
      setP2Value(value);
    }
  };

  const getIndexAndSetFromArray = arr => {
    for (let [index, set] of arr.entries()) {
      if (set.id === setId) {
        return {index: index, value: set};
      }
    }
  };

  return (
    <View style={styles.popupContainer}>
      <>
        {!isLoaded && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loaderText}>Please wait...</Text>
          </View>
        )}
        {isLoaded && setState && setState === 3 && (
          <View style={styles.completedSetContainer}>
            <TouchableOpacity
              onPress={() => {
                setShowModal(false);
                getSets();
              }}>
              <View style={styles.close}>
                <Icon
                  name="close"
                  type="material-community"
                  size={48}
                  color="#fffc"
                />
              </View>
            </TouchableOpacity>
            <View style={styles.endedContainer}>
              <Text style={styles.endedMessage}>
                This set has already ended
              </Text>
              <View style={styles.topContainer}>
                <View style={styles.topView}>
                  <View style={styles.topViewPlayer}>
                    <Text style={styles.player}>{player1.name}</Text>
                    <Text style={styles.score}>
                      {p1Value === null
                        ? winnerId === player2.id
                          ? 'DQ'
                          : '-'
                        : p1Value}
                    </Text>
                  </View>
                  <View style={styles.topViewPlayer}>
                    <Text style={styles.player}>{player2.name}</Text>
                    <Text style={styles.score}>
                      {p2Value === null
                        ? winnerId === player1.id
                          ? 'DQ'
                          : '-'
                        : p2Value}
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={styles.openInNew}
                onPress={() =>
                  Linking.openURL(
                    `https://www.start.gg/${eventSlug}/set/${setId}/report`,
                  ).catch(err => {
                    console.log(err);
                  })
                }>
                <Icon
                  name="open-in-new"
                  type="material-community"
                  color={'#eef8'}
                  size={36}
                />
                <Text style={styles.openInNewText}>Modify in browser</Text>
              </TouchableOpacity>
            </View>
            <View style={{height: 80}} />
          </View>
        )}
        {isLoaded && setState && setState !== 3 && (
          <View style={styles.resultsContainer}>
            <View style={{gap: width * 0.05}}>
              <View style={styles.reportModeContainer}>
                <TouchableOpacity
                  style={styles.reportModeButton}
                  onPress={() => {
                    setReportMode('quick');
                  }}
                  activeOpacity={1}>
                  <Text
                    style={[
                      styles.reportModeText,
                      {
                        color: reportMode === 'quick' ? '#3870e0' : '#fffa',
                        borderBottomWidth: reportMode === 'quick' ? 2 : 0,
                      },
                    ]}>
                    Quick report
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.reportModeButton}
                  onPress={() => {
                    setReportMode('detailed');
                  }}
                  activeOpacity={1}>
                  <Text
                    style={[
                      styles.reportModeText,
                      {
                        color: reportMode === 'detailed' ? '#3870e0' : '#fffa',
                        borderBottomWidth: reportMode === 'detailed' ? 2 : 0,
                      },
                    ]}>
                    Detailed report
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {reportMode === 'quick' && (
              <View style={styles.quickContainer}>
                <QuickPlayerReport
                  name={player1.name}
                  actualValue={p1Value}
                  playerNumber={1}
                  setPlayerValue={setPlayerValue}
                  checkDQ={winnerId === player2.id}
                />
                <QuickPlayerReport
                  name={player2.name}
                  actualValue={p2Value}
                  playerNumber={2}
                  setPlayerValue={setPlayerValue}
                  checkDQ={winnerId === player1.id}
                />
              </View>
            )}
            {reportMode === 'detailed' && (
              <PopupPlayerInfo
                player1={player1}
                player2={player2}
                p1Value={p1Value}
                p2Value={p2Value}
                setPlayerValue={setPlayerValue}
                gameData={gameData}
                setGameData={setGameData}
                videogame={videogame}
              />
            )}
            <View style={styles.popupButtonContainer}>
              <TouchableOpacity
                style={styles.popupCancel}
                onPress={() => {
                  setShowModal(false);
                }}>
                <Text style={styles.popupTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.popupSubmit,
                  {opacity: winnerId === null ? 0.5 : 1},
                ]}
                onPress={() => {
                  if (reportMode === 'quick') {
                    quickReport();
                  } else {
                    detailedReport();
                  }
                  setShowModal(false);
                }}
                disabled={winnerId === null}>
                <Text style={styles.popupSubmitText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </>
    </View>
  );
}

const styles = StyleSheet.create({
  popupContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#252e37',
    position: 'absolute',
    zIndex: 3,
  },
  resultsContainer: {
    width: '100%',
    height: '100%',
    padding: '5%',
    gap: 24,
    justifyContent: 'space-between',
  },
  reportModeContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
  },
  reportModeButton: {
    alignItems: 'center',
  },
  reportModeText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 24,
    borderColor: '#3870e0',
  },
  topView: {
    width: '100%',
    gap: 16,
  },
  topViewPlayer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  playerName: {
    justifyContent: 'center',
  },
  player: {
    width: width * 0.79,
    fontSize: 24,
    fontFamily: 'Roboto-Medium',
    color: '#fffc',
  },
  score: {
    width: width * 0.1,
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'Roboto-Medium',
    color: '#fff',
  },
  quickContainer: {
    gap: 48,
  },
  popupButtonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  popupCancel: {
    backgroundColor: '#737a8f',
    borderRadius: width * 0.01,
    width: width * 0.45 - 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  popupTextCancel: {
    fontFamily: 'Roboto-Medium',
    fontSize: 24,
    color: '#e3eaff',
  },
  popupSubmit: {
    backgroundColor: '#3870e0',
    borderRadius: width * 0.01,
    width: width * 0.45 - 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  popupSubmitText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 24,
    color: '#ffffff',
  },
  loader: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderText: {
    fontFamily: 'Roboto-Regular',
    color: '#fff',
    fontSize: 32,
    marginTop: '5%',
  },
  completedSetContainer: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  close: {
    paddingVertical: 16,
    alignSelf: 'flex-end',
  },
  endedContainer: {
    gap: 24,
  },
  endedMessage: {
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Roboto-LightItalic',
    fontSize: 24,
  },
  openInNew: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#181f28',
    padding: 8,
    borderRadius: width * 0.02,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  openInNewText: {
    color: '#eef8',
    fontFamily: 'Roboto-Medium',
    alignSelf: 'center',
    fontSize: 24,
  },
});
