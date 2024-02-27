/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Dimensions, FlatList, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Icon} from '@rneui/themed';
import Header from './Header';
import ResultInput from './ResultInput';
import NotFound from './NotFound';
import Error from './Error';
import SetItem from './SetItem';

const dimensions = Dimensions.get('window');
const width = dimensions.width;
const height = dimensions.height;

export default function SetsScreen({navigation, route}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);
  const [fullGroupName, setFullGroupName] = useState('');
  const [showResultInput, setShowResultInput] = useState(false);

  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);

  const [setId, setSetID] = useState(null);

  const [showComplete, setShowComplete] = useState(false);
  const [showError, setShowError] = useState(false);

  const [mainEntrant, setMainEntrant] = useState(null);

  const flatList = useRef(null);
  const flatListOffset = useRef(0);

  useEffect(() => {
    getSets(true);
  }, [getSets]);

  useEffect(() => {
    if (!showResultInput) {
      flatList.current.scrollToOffset({
        offset: flatListOffset.current,
        animated: false,
      });
    }
  }, [showResultInput]);

  const getSets = useCallback(
    toShowComplete => {
      setIsLoaded(false);
      fetch('https://api.start.gg/gql/alpha', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + route.params.token,
        },
        body: JSON.stringify({
          query: `query Sets ($id: ID, $filters: SetFilters) {
            phaseGroup (id: $id) {
              sets (filters: $filters, perPage: 100) {
                nodes {
                  id
                  fullRoundText
                  round
                  slots {
                    entrant {
                      id
                      name
                      participants {
                          prefix
                          gamerTag
                      }	  
                    }
                  }
                  state
                  displayScore
                  winnerId
                  startedAt
                }
              }
            }
          }`,
          operationName: 'Sets',
          variables: {
            id: route.params.id,
            filters: {
              state: toShowComplete ? [1, 2, 3, 6] : [1, 2, 6],
            },
          },
        }),
      })
        .then(response => response.json())
        .then(json => {
          const filteredData = json.data.phaseGroup.sets.nodes.filter(
            entry =>
              entry.slots[0].entrant !== null &&
              entry.slots[1].entrant !== null,
          );
          setFullGroupName(
            (route.params.phase !== '' ? route.params.phase : '') +
              (route.params.pool !== '' ? 'Pool ' + route.params.pool : ''),
          );
          setData(filteredData);
          setIsLoaded(true);
        })
        .catch(error => {
          console.log(error);
          setShowError(true);
        });
    },
    [
      route.params.id,
      route.params.phase,
      route.params.pool,
      route.params.token,
    ],
  );

  const renderItem = ({item, index}) => {
    if (showComplete || (!showComplete && item.state !== 3)) {
      return (
        <SetItem
          key={item.id}
          item={item}
          index={index}
          token={route.params.token}
          setShowError={setShowError}
          eventSlug={route.params.eventSlug}
          setPlayer1={setPlayer1}
          setPlayer2={setPlayer2}
          setSetID={setSetID}
          setMainEntrant={setMainEntrant}
          setShowModal={setShowResultInput}
          replaceSetAtIndex={replaceSetAtIndex}
        />
      );
    } else {
      return null;
    }
  };

  const replaceSetAtIndex = (index, set) => {
    const actualSets = [...data];
    actualSets[index] = set;
    setData(actualSets);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Header
        navigation={navigation}
        canGoBack={true}
        headerText={fullGroupName}
        rightIconContent={
          <Icon
            color="#fff8"
            name={showComplete ? 'eye-remove' : 'eye-check'}
            size={width * 0.09}
            type="material-community"
          />
        }
        rightIconFunction={() => {
          setIsLoaded(false);
          setTimeout(() => {
            setShowComplete(!showComplete);
            setIsLoaded(true);
          }, 1000);
        }}
      />
      {isLoaded &&
        (data.length === 0 ||
          data.filter(set => showComplete || (!showComplete && set.state !== 3))
            .length === 0) && (
          <NotFound
            message={
              '[NO SETS FOUND]: Maybe there are no sets ready or every set is complete'
            }
            refresh={() => {
              getSets(showComplete);
            }}
          />
        )}
      <View style={styles.setsContainer}>
        {!isLoaded && <View style={styles.listOverlay} />}
        {!showResultInput && (
          <FlatList
            onScroll={e =>
              (flatListOffset.current = e.nativeEvent.contentOffset.y)
            }
            showsVerticalScrollIndicator={false}
            ref={flatList}
            refreshing={!isLoaded && !showError}
            onRefresh={() => {
              getSets(showComplete);
            }}
            style={[styles.sets, {display: showResultInput ? 'none' : 'flex'}]}
            data={data}
            renderItem={renderItem}
            contentContainerStyle={{gap: height * 0.03, padding: '5%'}}
          />
        )}
      </View>
      {showResultInput && (
        <ResultInput
          setId={setId}
          mainEntrant={mainEntrant}
          player1={player1}
          player2={player2}
          setShowModal={setShowResultInput}
          token={route.params.token}
          getSets={() => getSets(showComplete)}
          videogame={route.params.videogame}
          eventSlug={route.params.eventSlug}
          replaceSetAtIndex={replaceSetAtIndex}
        />
      )}
      {showError && (
        <Error
          showError={showError}
          setShowError={setShowError}
          refresh={() => getSets(showComplete)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  setsContainer: {
    width: '100%',
    height: '92%',
    backgroundColor: '#252e37',
    position: 'relative',
  },
  listOverlay: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    backgroundColor: '#0008',
  },
  sets: {
    width: '100%',
    backgroundColor: 'transparent',
  },
});
