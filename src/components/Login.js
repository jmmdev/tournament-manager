import React, {useEffect} from 'react';
import {WebView} from 'react-native-webview';
import EncryptedStorage from 'react-native-encrypted-storage';

export default function LoginScreen({navigation, route}) {
  const client_secret =
    '37fd1e0d62722360a34c1c0a2cd4e83a507b2ed7be3043d4133da0143351e665';
  const myUrl =
    'https://start.gg/oauth/authorize?response_type=code&client_id=98&scope=user.identity%20tournament.manager%20tournament.reporter&redirect_uri=tournamentmanager%3A%2F%2Flogin';

  useEffect(() => {
    const code = route.params.code;
    if (code) {
      fetch('https://api.start.gg/oauth/access_token', {
        method: 'POST',
        body: JSON.stringify({
          grant_type: 'authorization_code',
          client_secret: client_secret,
          code: code,
          scope: 'user.identity tournament.manager tournament.reporter',
          client_id: 98,
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
                    params: {
                      token: result.access_token,
                    },
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
                    params: {
                      token: result.access_token,
                    },
                  },
                ],
              });
            });
        });
      });
    }
  }, [navigation, route.params.code]);

  return (
    <WebView cacheEnabled={false} incognito={true} source={{uri: myUrl}} />
  );
}
