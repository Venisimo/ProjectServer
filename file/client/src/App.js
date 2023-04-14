import React from 'react';
import logo from './logo.svg';
import axios from 'axios';
import './App.css';
import Defaultvideo from './videos/defVideo.mp4';

function App() {
  const [img, setImg] = React.useState(null);
  const [avatar, setAvatar] = React.useState(null);
  const [vid, setVid] = React.useState(null);
  const [video, setVideo] = React.useState(null);
  const [videoKey, setVideoKey] = React.useState(0);

  const sendFile = React.useCallback(async () => {
    try {
      const data = new FormData();
      data.append('avatar', img);

      const res = await axios.post('api/upload', data, {
        headers: {
          'content-type': 'multipart/form-data'
        }
      });
      setAvatar(res.data.path);
    } catch (error) {
      console.error(error);
    }
  }, [img]);

  const sendVideo = React.useCallback(async () => {
    try {
      const data = new FormData();
      data.append('video', vid);

      const res = await axios.post('api/uploadVideo', data, {
        headers: {
            'content-type': 'multipart/form-data'
        }
      });
      setVideo(res.data.path);
      setVideoKey(key => key + 1);
    } catch (error) {
      console.error(error);
    }
  }, [vid]);

  return (
    <>
      <div className="App">
        <div className="avatar">
          {avatar ? (
            <img src={avatar} className="logo" alt="avatar" />
          ) : (
            <img src={logo} className="logo" alt="avatar" />
          )}
        </div>
        <input type="file" onChange={e => setImg(e.target.files[0])} />
        <button className="btn" onClick={sendFile}>
          Изменить аватар
        </button>
      </div>
      <div>
        {video ? (
          <video width="600" controls key={videoKey}>
            <source src={video} type="video/mp4" />
          </video>
        ) : (
          <video width="600" controls>
            <source src={Defaultvideo} type="video/mp4" />
          </video>
        )}
      </div>
      <input type="file" onChange={e => setVid(e.target.files[0])} />
      <button className="btn" onClick={sendVideo}>
        Изменить видео
      </button>
    </>
  );
}

export default App;

