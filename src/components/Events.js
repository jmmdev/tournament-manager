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

export default function EventsScreen({navigation, route}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  const getEvents = useCallback(() => {
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
        query: `query Events ($id: ID) {
            tournament (id: $id) {
              events {
                id
                name
                state
                numEntrants
                slug
                videogame {
                  characters {
                    id
                    images(type: "stockIcon") {
                      url
                    }
                    name
                  }
                }
              }
            }
          }`,
        operationName: 'Events',
        variables: {
          id: route.params.id,
        },
      }),
    })
      .then(response => response.json())
      .then(json => {
        setData(json.data.tournament.events);
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
      item.state === 'COMPLETED'
        ? 'COMPLETED'
        : item.state === 'ACTIVE'
        ? 'IN PROGRESS'
        : 'NOT STARTED';
    return (
      <TouchableOpacity
        style={[styles.item, {marginTop: index === 0 ? '5%' : '0%'}]}
        onPress={() =>
          navigation.navigate('PhasesScreen', {
            id: item.id,
            name: item.name,
            token: route.params.token,
            eventSlug: item.slug,
            videogame: item.videogame,
          })
        }>
        <Text style={styles.eventName}>{item.name}</Text>
        <Text style={styles.eventEntrants}>{item.numEntrants} entrants</Text>
        <Text
          style={[
            styles.eventState,
            item.state === 'COMPLETED'
              ? styles.eventComplete
              : item.state === 'ACTIVE'
              ? styles.eventInProgress
              : styles.eventReady,
          ]}>
          {state}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        navigation={navigation}
        canGoBack={true}
        headerText={route.params.name}
      />
      {isLoaded && data.length === 0 && (
        <NotFound message="NO EVENTS FOUND" refresh={getEvents} />
      )}
      <FlatList
        refreshing={!isLoaded && !showError}
        onRefresh={getEvents}
        style={styles.events}
        data={data}
        renderItem={renderItem}
      />
      {showError && (
        <Error
          showError={showError}
          setShowError={setShowError}
          refresh={getEvents}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: {
    display: 'flex',
    justifyContent: 'center',
    opacity: 1,
  },
  events: {
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
  eventName: {
    fontSize: 24,
    fontFamily: 'Roboto-Bold',
    color: '#c3cacf',
  },
  eventState: {
    fontSize: 20,
    alignSelf: 'flex-end',
    fontFamily: 'Roboto-Italic',
  },
  eventComplete: {
    color: '#c3cacf',
  },
  eventInProgress: {
    color: '#0f9',
  },
  eventReady: {
    color: '#3870e0',
  },
  eventEntrants: {
    fontSize: 18,
    color: '#c3cacf',
    marginBottom: '4%',
    fontFamily: 'Roboto-Regular',
  },
});
