/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon} from '@rneui/themed';

const dimensions = Dimensions.get('window');
const width = dimensions.width;

export default function SideMenu({
  userData,
  setShowSideMenu,
  setShowLogoutConfirm,
}) {
  const slideAnim = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [slideAnim]);

  const hide = () => {
    Animated.timing(slideAnim, {
      toValue: -width,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  return (
    <Animated.View style={[styles.sideMenu, {left: slideAnim}]}>
      <View style={styles.mainContainer}>
        <View style={styles.topContainer}>
          <ImageBackground
            source={
              userData.images &&
              (userData.images[0].type === 'banner'
                ? {uri: userData.images[0].url}
                : userData.images[1].type === 'banner'
                ? {uri: userData.images[1].url}
                : require('../../assets/placeholder-banner.png'))
            }
            imageStyle={{opacity: 0.3}}
            style={{height: '100%'}}>
            <View style={{height: '100%', padding: width * 0.04}}>
              <TouchableOpacity
                style={styles.close}
                onPress={() => {
                  hide();
                  setTimeout(() => {
                    setShowSideMenu(false);
                  }, 200);
                }}>
                <Icon
                  name="arrow-left"
                  type="material"
                  color="#fffd"
                  size={Math.min(40, width * 0.09)}
                />
              </TouchableOpacity>
              <View style={styles.profile}>
                <Image
                  source={
                    userData.images &&
                    (userData.images[0].type === 'profile'
                      ? {uri: userData.images[0].url}
                      : userData.images[1].type === 'profile'
                      ? {uri: userData.images[1].url}
                      : require('../../assets/placeholder-profile.png'))
                  }
                  style={styles.profilePic}
                />
                <View>
                  <Text adjustsFontSizeToFit={true} style={styles.gamerTag}>
                    {userData.gamerTag.length > 16
                      ? userData.gamerTag.substr(0, 13) + '...'
                      : userData.gamerTag}
                  </Text>
                  {userData.bio && (
                    <Text adjustsFontSizeToFit={true} style={styles.bio}>
                      {userData.bio}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.bottomContainer}>
          <View />
          <TouchableOpacity
            style={styles.logout}
            onPress={() => {
              setShowLogoutConfirm(true);
            }}>
            <Text style={styles.logoutText}>Logout</Text>
            <Icon
              color="#fffc"
              name="logout"
              size={width * 0.06}
              type="material"
            />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sideMenu: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    zIndex: 300,
    backgroundColor: '#1e2125',
  },
  mainContainer: {
    width: '100%',
    height: '100%',
  },
  topContainer: {
    width: '100%',
    height: width * 0.24,
    borderBottomWidth: 1,
    borderBottomColor: '#fff4',
  },
  close: {
    position: 'absolute',
    top: width * 0.02,
    right: width * 0.02,
  },
  profile: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    gap: width * 0.04,
    alignItems: 'center',
  },
  profilePic: {
    width: width * 0.16,
    aspectRatio: 1,
    borderRadius: 2000,
    borderWidth: 1,
    borderColor: '#fff',
  },
  gamerTag: {
    width: width * 0.55,
    fontSize: Math.max(36, width * 0.03),
    color: '#fff',
    fontFamily: 'Roboto-Medium',
  },
  bio: {
    fontSize: 18,
    color: '#fffc',
    fontFamily: 'Roboto-Light',
  },
  bottomContainer: {
    flex: 1,
    padding: width * 0.04,
    justifyContent: 'space-between',
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: width * 0.04,
    paddingVertical: width * 0.02,
    backgroundColor: '#802',
    borderRadius: 8,
    gap: width * 0.01,
  },
  logoutText: {
    fontFamily: 'Roboto-Medium',
    fontSize: Math.max(width * 0.02, 24),
    color: '#fffc',
  },
});
