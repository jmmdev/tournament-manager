/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Header from './Header';
import NotFound from './NotFound';
import Error from './Error';
import SideMenu from './SideMenu';
import LogoutPopup from './LogoutPopup';

import {Icon} from '@rneui/themed';

const dimensions = Dimensions.get('window');
const width = dimensions.width;

export default function TournamentsScreen({navigation, route}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [tournaments, setTournaments] = useState([]);
  const [showError, setShowError] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);

  const userData = useRef(null);

  useEffect(() => {
    getTournaments();
  }, [getTournaments]);

  const getTournaments = useCallback(() => {
    setIsLoaded(false);
    setTournaments([]);
    fetch('https://api.start.gg/gql/alpha', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + route.params.token,
      },
      body: JSON.stringify({
        query: `query User {
        currentUser {
          tournaments (query: {
            perPage: 50
            filter: {tournamentView: "admin"}
          }) {
            nodes {
              id
              name
              startAt
              endAt
              state
              images{
                type
                url
              }
            }
          }
          bio
          images {
            type
            url
          }
          player {
            gamerTag
          }
        }
      }`,
      }),
      operationName: 'User',
    })
      .then(response => response.json())
      .then(json => {
        const tournamentsData = json.data.currentUser.tournaments.nodes;
        //const filteredTournaments = tournamentsData.filter(t => t.state !== 3);
        setTournaments(tournamentsData);

        const images = json.data.currentUser.images;

        userData.current = {
          bio: json.data.currentUser.bio,
          images: images,
          gamerTag: json.data.currentUser.player.gamerTag,
        };

        setIsLoaded(true);
      })
      .catch(error => {
        console.log(error);
        setTimeout(() => {
          setShowError(true);
        }, 1500);
      });
  }, [route.params.token]);

  const renderItem = ({item, index}) => {
    var startDate = new Date(0);
    startDate.setUTCSeconds(item.startAt);

    var endDate = new Date(0);
    endDate.setUTCSeconds(item.endAt);

    var showDate = `${startDate.getDate()}/${
      startDate.getMonth() + 1
    }/${startDate.getFullYear()}`;

    if (startDate.getDate() !== endDate.getDate()) {
      showDate +=
        ' - ' +
        endDate.getDate() +
        '/' +
        (endDate.getMonth() + 1) +
        '/' +
        endDate.getFullYear();
    }

    const images = item.images;
    var profile = null;

    for (let i = 0; i < images.length; i++) {
      var image = images[i];
      if (image.type === 'profile') {
        profile = image.url;
      }
    }

    const state =
      item.state === 3
        ? 'COMPLETED'
        : item.state === 2
        ? 'IN PROGRESS'
        : item.state === 1
        ? 'NOT STARTED'
        : '';

    return (
      <View
        style={[
          styles.item,
          {borderBottomWidth: index < tournaments.length - 1 ? 1 : 0},
        ]}>
        <TouchableOpacity
          style={styles.itemContent}
          onPress={() =>
            navigation.navigate('EventsScreen', {
              id: item.id,
              name: item.name,
              token: route.params.token,
            })
          }>
          <View style={styles.mainItemContent}>
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={
                  {uri: profile} ||
                  require('../../assets/placeholder-profile.png')
                }
              />
            </View>
            <View style={styles.textContent}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.details}>{showDate}</Text>
            </View>
          </View>
          <View style={styles.stateContent}>
            <Text
              style={[
                styles.state,
                item.state === 3
                  ? styles.complete
                  : item.state === 2
                  ? styles.inProgress
                  : item.state === 1
                  ? styles.ready
                  : {},
              ]}>
              {state}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        navigation={navigation}
        canGoBack={false}
        headerText={'My tournaments'}
        rightIconContent={
          <Icon
            name="menu"
            type="material-community"
            color="#fff8"
            size={width * 0.1}
            style={styles.icon}
          />
        }
        rightIconFunction={() => setShowSideMenu(!showSideMenu)}
      />
      {isLoaded && tournaments.length === 0 && (
        <NotFound message="NO TOURNAMENTS FOUND" refresh={getTournaments} />
      )}
      <FlatList
        refreshing={!isLoaded && !showError}
        onRefresh={getTournaments}
        style={styles.tournaments}
        data={tournaments}
        renderItem={renderItem}
      />
      {showSideMenu && (
        <SideMenu
          userData={userData.current}
          setShowLogoutConfirm={setShowLogoutConfirm}
          setShowSideMenu={setShowSideMenu}
        />
      )}
      {showLogoutConfirm && (
        <LogoutPopup
          navigation={navigation}
          showModal={showLogoutConfirm}
          setShowModal={setShowLogoutConfirm}
        />
      )}
      {showError && (
        <Error
          showError={showError}
          setShowError={setShowError}
          refresh={getTournaments}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tournaments: {
    backgroundColor: '#252e37',
  },
  item: {
    width: '100%',
    backgroundColor: '#3b4350',
    borderBottomColor: '#001c',
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
    textShadowRadius: 0.1,
  },
  details: {
    width: '100%',
    color: '#ffffff',
    fontSize: 20,
    fontFamily: 'Roboto-Regular',
    textShadowRadius: 0.1,
  },
  stateContent: {
    alignSelf: 'flex-end',
  },
  state: {
    fontSize: 18,
    fontFamily: 'Roboto-Italic',
  },
  complete: {
    color: '#c3cacf',
  },
  inProgress: {
    color: '#0f9',
  },
  ready: {
    color: '#3870e0',
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
});
