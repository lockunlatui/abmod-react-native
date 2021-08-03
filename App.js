/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';

import {Button, StyleSheet, View, Text} from 'react-native';

import admob, {
  InterstitialAd,
  MaxAdContentRating,
} from '@react-native-firebase/admob';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  RewardedAd,
  RewardedAdEventType,
} from '@react-native-firebase/admob';

const adUnitId = 'ca-app-pub-6756082103235422/8953132184';

const rewarded = RewardedAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['english', 'study-english'],
});

function AdButton() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const eventListener = rewarded.onAdEvent((type, error, reward) => {
      console.log('type ==>', type);
      console.log('error ==>', error);
      console.log('type ==>', RewardedAdEventType.LOADED);
      if (type === RewardedAdEventType.LOADED) {
        setLoaded(true);
      }
      if (type === RewardedAdEventType.EARNED_REWARD) {
        console.log('User earned reware of ', reward);
      }
    });

    rewarded.load();

    return () => {
      eventListener();
    };
  }, []);

  if (!loaded) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Button title="Show Ad" onPress={() => rewarded.show()} />
    </View>
  );
}

const App = () => {
  useEffect(() => {
    admob().setRequestConfiguration({
      maxAdContentRating: MaxAdContentRating.PG,
      tagForChildDirectedTreatment: true,
      tagForUnderAgeOfConsent: true,
    });
  }, []);

  return (
    <View style={styles.container}>
      <AdButton />
      <BannerAd unitId={adUnitId} size={BannerAdSize.MEDIUM_RECTANGLE} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
