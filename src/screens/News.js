import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import { Button, Text } from 'react-native-paper';
import { map } from 'lodash';
import { getNewsMoviesApi } from '../api/movies';
import { BASE_PATH_IMG } from '../utils/constants';
import usePreferences from '../hooks/usePreferences';

const { width } = Dimensions.get('window');

export default function News(props) {
  const { navigation } = props;
  const [movies, setMovies] = useState(null);
  const [page, setPage] = useState(1);
  const [showBtnMore, setShowBtnMore] = useState(true);
  // Starts true: a page is already being fetched on mount.
  const [loading, setLoading] = useState(true);
  // The ref, not the state above, is what actually gates a press.
  // setLoading happens inside a passive effect, which React runs after
  // paint, so two taps delivered in the same batch both still see
  // `loading === false` and both advance the page. React then coalesces
  // them into a single render and the effect runs once, for the last
  // page - the page in between is never requested and its films are lost
  // for good. A ref updates synchronously, inside the handler, so the
  // second press is refused before it can advance anything.
  const loadingRef = useRef(true);
  const { theme } = usePreferences();

  useEffect(() => {
    // Guards a response that comes back after this effect has been
    // superseded or the screen has gone, so a stale page cannot append
    // itself or set state on an unmounted component.
    let active = true;

    loadingRef.current = true;
    setLoading(true);

    getNewsMoviesApi(page).then((response) => {
      if (!active) {
        return;
      }

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
        if (!active) {
          return;
        }

        // fetch() only rejects on network failure and checkResponse() now
        // rejects on any non-2xx, so without this the failure surfaces as an
        // unhandled rejection and the screen just stays empty.
        console.error('TMDb request failed', error);
      })
      .finally(() => {
        // A superseded effect must not release the lock: a newer one is in
        // flight and holds it.
        if (!active) {
          return;
        }

        loadingRef.current = false;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page]);

  const loadMore = () => {
    if (loadingRef.current) {
      return;
    }

    loadingRef.current = true;
    setLoading(true);
    setPage((previous) => previous + 1);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {map(movies, (movie, index) => (
          <Movie key={index} movie={movie} navigation={navigation} />
        ))}
      </View>
      {showBtnMore && (
        <Button
          mode="contained"
          contentStyle={styles.loadMoreContainer}
          style={styles.loadMore}
          labelStyle={{ color: theme === 'dark' ? '#fff' : '#000' }}
          loading={loading}
          disabled={loading}
          onPress={loadMore}>
          Cargar mas...
        </Button>
      )}
    </ScrollView>
  );
}

function Movie(props) {
  const { movie, navigation } = props;
  const { id, title, poster_path } = movie;

  const goMovie = () => {
    navigation.navigate('movie', { id });
  };

  return (
    <TouchableWithoutFeedback onPress={goMovie}>
      <View style={styles.movie}>
        {poster_path ? (
          <Image
            style={styles.image}
            source={{ uri: `${BASE_PATH_IMG}/w500${poster_path}` }}
          />
        ) : (
          <Text>{title}</Text>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  movie: {
    width: width / 2,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadMoreContainer: {
    paddingTop: 10,
    paddingBottom: 30,
  },
  loadMore: {
    backgroundColor: 'transparent',
  },
});
