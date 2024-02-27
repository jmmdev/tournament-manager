import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon} from '@rneui/themed';

const dimensions = Dimensions.get('window');
const width = dimensions.width;

export default function Header({
  navigation,
  canGoBack,
  headerText,
  rightIconContent,
  rightIconFunction,
}) {
  return (
    <>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {canGoBack && (
            <TouchableOpacity
              style={styles.icon}
              onPress={() => navigation.goBack()}>
              <Icon
                color="#fff"
                name="arrow-back-ios"
                size={26}
                type="material"
              />
            </TouchableOpacity>
          )}
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={[
              styles.headerText,
              {
                width:
                  canGoBack && rightIconContent
                    ? width * 0.65
                    : canGoBack
                    ? width * 0.8
                    : rightIconContent
                    ? width * 0.75
                    : '100%',
              },
            ]}>
            {headerText}
          </Text>
        </View>
        {rightIconContent && (
          <TouchableOpacity style={styles.icon} onPress={rightIconFunction}>
            {rightIconContent}
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    height: '8%',
    flexDirection: 'row',
    backgroundColor: '#1e2125',
    paddingHorizontal: '5%',
    justifyContent: 'space-between',
  },
  headerLeft: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerText: {
    color: 'white',
    fontFamily: 'Roboto-Bold',
    fontSize: 26,
  },
  icon: {
    width: width * 0.1,
    justifyContent: 'center',
  },
});
