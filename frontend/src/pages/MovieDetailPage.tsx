import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReactPlayer from 'react-player';
import { Box, IconButton, Slider, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import Replay10Icon from '@mui/icons-material/Replay10';
import Forward10Icon from '@mui/icons-material/Forward10';
import styles from './MovieDetailPage.module.css';

interface Movie {
  id: number;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  tags: string[];
  genre: string;
}

const MovieDetailPage: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const playerRef = useRef<ReactPlayer>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [previousVolume, setPreviousVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const volumeSliderTimeoutRef = useRef<number | null>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (movieId) {
      const movieIdNumber = parseInt(movieId, 10);
      if (!isNaN(movieIdNumber)) {
        axios.get(`http://localhost:8088/api/movies/${movieIdNumber}`)
          .then(response => {
            console.log('Fetched movie:', response.data);
            setMovie(response.data);
            setLoading(false);
          })
          .catch(error => {
            console.error('There was an error fetching the movie!', error);
            setError(error.response?.data?.message || 'Error loading movie details');
            setLoading(false);
          });
      } else {
        console.error('Invalid movieIdNumber:', movieIdNumber);
        setError('Movie ID is not a valid number');
        setLoading(false);
      }
    } else {
      console.error('Movie ID is missing');
      setError('Movie ID is missing');
      setLoading(false);
    }
  }, [movieId]);

  const handlePlayPause = () => {
    setPlaying(prev => !prev);
  };

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    setVolume(newValue as number);
    setMuted(false);
  };

  const handleMute = () => {
    if (muted) {
      setVolume(previousVolume);
      setMuted(false);
    } else {
      setPreviousVolume(volume);
      setVolume(0);
      setMuted(true);
    }
  };

  const toggleVolumeSlider = () => {
    setShowVolumeSlider(prev => !prev);
  };

  const handleVolumeClick = () => {
    handleMute();
    toggleVolumeSlider();
  };

  const handleFullscreen = () => {
    if (!fullscreen) {
      if (wrapperRef.current?.requestFullscreen) {
        wrapperRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setFullscreen(!fullscreen);
  };

  const handleProgress = (state: { played: number }) => {
    setPlayed(state.played);
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const handleSeekChange = (event: Event, newValue: number | number[]) => {
    if (playerRef.current) {
      playerRef.current.seekTo(newValue as number, 'fraction');
    }
  };

  const handleForward10 = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      const remainingTime = duration - currentTime;
      if (remainingTime > 10) {
        playerRef.current.seekTo(currentTime + 10, 'seconds');
      } else {
        playerRef.current.seekTo(duration, 'seconds');
        setPlaying(false);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [h, m > 9 ? m : (h ? '0' + m : m || '0'), s > 9 ? s : '0' + s]
      .filter(a => a)
      .join(':');
  };

  const handleMouseLeave = () => {
    volumeSliderTimeoutRef.current = window.setTimeout(() => {
      setShowVolumeSlider(false);
    }, 2000);
  };

  const handleMouseEnter = () => {
    if (volumeSliderTimeoutRef.current) {
      clearTimeout(volumeSliderTimeoutRef.current);
      volumeSliderTimeoutRef.current = null;
    }
    setShowVolumeSlider(true);
  };

  useEffect(() => {
    if (showVolumeSlider) {
      volumeSliderTimeoutRef.current = window.setTimeout(() => {
        setShowVolumeSlider(false);
      }, 2000);
    } else {
      if (volumeSliderTimeoutRef.current) {
        clearTimeout(volumeSliderTimeoutRef.current);
        volumeSliderTimeoutRef.current = null;
      }
    }
  }, [showVolumeSlider]);

  const showControls = () => {
    if (controlsRef.current) {
      controlsRef.current.classList.add(styles.visible);
    }
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = null;
    }
  };

  const hideControls = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = null;
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (controlsRef.current) {
        controlsRef.current.classList.remove(styles.visible);
      }
    }, 5000);
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!movie) {
    return <div className={styles.error}>Movie not found</div>;
  }

  return (
    <Box
      className={styles.container}
      onMouseMove={showControls}
      onMouseLeave={hideControls}
    >
      <Typography variant="h3" className={styles.title}>
        {movie.title}
      </Typography>
      <Box className={styles.playerWrapper} ref={wrapperRef}>
        <ReactPlayer
          ref={playerRef}
          className={styles.reactPlayer}
          url={movie.url}
          playing={playing}
          volume={volume}
          muted={muted}
          controls={false}
          width="100%"
          height="100%"
          onProgress={handleProgress}
          onDuration={handleDuration}
          progressFrequency={100}
        />
        <Box
          className={`${styles.controls}`}
          ref={controlsRef}
        >
          <IconButton onClick={handlePlayPause} className={styles.controlButton} sx={{ color: 'white' }}>
            {playing ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
          <IconButton onClick={() => playerRef.current?.seekTo(played - 10, 'seconds')} className={styles.controlButton} sx={{ color: 'white' }}>
            <Replay10Icon />
          </IconButton>
          <IconButton onClick={handleForward10} className={styles.controlButton} sx={{ color: 'white' }}>
            <Forward10Icon />
          </IconButton>
          <Slider
            value={played}
            onChange={handleSeekChange}
            aria-labelledby="progress-slider"
            className={styles.progressSlider}
            min={0}
            max={1}
            step={0.01}
            style={{ color: '#d6a060' }}
          />
          <Box
            className={`${styles.volumeControl} ${showVolumeSlider ? styles.showSlider : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <IconButton onClick={handleVolumeClick} className={styles.controlButton} sx={{ color: 'white' }}>
              {muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
            </IconButton>
            <Slider
              orientation="vertical"
              value={muted ? 0 : volume}
              onChange={handleVolumeChange}
              aria-labelledby="continuous-slider"
              className={styles.volumeSlider}
              min={0}
              max={1}
              step={0.01}
              style={{ color: '#d6a060' }}
            />
          </Box>
          <Typography className={styles.time}>
            {formatTime(played * duration)} / {formatTime(duration)}
          </Typography>
          <IconButton onClick={handleFullscreen} className={styles.controlButton} sx={{ color: 'white' }}>
            <FullscreenIcon />
          </IconButton>
        </Box>
      </Box>
      <Typography variant="body1" className={styles.description}>
        {movie.description}
      </Typography>
    </Box>
  );
};

export default MovieDetailPage;