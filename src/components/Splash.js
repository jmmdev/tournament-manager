import React, {useEffect} from 'react';
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';

export default function SplashScreen({navigation}) {
  const client_secret =
    '37fd1e0d62722360a34c1c0a2cd4e83a507b2ed7be3043d4133da0143351e665';

  useEffect(() => {
    async function load() {
      EncryptedStorage.getItem('credentials')
        .then(res => {
          const credentials = JSON.parse(res);
          const now = Math.round(Date.now() / 1000);
          if (now >= credentials.created + credentials.expires_in) {
            navigation.reset({
              index: 0,
              routes: [{name: 'LoginScreen', params: {}}],
            });
          } else {
            if (now >= credentials.created + credentials.expires_in / 2) {
              fetch('https://api.start.gg/oauth/refresh', {
                method: 'POST',
                body: JSON.stringify({
                  grant_type: 'refresh_token',
                  scope: 'user.identity tournament.manager tournament.reporter',
                  client_id: 98,
                  client_secret: client_secret,
                  redirect_uri: 'tournamentmanager://login',
                }),
                headers: {
                  'Content-type': 'application/json; charset=UTF-8',
                },
              }).then(response => {
                response.json().then(result => {
                  const value = JSON.stringify({
                    access_token: result.access_token,
                    created: Math.round(Date.now() / 1000),
                    expires_in: result.expires_in,
                    refresh_token: result.refresh_token,
                  });
                  EncryptedStorage.setItem('credentials', value)
                    .then(() => {
                      navigation.reset({
                        index: 0,
                        routes: [
                          {
                            name: 'TournamentsScreen',
                            params: {token: result.access_token},
                          },
                        ],
                      });
                    })
                    .catch(err => {
                      console.log(err.message);
                      navigation.reset({
                        index: 0,
                        routes: [
                          {
                            name: 'TournamentsScreen',
                            params: {token: result.access_token},
                          },
                        ],
                      });
                    });
                });
              });
            } else {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'TournamentsScreen',
                    params: {token: credentials.access_token},
                  },
                ],
              });
            }
          }
        })
        .catch(() => {
          navigation.reset({
            index: 0,
            routes: [{name: 'LoginScreen', params: {}}],
          });
        });
    }

    async function start() {
      try {
        await new Promise(resolve => {
          setTimeout(resolve, 5000);
        });
      } catch (e) {
        console.log(e);
      } finally {
        load();
      }
    }
    start();
  });

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{
          uri: 'https://i.imgur.com/kYXPiTN.png',
        }}
        resizeMode="cover"
        style={styles.bgImage}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            {
              'All media and content used are the property of start.gg\nThis application is a personal project intended for gaming communities and has no commercial purpose'
            }
          </Text>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    padding: 0,
  },
  bgImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  textContainer: {
    width: '100%',
    padding: '5%',
  },
  text: {
    width: '100%',
    color: '#ffffff',
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
  },
});
