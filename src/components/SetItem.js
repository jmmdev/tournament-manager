/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Dimensions,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon} from '@rneui/themed';

const dimensions = Dimensions.get('window');
const width = dimensions.width;

export default function SetItem({
  item,
  index,
  token,
  setShowError,
  eventSlug,
  setPlayer1,
  setPlayer2,
  setSetID,
  setMainEntrant,
  setShowModal,
  replaceSetAtIndex,
}) {
  /*function callSet(id) {
    fetch('https://api.start.gg/gql/alpha', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        query: `mutation callSet($setId: ID!) {
                  markSetCalled(setId: $setId) {
                    id
                    state
                  }
                }`,
        operationName: 'callSet',
        variables: {
          setId: id,
        },
      }),
    })
      .then(getSets(showComplete))
      .catch(error => {
        console.error(error);
      });
  }*/

  function startSet(id) {
    fetch('https://api.start.gg/gql/alpha', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        query: `mutation startSet($setId: ID!) {
                  markSetInProgress(setId: $setId) {
                    id
                    startedAt
                    state
                  }
                }`,
        operationName: 'startSet',
        variables: {
          setId: id,
        },
      }),
    })
      .then(response => response.json())
      .then(json => replaceSetAtIndex(index, json.data.markSetInProgress))
      .catch(error => {
        console.error(error);
      });
  }

  const entrant1 = item.slots[0].entrant;
  const entrant2 = item.slots[1].entrant;

  const winnerId = item.winnerId;

  let fullRoundText = item.fullRoundText;

  if (fullRoundText.includes('-Final')) {
    fullRoundText = fullRoundText.replace('-Final', 's');
  } else if (fullRoundText.includes('Final')) {
    fullRoundText = fullRoundText.replace('Final', 'Finals');
  }

  let prefix1 = '';
  let prefix2 = '';
  let prefix3 = '';
  let prefix4 = '';
  let gamerTag1 = '';
  let gamerTag2 = '';
  let gamerTag3 = '';
  let gamerTag4 = '';

  const isTeams =
    entrant1.participants.length > 1 && entrant2.participants.length > 1;

  const p1 = entrant1.participants[0].prefix;

  prefix1 =
    p1 !== null && p1.length > 0 ? entrant1.participants[0].prefix + ' ' : '';
  gamerTag1 = entrant1.participants[0].gamerTag;

  const p2 = entrant2.participants[0].prefix;

  prefix2 =
    p2 !== null && p2.length > 0 ? entrant2.participants[0].prefix + ' ' : '';
  gamerTag2 = entrant2.participants[0].gamerTag;

  if (isTeams) {
    const p3 = entrant1.participants[1].prefix;
    prefix3 =
      p3 !== null && p3.length > 0 ? entrant1.participants[1].prefix + ' ' : '';
    gamerTag3 = entrant1.participants[1].gamerTag;

    const p4 = entrant2.participants[1].prefix;
    prefix4 =
      p4 !== null && p4.length > 0 ? entrant2.participants[1].prefix + ' ' : '';
    gamerTag4 = entrant2.participants[1].gamerTag;
  }

  let score = item.displayScore;
  let scores;

  if (score) {
    scores = getSetScore(winnerId, gamerTag1, entrant1.id, entrant2.id, score);
  } else {
    scores = null;
  }

  const state =
    item.state === 6
      ? 'CALLED'
      : item.state === 3
      ? 'COMPLETED'
      : item.state === 2
      ? 'IN PROGRESS'
      : item.state === 1
      ? 'NOT STARTED'
      : '';

  return (
    <View style={styles.item}>
      <View style={styles.setDetails}>
        <Text style={styles.setRound}>{fullRoundText}</Text>
        <View style={styles.setState}>
          <Text
            style={[
              styles.setStateText,
              item.state === 6
                ? styles.setCalled
                : item.state === 3
                ? styles.setComplete
                : item.state === 2
                ? styles.setInProgress
                : item.state === 1
                ? styles.setReady
                : {},
            ]}>
            {state}
          </Text>
        </View>
      </View>
      <View style={styles.matchContainer}>
        <View
          style={[
            styles.playerContainer,
            {
              backgroundColor:
                entrant1.id === winnerId
                  ? '#085'
                  : entrant2.id === winnerId
                  ? '#900'
                  : '#ffffff18',
            },
          ]}>
          <View
            style={[
              styles.playerNameContainer,
              {width: scores ? '85%' : '100%'},
            ]}>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={[
                styles.setName,
                {
                  color:
                    entrant1.id === winnerId
                      ? '#bfd'
                      : entrant2.id === winnerId
                      ? '#fbb'
                      : '#808790',
                },
              ]}>
              {prefix1}
              <Text style={[styles.setName, styles.gamerTag]}>{gamerTag1}</Text>
              {isTeams && (
                <>
                  <Text style={styles.setName}>{' / '}</Text>
                  <Text
                    style={[
                      styles.setName,
                      {
                        color:
                          entrant1.id === winnerId
                            ? '#bfd'
                            : entrant2.id === winnerId
                            ? '#fbb'
                            : '#808790',
                      },
                    ]}>
                    {prefix3}
                    <Text style={[styles.setName, styles.gamerTag]}>
                      {gamerTag3}
                    </Text>
                  </Text>
                </>
              )}
            </Text>
          </View>
          {scores && <Text style={styles.setScore}>{scores.score1}</Text>}
        </View>
        <View
          style={[
            styles.playerContainer,
            {
              backgroundColor:
                entrant2.id === winnerId
                  ? '#085'
                  : entrant1.id === winnerId
                  ? '#900'
                  : '#ffffff18',
            },
          ]}>
          <View
            style={[
              styles.playerNameContainer,
              {width: scores ? '85%' : '100%'},
            ]}>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={[
                styles.setName,
                {
                  color:
                    entrant2.id === winnerId
                      ? '#bfd'
                      : entrant1.id === winnerId
                      ? '#fbb'
                      : '#808790',
                },
              ]}>
              {prefix2}
              <Text style={[styles.setName, styles.gamerTag]}>{gamerTag2}</Text>
              {isTeams && (
                <>
                  <Text style={styles.setName}>{' / '}</Text>
                  <Text
                    style={[
                      styles.setName,
                      {
                        color:
                          entrant2.id === winnerId
                            ? '#bfd'
                            : entrant1.id === winnerId
                            ? '#fbb'
                            : '#808790',
                      },
                    ]}>
                    {prefix4}
                  </Text>
                  <Text style={[styles.setName, styles.gamerTag]}>
                    {gamerTag4}
                  </Text>
                </>
              )}
            </Text>
          </View>
          {scores && <Text style={styles.setScore}>{scores.score2}</Text>}
        </View>
      </View>
      <View style={styles.setActions}>
        <View style={styles.leftActions}>
          {/*item.state === 1 && (
            <TouchableOpacity onPress={() => callSet(item.id)}>
              <Icon
                name="bell"
                type="material-community"
                color={'#fff4'}
                size={36}
              />
            </TouchableOpacity>
          )*/}
          {(item.state === 1 || item.state === 6) && (
            <TouchableOpacity onPress={() => startSet(item.id)}>
              <Icon
                name="play"
                type="material-community"
                color={'#fff4'}
                size={width * 0.1}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={item.state === 3 ? styles.openInNew : {}}
            onPress={() =>
              Linking.openURL(
                `https://www.start.gg/${eventSlug}/set/${item.id}/report`,
              ).catch(err => {
                console.log(err);
                setShowError(true);
              })
            }>
            <Icon
              name="open-in-new"
              type="material-community"
              color={item.state === 3 ? '#eef8' : '#fff4'}
              size={width * 0.08}
            />
            {item.state === 3 && (
              <Text style={styles.openInNewText}>Modify in browser</Text>
            )}
          </TouchableOpacity>
        </View>
        {item.state !== 3 && (
          <TouchableOpacity
            style={styles.reportButton}
            onPress={() => {
              setPlayer1(entrant1);
              setPlayer2(entrant2);
              setSetID(item.id);
              setMainEntrant(entrant1.id);
              setShowModal(true);
            }}>
            <Text style={styles.reportText}>Report</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

RegExp.quote = function (str) {
  return str.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
};

function getSetScore(
  winnerId,
  gamerTag1,
  entrant1Id,
  entrant2Id,
  displayScore,
) {
  let score1, score2;

  if (displayScore !== 'DQ') {
    const re = new RegExp(`.*${RegExp.quote(gamerTag1)} {1}`, 'g');
    const score = displayScore.replace(re, '');

    score1 = score ? score.charAt(0) : 0;
    score2 = score ? score.charAt(score.length - 1) : 0;
  } else {
    if (winnerId === entrant1Id) {
      score1 = '';
      score2 = 'DQ';
    } else if (winnerId === entrant2Id) {
      score1 = 'DQ';
      score2 = '';
    }
  }

  return {score1: score1, score2: score2};
}

const styles = StyleSheet.create({
  item: {
    width: '100%',
    padding: '5%',
    backgroundColor: '#3b4350',
    alignSelf: 'center',
    flexDirection: 'column',
    gap: 24,
    borderRadius: width * 0.01,
  },
  matchContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  playerContainer: {
    flexDirection: 'row',
    padding: 8,
    borderRadius: width * 0.01,
  },
  playerNameContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  setName: {
    color: '#fffc',
    fontSize: 26,
    fontFamily: 'Roboto-Bold',
  },
  setScore: {
    width: '15%',
    fontSize: 26,
    fontFamily: 'Roboto-Bold',
    color: '#fffd',
    textAlign: 'center',
    fontWeight: '900',
  },
  prefix: {
    color: '#808790',
  },
  gamerTag: {
    color: '#ffffee',
  },
  setState: {
    alignItems: 'flex-end',
  },
  setStateText: {
    fontSize: 20,
    fontFamily: 'Roboto-Italic',
    textAlign: 'right',
  },
  timer: {
    fontFamily: 'Roboto-Italic',
    color: '#00ff00',
    fontSize: 20,
  },
  setCalled: {
    color: '#ff0',
  },
  setComplete: {
    color: '#c3cacf',
  },
  setInProgress: {
    color: '#0f9',
  },
  setReady: {
    color: '#3870e0',
  },
  setRound: {
    fontSize: 20,
    fontFamily: 'Roboto-Italic',
    color: '#c3cacf',
  },
  toggle: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  setDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  setActions: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  openInNew: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#202730',
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
  reportButton: {
    paddingVertical: width * 0.02,
    paddingHorizontal: width * 0.05,
    backgroundColor: '#3870e0',
    borderRadius: width * 0.02,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportText: {
    fontFamily: 'Roboto-Medium',
    color: '#fff',
    fontSize: 24,
  },
});
