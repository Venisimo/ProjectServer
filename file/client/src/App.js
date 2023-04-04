import React from 'react'
import logo from './logo.svg';
import axios from 'axios';
import './App.css';

function App() {
  const [img, setImg] = React.useState(null);
  const [avatar, setAvatar] = React.useState(null);

  const sendFile = React.useCallback(async () => {
    try {
      const data = new FormData();
      data.append('avatar', img)

      await axios.post('api/upload', data, {
        headers: {
          'content-type': 'multipart/form-data'
        }
      })

      .then(res => setAvatar(res.data.path))
    } catch (error) {
    }
});
  return (
    <div className="App">
      <div className="avatar">
        {
          avatar 
            ? <img src={avatar} className="logo" alt="avatar" />
            : <img src={`${logo}`} className="logo" alt="avatar" />
          }
        
        </div>
          <input type="file" onChange={e => setImg(e.target.files[0])}/>        
           <button className="btn" onClick={sendFile}>Изменить аватар</button>       
      </div>
  );
}

export default App;
