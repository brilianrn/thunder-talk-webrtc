import './App.css';
import Peer from 'peerjs';
import 'bootstrap/dist/css/bootstrap.css';

function App() {
  const PRE = "DELTA"
  const SUF = "MEET"
  let room_id = null;
  let local_stream = '';
  let getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  function createRoom() {
    console.log("Creating Room")
    let room = document.getElementById("room-input").value;
    if (room == " " || room == "") {
      alert("Please enter room number")
      return;
    }
    room_id = PRE + room + SUF;
    let peer = new Peer(room_id)
    peer.on('open', (id) => {
      console.log("Peer Connected with ID: ", id)
      hideModal()
      getUserMedia({ video: true, audio: true }, (stream) => {
        local_stream = stream;
        setLocalStream(local_stream)
      }, (err) => {
        console.log(err)
      })
      notify("Waiting for peer to join.")
    })
    peer.on('call', (call) => {
      call.answer(local_stream);
      call.on('stream', (stream) => {
        setRemoteStream(stream)
      })
    })
  }

  function setLocalStream(stream) {

    let video = document.getElementById("local-video");
    video.srcObject = stream;
    video.muted = true;
    video.play();
  }
  function setRemoteStream(stream) {

    let video = document.getElementById("remote-video");
    video.srcObject = stream;
    video.play();
  }

  function hideModal() {
    document.getElementById("entry-modal").hidden = true
  }

  function notify(msg) {
    let notification = document.getElementById("notification")
    notification.innerHTML = msg
    notification.hidden = false
    setTimeout(() => {
      notification.hidden = true;
    }, 3000)
  }

  function joinRoom() {
    console.log("Joining Room")
    let room = document.getElementById("room-input").value;
    if (room == " " || room == "") {
      alert("Please enter room number")
      return;
    }
    room_id = PRE + room + SUF;
    hideModal()
    let peer = new Peer()
    peer.on('open', (id) => {
      console.log("Connected with Id: " + id)
      getUserMedia({ video: true, audio: true }, (stream) => {
        local_stream = stream;
        setLocalStream(local_stream)
        notify("Joining peer")
        let call = peer.call(room_id, stream)
        call.on('stream', (stream) => {
          setRemoteStream(stream);
        })
      }, (err) => {
        console.log(err)
      })

    })
  }

  return (
    <div className="App">
      <div className="container">
        <h1 className="h1">WebRTC Team Meet</h1>
        <p id="notification" hidden></p>
        <div className="entry-modal" id="entry-modal">
          <p>Create or Join Meeting</p>
          <input id="room-input" className="form form-control" placeholder="e.g. 1" />
          <div className='card card-set mt-3'>
            <button className='btn btn-primary mb-1' onClick={(event) => { createRoom(event) }}>Create Room</button>
            <button className='btn btn-success' onClick={(event) => { joinRoom(event) }}>Join Room</button>
          </div>
        </div>
        <div className="meet-area">
          <video id="remote-video"></video>
          <video id="local-video"></video>
        </div>
      </div>
    </div>
  );
}

export default App;
