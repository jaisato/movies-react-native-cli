import React, { useState, useEffect } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Modal, IconButton, Title } from 'react-native-paper';
import YouTube from 'react-native-youtube';
import { WebView } from 'react-native-webview';
import { getVideoMovieApi } from '../api/movies';

export default function ModalVideo(props) {
  const { show, setShow, idMovie } = props;
  const [video, setVideo] = useState(null);
  // Three states, not one. "Still asking TMDb", "asked, and this film has no
  // trailer", and "the asking itself failed" all used to look like
  // video === null, and the player was rendered for all three.
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    // Nothing to fetch while the modal is closed - and returning early here is
    // what makes reopening it a retry. The effect keyed on idMovie alone, so a
    // request that failed once (offline, a 401, a rate limit, a 5xx) stayed
    // failed for as long as the screen lived: closing and reopening ran
    // nothing.
    if (!show) {
      return undefined;
    }

    let current = true;

    setLoading(true);
    setVideo(null);
    setFailed(false);

    getVideoMovieApi(idMovie)
      .then((response) => {
        let idVideo = null;
        response.results.forEach((item) => {
          if (item.site === 'YouTube' && !idVideo) {
            idVideo = item.key;
          }
        });

        // The screen can be left before TMDb answers; writing state then is a
        // no-op React warns about.
        if (!current) {
          return;
        }

        setVideo(idVideo);
        setLoading(false);
      })
      .catch((error) => {
        // fetch() only rejects on network failure and checkResponse() now
        // rejects on any non-2xx, so without this the failure surfaces as an
        // unhandled rejection and the screen just stays empty.
        console.error('TMDb request failed', error);

        if (!current) {
          return;
        }

        // Not the same thing as a film without a trailer, and it was being
        // reported as one: clearing loading while video stayed null told the
        // user this film has no trailer whenever the request had simply not
        // arrived.
        setFailed(true);
        setLoading(false);
      });

    return () => {
      current = false;
    };
    // idMovie belongs here: the effect reads it, and an empty list meant a
    // ModalVideo kept across two different films would keep the first film's
    // trailer. show belongs here for the retry described above.
  }, [idMovie, show]);

  /**
   * A film with no YouTube trailer, and a request that failed, both leave
   * `video` null - and the player was rendered regardless. On Android that
   * loaded `https://www.youtube.com/embed/null`, so instead of "no trailer" the
   * user got YouTube's own error page for a video called "null"; on iOS
   * `<YouTube videoId={null} />` was handed a prop it does not accept.
   *
   * The failure is now its own branch. Telling somebody their film has no
   * trailer when the truth is that the phone is offline is a wrong answer given
   * confidently, and it hides the one thing they could act on.
   */
  const renderPlayer = () => {
    if (loading) {
      return <Title style={styles.message}>Cargando el tráiler...</Title>;
    }

    if (failed) {
      return (
        <Title style={styles.message}>
          No se ha podido cargar el tráiler. Comprueba tu conexión y vuelve a
          abrir esta ventana.
        </Title>
      );
    }

    if (!video) {
      return (
        <Title style={styles.message}>
          No hay tráiler disponible para esta película.
        </Title>
      );
    }

    return Platform.OS === 'ios' ? (
      <YouTube videoId={video} style={styles.video} />
    ) : (
      <WebView
        style={{ width: 500 }}
        source={{
          uri: `https://www.youtube.com/embed/${video}?controls=0&showinfo=0`,
        }}
      />
    );
  };

  return (
    <Modal visible={show} contentContainerStyle={styles.modal}>
      {renderPlayer()}
      <IconButton
        icon="close"
        onPress={() => setShow(false)}
        style={styles.close}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#000',
    height: '120%',
    alignItems: 'center',
  },
  close: {
    backgroundColor: '#1ea1f2',
    width: 50,
    height: 50,
    borderRadius: 100,
    position: 'absolute',
    bottom: 100,
  },
  video: {
    alignSelf: 'stretch',
    height: 300,
  },
  message: {
    color: '#fff',
    textAlign: 'center',
    marginHorizontal: 30,
    marginTop: 200,
  },
});
