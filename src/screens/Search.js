import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
} from 'react-native';
import { Searchbar } from 'react-native-paper';
import { size, map } from 'lodash';
import { searchMoviesApi } from '../api/movies';
import { BASE_PATH_IMG } from '../utils/constants';

const { width } = Dimensions.get('window');

/** How long typing has to pause before a search is sent. */
const SEARCH_DEBOUNCE_MS = 350;

export default function Search(props) {
  const { navigation } = props;
  const [movies, setMovies] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (size(search) <= 2) {
      return undefined;
    }

    // One request per keystroke, and nothing tied a response back to the term
    // that asked for it: typing "batman" starts four searches, and whichever
    // answers last wins. TMDb answering "bat" after "batman" left the screen
    // showing results for a term the user had already finished typing.
    //
    // The timer collapses a burst of keystrokes into a single request, and the
    // flag makes a response that arrives after the effect was torn down - a
    // superseded term, or a screen the user has left - a no-op.
    let current = true;

    const timer = setTimeout(() => {
      searchMoviesApi(search)
        .then((response) => {
          if (current) {
            setMovies(response.results);
          }
        })
        .catch((error) => {
          // fetch() only rejects on network failure and checkResponse() now
          // rejects on any non-2xx, so without this the failure surfaces as an
          // unhandled rejection and the screen just stays empty.
          console.error('TMDb request failed', error);
        });
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      current = false;
      clearTimeout(timer);
    };
  }, [search]);

  return (
    <SafeAreaView>
      <Searchbar
        placeholder="Busca tu película"
        iconColor={Platform.OS === 'ios' && 'transparent'}
        icon="arrow-left"
        style={styles.input}
        onChangeText={(e) => setSearch(e)}
      />
      <ScrollView>
        <View style={styles.container}>
          {/* Keyed by movie id, not by position: with the index, a new set of
              results reuses the previous row's component state and image for
              whatever now sits at that position. */}
          {map(movies, (movie) => (
            <Movie key={movie.id} movie={movie} navigation={navigation} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Movie(props) {
  const { movie, navigation } = props;
  const { id, poster_path, title } = movie;

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
  input: {
    marginTop: -3,
    backgroundColor: '#15212b',
  },
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
});
