import { useRef } from 'react'
import logo from './logo.svg';
import './App.css';

function App() {

  const videoRef = useRef(null);

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 300 } })
      .then(stream => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch(err => {
        console.error("error:", err);
      });
  };
  const endVideo = () => {
    let video = videoRef.current;
        video.srcObject = null
  }

  
  return (
    <div>
        <video ref={ videoRef } autoPlay playsInline></video>
        <button onClick={ getVideo } >Start Video</button>
        <button onClick={ endVideo } >End Video</button>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
          </header>
        </div>
    </div>
  );
}

export default App;
