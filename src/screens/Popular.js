import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import { Text, Title, Button } from 'react-native-paper';
import { map } from 'lodash';
import { Rating } from 'react-native-ratings';
import { getPopularMoviesApi } from '../api/movies';
import { BASE_PATH_IMG } from '../utils/constants';
import usePreferences from '../hooks/usePreferences';
import noImage from '../assets/jpg/default-imgage.png';
import starDark from '../assets/png/starDark.png';
import starLight from '../assets/png/starLight.png';

export default function Popular(props) {
  const { navigation } = props;
  const [movies, setMovies] = useState(null);
  const [showBtnMore, setShowBtnMore] = useState(true);
  const [page, setPage] = useState(1);
  const { theme } = usePreferences();

  useEffect(() => {
    getPopularMoviesApi(page).then((response) => {
      const totalPages = response.total_pages;

      // The results were only kept while `page < totalPages`, so arriving at
      // the final page took the else branch: the button was hidden and the
      // twenty films that had just been downloaded were thrown away. The last
      // page of both listings was unreachable - the request paid for and the
      // response discarded. Appending always, and deciding the button
      // separately, is what was meant.
      //
      // The append also goes through the updater form. Reading `movies` from
      // the closure meant this effect depended on a value that is not in its
      // dependency list, so two responses arriving before a re-render would
      // each start from the same snapshot and the first one's films would be
      // dropped.
      setMovies((previous) =>
        previous ? [...previous, ...response.results] : response.results,
      );

      if (page >= totalPages) {
        setShowBtnMore(false);
      }
    })
      .catch((error) => {
        // fetch() only rejects on network failure and checkResponse() now
        // rejects on any non-2xx, so without this the failure surfaces as an
        // unhandled rejection and the screen just stays empty.
        console.error('TMDb request failed', error);
      });
  }, [page]);

  return (
    <ScrollView>
      {map(movies, (movie, index) => (
        <Movie
          key={index}
          movie={movie}
          theme={theme}
          navigation={navigation}
        />
      ))}
      {showBtnMore && (
        <Button
          mode="contained"
          contentStyle={styles.lodadMoreContainer}
          style={styles.loadMore}
          labelStyle={{ color: theme === 'dark' ? '#fff' : '#000' }}
          onPress={() => setPage(page + 1)}>
          Cargar mas...
        </Button>
      )}
    </ScrollView>
  );
}

function Movie(props) {
  const { movie, theme, navigation } = props;
  const {
    id,
    poster_path,
    title,
    release_date,
    vote_count,
    vote_average,
  } = movie;

  const goMovie = () => {
    navigation.navigate('movie', { id });
  };

  return (
    <TouchableWithoutFeedback onPress={goMovie}>
      <View style={styles.movie}>
        <View style={styles.left}>
          <Image
            style={styles.image}
            source={
              poster_path
                ? { uri: `${BASE_PATH_IMG}/w500${poster_path}` }
                : noImage
            }
          />
        </View>
        <View>
          <Title>{title}</Title>
          <Text>{release_date}</Text>
          <MovieRating
            voteCount={vote_count}
            voteAverage={vote_average}
            theme={theme}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

function MovieRating(props) {
  const { voteCount, voteAverage, theme } = props;
  const media = voteAverage / 2;

  return (
    <View style={styles.viewRating}>
      <Rating
        type="custom"
        ratingImage={theme === 'dark' ? starDark : starLight}
        ratingColor="#ffc205"
        ratingBackgroundColor={theme === 'dark' ? '#192734' : '#f0f0f0'}
        startingValue={media}
        imageSize={20}
        style={{ marginRight: 15 }}
      />
      <Text style={{ fontSize: 12, color: '#8697a5', marginTop: 5 }}>
        {voteCount} votos
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  movie: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  left: {
    marginRight: 20,
  },
  image: {
    width: 100,
    height: 150,
  },
  viewRating: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  lodadMoreContainer: {
    paddingTop: 10,
    paddingBottom: 30,
  },
  loadMore: {
    backgroundColor: 'transparent',
  },
});
