import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useSocket } from "./SocketContext";

const VideoCallContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useVideoCall = () => useContext(VideoCallContext);

const peerConfig = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

export const VideoCallProvider = ({ children }) => {
  const { userInfo } = useSelector((s) => s.auth);
  const socket = useSocket();

  const [call, setCall] = useState({
    isReceivingCall: false,
    from: "",
    name: "",
    role: "",
    offer: null,
  });
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [otherUser, setOtherUser] = useState(null);

  const peerConnection = useRef(null);
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  const leaveCall = () => {
    if (otherUser && socket) socket.emit("end-call", { to: otherUser });

    setCallEnded(true);
    if (peerConnection.current) peerConnection.current.close();
    if (stream) stream.getTracks().forEach((track) => track.stop());

    setStream(null);
    setRemoteStream(null);
    setCallAccepted(false);
    setCall({
      isReceivingCall: false,
      from: "",
      name: "",
      role: "",
      offer: null,
    });
    setOtherUser(null);

    // Slightly delay reset to allow UI to exit
    setTimeout(() => setCallEnded(false), 2000);
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("incoming-call", ({ from, offer, userName, userRole }) => {
      setCall({
        isReceivingCall: true,
        from,
        name: userName,
        role: userRole,
        offer,
      });
    });

    socket.on("call-answered", async ({ answer }) => {
      setCallAccepted(true);
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(answer),
        );
      }
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      if (peerConnection.current) {
        try {
          await peerConnection.current.addIceCandidate(
            new RTCIceCandidate(candidate),
          );
        } catch (err) {
          console.error("Error adding ice candidate", err);
        }
      }
    });

    socket.on("call-ended", () => {
      leaveCall();
    });

    return () => {
      socket.off("incoming-call");
      socket.off("call-answered");
      socket.off("ice-candidate");
      socket.off("call-ended");
    };
  }, [socket]);

  const initPeerConnection = async (targetUserId) => {
    const pc = new RTCPeerConnection(peerConfig);
    peerConnection.current = pc;

    const myStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setStream(myStream);
    if (myVideo.current) myVideo.current.srcObject = myStream;

    myStream.getTracks().forEach((track) => pc.addTrack(track, myStream));

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      if (userVideo.current) userVideo.current.srcObject = event.streams[0];
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          to: targetUserId,
          candidate: event.candidate,
        });
      }
    };

    return pc;
  };

  const callUser = async (targetUserId, targetName) => {
    const pc = await initPeerConnection(targetUserId);
    setOtherUser(targetUserId);

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit("call-user", {
      to: targetUserId,
      offer,
      userName: userInfo.name,
      userRole: userInfo.role,
    });
  };

  const answerCall = async () => {
    setCallAccepted(true);
    setOtherUser(call.from);

    const pc = await initPeerConnection(call.from);
    await pc.setRemoteDescription(new RTCSessionDescription(call.offer));

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socket.emit("answer-call", { to: call.from, answer });
    setCall((prev) => ({ ...prev, isReceivingCall: false }));
  };

  const declineCall = () => {
    socket.emit("end-call", { to: call.from });
    setCall({
      isReceivingCall: false,
      from: "",
      name: "",
      role: "",
      offer: null,
    });
  };

  return (
    <VideoCallContext.Provider
      value={{
        call,
        callAccepted,
        callEnded,
        stream,
        remoteStream,
        myVideo,
        userVideo,
        callUser,
        answerCall,
        declineCall,
        leaveCall,
        otherUser,
      }}
    >
      {children}
    </VideoCallContext.Provider>
  );
};
