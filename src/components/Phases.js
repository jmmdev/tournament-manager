/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import Header from './Header';
import NotFound from './NotFound';
import Error from './Error';

const dimensions = Dimensions.get('window');
const width = dimensions.width;

export default function PhasesScreen({navigation, route}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState({});
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    getPhases();
  }, [getPhases]);

  const getPhases = useCallback(() => {
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
        query: `query Phases ($id: ID) {
            event (id: $id) {
              name
              phases {
                id
                name
                state
                phaseGroups {
                  nodes {
                    id
                    displayIdentifier
                    state
                  }
                }
              }
            }
          }`,
        operationName: 'Phases',
        variables: {
          id: route.params.id,
        },
      }),
    })
      .then(response => response.json())
      .then(json => {
        setData(json.data.event.phases);
        setIsLoaded(true);
      })
      .catch(error => {
        setTimeout(() => {
          setShowError(true);
        }, 1500);
      });
  }, [route.params.id, route.params.token]);

  const checkGroups = ({item}) => {
    const groups = item.phaseGroups.nodes;

    if (groups.length === 1) {
      navigation.navigate('SetsScreen', {
        id: groups[0].id,
        phase: item.name,
        pool: '',
        token: route.params.token,
        tournamentSlug: route.params.tournamentSlug,
        eventSlug: route.params.eventSlug,
        videogame: route.params.videogame,
      });
    } else if (groups.length > 1) {
      navigation.navigate('GroupsScreen', {
        id: item.id,
        phase: item.name,
        groups: groups,
        token: route.params.token,
        eventSlug: route.params.eventSlug,
        videogame: route.params.videogame,
      });
    }
  };

  const renderItem = ({item, index}) => {
    const state =
      item.state === 'COMPLETED'
        ? 'COMPLETED'
        : item.state === 'ACTIVE'
        ? 'IN PROGRESS'
        : item.state === 'CREATED' || item.state === 'READY'
        ? 'NOT STARTED'
        : '';
    return (
      <TouchableOpacity
        style={[
          styles.item,
          index === 0
            ? {marginTop: '5%', marginBottom: '5%'}
            : {marginBottom: '5%'},
        ]}
        onPress={() => checkGroups({item})}>
        <Text style={styles.phaseName}>{item.name}</Text>
        <Text
          style={[
            styles.phaseState,
            item.state === 'COMPLETED'
              ? styles.phaseComplete
              : item.state === 'ACTIVE'
              ? styles.phaseInProgress
              : item.state === 'CREATED' || item.state === 'READY'
              ? styles.phaseReady
              : {},
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
        headerText={route.params.name}
      />
      {isLoaded && data.length === 0 && (
        <NotFound message="NO PHASES FOUND" refresh={getPhases} />
      )}
      <FlatList
        refreshing={!isLoaded && !showError}
        onRefresh={getPhases}
        style={styles.phases}
        data={data}
        renderItem={renderItem}
      />
      {showError && (
        <Error
          showError={showError}
          setShowError={setShowError}
          refresh={getPhases}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerText: {
    width: '70%',
    color: '#ffffff',
    fontFamily: 'Roboto-Bold',
    marginLeft: '5%',
  },
  icon: {
    display: 'flex',
    justifyContent: 'center',
    opacity: 1,
  },
  phases: {
    width: '100%',
    backgroundColor: '#252e37',
    paddingHorizontal: '5%',
  },
  item: {
    width: '100%',
    padding: '5%',
    backgroundColor: '#3b4350',
    alignSelf: 'center',
    marginBottom: '5%',
    borderRadius: width * 0.01,
  },
  phaseName: {
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
    color: '#c3cacf',
    marginBottom: '2%',
    alignSelf: 'flex-start',
  },
  phaseState: {
    fontSize: 18,
    fontFamily: 'Roboto-Italic',
    alignSelf: 'flex-end',
  },
  phaseComplete: {
    color: '#a0a7b0',
  },
  phaseInProgress: {
    color: '#0f9',
  },
  phaseReady: {
    color: '#3880ff',
  },
});
