import React, { useState, useEffect } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Modal, IconButton, Title } from 'react-native-paper';
import YouTube from 'react-native-youtube';
import { WebView } from 'react-native-webview';
import { getVideoMovieApi } from '../api/movies';

export default function ModalVideo(props) {
  const { show, setShow, idMovie } = props;
  const [video, setVideo] = useState(null);
  // Distinguishes "still asking TMDb" from "asked, and there is no trailer".
  // Both used to look like video === null, and the player was rendered either
  // way.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let current = true;

    setLoading(true);
    setVideo(null);

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

        if (current) {
          setLoading(false);
        }
      });

    return () => {
      current = false;
    };
    // idMovie belongs here: the effect reads it, and an empty list meant a
    // ModalVideo kept across two different films would keep the first film's
    // trailer.
  }, [idMovie]);

  /**
   * A film with no YouTube trailer, and a request that failed, both leave
   * `video` null - and the player was rendered regardless. On Android that
   * loaded `https://www.youtube.com/embed/null`, so instead of "no trailer" the
   * user got YouTube's own error page for a video called "null"; on iOS
   * `<YouTube videoId={null} />` was handed a prop it does not accept.
   */
  const renderPlayer = () => {
    if (loading) {
      return <Title style={styles.message}>Cargando el tráiler...</Title>;
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
