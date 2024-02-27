/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import Header from './Header';
import NotFound from './NotFound';
import Error from './Error';

const dimensions = Dimensions.get('window');
const width = dimensions.width;

export default function GroupsScreen({navigation, route}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState(null);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    getGroups();
  }, [getGroups]);

  const getGroups = useCallback(() => {
    setIsLoaded(false);
    setData([]);
    fetch('https://api.start.gg/gql/alpha', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + route.params.token,
      },
      body: JSON.stringify({
        query: `query Groups ($id: ID) {
            phase (id: $id) {
              phaseGroups {
                nodes {
                  id
                  displayIdentifier
                  state
                }
              }
            }
          }`,
        operationName: 'Groups',
        variables: {
          id: route.params.id,
        },
      }),
    })
      .then(response => response.json())
      .then(json => {
        setData(json.data.phase.phaseGroups.nodes);
        setIsLoaded(true);
      })
      .catch(error => {
        setTimeout(() => {
          setShowError(true);
        }, 1500);
      });
  }, [route.params.id, route.params.token]);

  const renderItem = ({item, index}) => {
    const state =
      item.state === 3 ? 'COMPLETED' : item.state === 2 ? 'IN PROGRESS' : '';
    return (
      <TouchableOpacity
        style={[styles.item, {marginTop: index === 0 ? 16 : 0}]}
        onPress={() => {
          navigation.navigate('SetsScreen', {
            id: item.id,
            phase: '',
            pool: item.displayIdentifier,
            token: route.params.token,
            eventSlug: route.params.eventSlug,
            videogame: route.params.videogame,
          });
        }}>
        <Text style={styles.groupName}>Pool {item.displayIdentifier}</Text>
        <Text
          style={[
            styles.groupState,
            item.state === 3
              ? styles.groupComplete
              : item.state === 2
              ? styles.groupInProgress
              : styles.groupReady,
          ]}>
          {state}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Header
        navigation={navigation}
        canGoBack={true}
        headerText={route.params.phase}
      />
      {isLoaded && data.length === 0 && (
        <NotFound message="NO POOLS FOUND" refresh={getGroups} />
      )}
      <FlatList
        onRefresh={getGroups}
        refreshing={!isLoaded && !showError}
        style={styles.groups}
        data={data}
        renderItem={renderItem}
      />
      {showError && (
        <Error
          showError={showError}
          setShowError={setShowError}
          refresh={getGroups}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  groups: {
    width: '100%',
    backgroundColor: '#252e37',
    paddingLeft: 16,
    paddingRight: 16,
  },
  item: {
    width: '100%',
    padding: '5%',
    backgroundColor: '#3b4350',
    alignSelf: 'center',
    marginBottom: '5%',
    borderRadius: width * 0.01,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  groupName: {
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
    color: '#c3cacf',
    marginBottom: '2%',
  },
  groupState: {
    fontSize: 16,
    fontFamily: 'Roboto-Italic',
  },
  groupComplete: {
    color: '#a0a7b0',
  },
  groupInProgress: {
    color: '#0f9',
  },
  groupReady: {
    color: '#3880ff',
  },
});
