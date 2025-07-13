import { useRef, useState, useEffect, useCallback } from 'react';
import Peer from 'peerjs';

export const useWebRTC = (socket, user) => {
    const [callState, setCallState] = useState('idle');
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [incomingCall, setIncomingCall] = useState(null);
    const [currentCall, setCurrentCall] = useState(null);
    const [peerReady, setPeerReady] = useState(false);

    const localVideoRef = useRef();
    const remoteVideoRef = useRef();
    const peerRef = useRef();
    const localStreamRef = useRef();
    const currentCallRef = useRef();
    const myPeerIdRef = useRef(null);
    const retryCountRef = useRef(0);

    // End call function
    const endCall = useCallback(() => {
        console.log('🔚 Ending call');

        if (currentCallRef.current) {
            currentCallRef.current.close();
            currentCallRef.current = null;
        }

        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => {
                track.stop();
            });
            localStreamRef.current = null;
        }

        if (currentCall && socket) {
            socket.emit('call_ended', {
                senderId: user.userId,
                receiverId: currentCall.receiverId
            });
        }

        setCallState('idle');
        setCurrentCall(null);
        setIncomingCall(null);

        if (localVideoRef.current) {
            localVideoRef.current.srcObject = null;
        }
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
        }
    }, [socket, user, currentCall]);

    // Initialize PeerJS with retry logic
    const initializePeer = useCallback((retryAttempt = 0) => {
        if (retryAttempt > 3) {
            console.error('❌ Max retry attempts reached for PeerJS initialization');
            setPeerReady(false);
            return;
        }

        try {
            // Clean up existing peer if any
            if (peerRef.current && !peerRef.current.destroyed) {
                peerRef.current.destroy();
                peerRef.current = null;
            }

            // Generate unique peer ID
            const timestamp = Date.now();
            const random = Math.floor(Math.random() * 1000);
            const peerId = `peer_${user.userId}_${timestamp}_${random}`;
            myPeerIdRef.current = peerId;

            console.log(`🔄 Initializing PeerJS (attempt ${retryAttempt + 1}) with ID:`, peerId);

            const peer = new Peer(peerId, {
                debug: 1,
                config: {
                    iceServers: [
                        { urls: 'stun:stun.l.google.com:19302' },
                        { urls: 'stun:stun1.l.google.com:19302' },
                        { urls: 'stun:stun.services.mozilla.com' }
                    ]
                }
            });

            peer.on('open', (id) => {
                console.log('✅ PeerJS connected with ID:', id);
                setPeerReady(true);
                retryCountRef.current = 0; // Reset retry count on success

                // Register peer ID with socket server
                if (socket) {
                    socket.emit('register_peer', {
                        userId: user.userId,
                        peerId: id
                    });
                }
            });

            peer.on('call', (call) => {
                console.log('📞 Incoming call from:', call.peer);
                currentCallRef.current = call;

                const metadata = call.metadata || {};

                setIncomingCall({
                    senderId: metadata.senderId || call.peer,
                    senderName: metadata.senderName || 'Unknown',
                    isVideoCall: metadata.isVideoCall || false
                });
                setCallState('ringing');
            });

            peer.on('error', (error) => {
                console.error('❌ PeerJS error:', error);
                setPeerReady(false);

                if (error.type === 'unavailable-id') {
                    console.log('🔄 Peer ID taken, retrying...');
                    // Retry with delay
                    setTimeout(() => {
                        initializePeer(retryAttempt + 1);
                    }, 1000 + (retryAttempt * 1000)); // Increase delay with each retry
                } else if (error.type === 'network' || error.type === 'server-error') {
                    console.log('🔄 Network/Server error, retrying...');
                    setTimeout(() => {
                        initializePeer(retryAttempt + 1);
                    }, 3000);
                }
            });

            peer.on('disconnected', () => {
                console.log('🔄 PeerJS disconnected, attempting to reconnect...');
                setPeerReady(false);

                if (!peer.destroyed) {
                    peer.reconnect();
                } else {
                    // If peer is destroyed, initialize new one
                    setTimeout(() => {
                        initializePeer(0);
                    }, 2000);
                }
            });

            peer.on('close', () => {
                console.log('🔒 PeerJS connection closed');
                setPeerReady(false);
            });

            peerRef.current = peer;

        } catch (error) {
            console.error('❌ Error initializing PeerJS:', error);
            setPeerReady(false);

            // Retry after delay
            setTimeout(() => {
                initializePeer(retryAttempt + 1);
            }, 2000);
        }
    }, [user?.userId, socket]);

    // Initialize PeerJS
    useEffect(() => {
        if (user?.userId && !peerRef.current) {
            console.log('Starting PeerJS initialization for user:', user.userId);
            initializePeer(0);
        }

        return () => {
            if (peerRef.current && !peerRef.current.destroyed) {
                console.log('🧹 Cleaning up PeerJS connection');
                peerRef.current.destroy();
                peerRef.current = null;
                setPeerReady(false);
                myPeerIdRef.current = null;
            }
        };
    }, [user?.userId, initializePeer]);

    // Initialize local media stream
    const initializeMedia = useCallback(async (video = true, audio = true) => {
        try {
            console.log('🎥 Requesting media access:', { video, audio });

            const stream = await navigator.mediaDevices.getUserMedia({
                video: video ? {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    frameRate: { ideal: 30 }
                } : false,
                audio: audio ? {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                } : false
            });

            localStreamRef.current = stream;
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }

            console.log('✅ Media stream initialized');
            return stream;
        } catch (error) {
            console.error('❌ Error accessing media devices:', error);

            let errorMessage = 'Không thể truy cập camera/microphone';
            if (error.name === 'NotAllowedError') {
                errorMessage = 'Vui lòng cho phép truy cập camera và microphone';
            } else if (error.name === 'NotFoundError') {
                errorMessage = 'Không tìm thấy camera hoặc microphone';
            } else if (error.name === 'NotReadableError') {
                errorMessage = 'Camera/microphone đang được sử dụng bởi ứng dụng khác';
            }

            throw new Error(errorMessage);
        }
    }, []);

    // Start a call
    const startCall = useCallback(async (receiverId, receiverName, isVideoCall = true) => {
        try {
            console.log('🚀 Starting call to:', receiverId, 'Video:', isVideoCall);

            if (!peerRef.current || !peerReady || peerRef.current.destroyed) {
                throw new Error('Kết nối chưa sẵn sàng. Vui lòng thử lại sau vài giây.');
            }

            setCallState('calling');
            setCurrentCall({ receiverId, receiverName, isVideoCall });

            // Get media stream
            const stream = await initializeMedia(isVideoCall, true);

            // Request target peer ID from server
            if (socket) {
                socket.emit('get_peer_id', { userId: receiverId }, (response) => {
                    console.log('📞 Get peer ID response:', response);

                    if (response && response.peerId) {
                        console.log('📞 Target peer ID:', response.peerId);

                        try {
                            const call = peerRef.current.call(response.peerId, stream, {
                                metadata: {
                                    senderId: user.userId,
                                    senderName: user.name,
                                    isVideoCall: isVideoCall
                                }
                            });

                            if (!call) {
                                throw new Error('Không thể tạo cuộc gọi');
                            }

                            const callTimeout = setTimeout(() => {
                                console.log('⏰ Call timeout');
                                endCall();
                                alert('Không thể kết nối. Người nhận có thể không online.');
                            }, 30000);

                            call.on('stream', (remoteStream) => {
                                console.log('✅ Received remote stream');
                                clearTimeout(callTimeout);

                                if (remoteVideoRef.current) {
                                    remoteVideoRef.current.srcObject = remoteStream;
                                }
                                setCallState('connected');
                            });

                            call.on('close', () => {
                                console.log('📞 Call closed');
                                clearTimeout(callTimeout);
                                endCall();
                            });

                            call.on('error', (error) => {
                                console.error('❌ Call error:', error);
                                clearTimeout(callTimeout);
                                endCall();
                            });

                            currentCallRef.current = call;

                        } catch (callError) {
                            console.error('❌ Error creating call:', callError);
                            throw new Error('Không thể tạo cuộc gọi: ' + callError.message);
                        }

                    } else {
                        throw new Error('Người nhận không online hoặc không hỗ trợ video call');
                    }
                });
            } else {
                throw new Error('Socket connection not available');
            }

        } catch (error) {
            console.error('❌ Error starting call:', error);
            setCallState('idle');
            setCurrentCall(null);
            alert(error.message || 'Không thể bắt đầu cuộc gọi');
        }
    }, [socket, user, initializeMedia, peerReady, endCall]);

    // Answer a call
    const answerCall = useCallback(async () => {
        if (!currentCallRef.current || !incomingCall) {
            console.error('No incoming call to answer');
            return;
        }

        try {
            console.log('📞 Answering call from:', incomingCall.senderId);

            setCallState('connected');
            const stream = await initializeMedia(incomingCall.isVideoCall, true);

            currentCallRef.current.answer(stream);

            currentCallRef.current.on('stream', (remoteStream) => {
                console.log('✅ Received remote stream on answer');
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = remoteStream;
                }
            });

            currentCallRef.current.on('close', () => {
                console.log('📞 Answered call closed');
                endCall();
            });

            currentCallRef.current.on('error', (error) => {
                console.error('❌ Answered call error:', error);
                endCall();
            });

            setCurrentCall({
                receiverId: incomingCall.senderId,
                receiverName: incomingCall.senderName,
                isVideoCall: incomingCall.isVideoCall
            });
            setIncomingCall(null);

            if (socket) {
                socket.emit('call_accepted', {
                    senderId: user.userId,
                    receiverId: incomingCall.senderId
                });
            }

        } catch (error) {
            console.error('❌ Error answering call:', error);
            rejectCall();
        }
    }, [incomingCall, socket, user, initializeMedia, endCall]);

    // Reject a call
    const rejectCall = useCallback(() => {
        console.log('❌ Rejecting call');

        if (currentCallRef.current) {
            currentCallRef.current.close();
            currentCallRef.current = null;
        }

        if (incomingCall && socket) {
            socket.emit('call_rejected', {
                senderId: user.userId,
                receiverId: incomingCall.senderId
            });
        }

        setIncomingCall(null);
        setCallState('idle');
        setCurrentCall(null);
    }, [socket, user, incomingCall]);

    // Toggle video
    const toggleVideo = useCallback(() => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoEnabled(videoTrack.enabled);
                console.log('📹 Video toggled:', videoTrack.enabled);
            }
        }
    }, []);

    // Toggle audio
    const toggleAudio = useCallback(() => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsAudioEnabled(audioTrack.enabled);
                console.log('🎤 Audio toggled:', audioTrack.enabled);
            }
        }
    }, []);

    // Socket event listeners
    useEffect(() => {
        if (!socket) return;

        const handleIncomingCall = (data) => {
            console.log('📞 Incoming call notification via socket:', data);
        };

        const handleCallAccepted = (data) => {
            console.log('✅ Call accepted notification:', data);
        };

        const handleCallRejected = () => {
            console.log('❌ Call rejected notification');
            setCallState('idle');
            setCurrentCall(null);
            if (currentCallRef.current) {
                currentCallRef.current.close();
                currentCallRef.current = null;
            }
        };

        const handleCallEnded = () => {
            console.log('🔚 Call ended notification');
            endCall();
        };

        socket.on('incoming_call', handleIncomingCall);
        socket.on('call_accepted', handleCallAccepted);
        socket.on('call_rejected', handleCallRejected);
        socket.on('call_ended', handleCallEnded);

        return () => {
            socket.off('incoming_call', handleIncomingCall);
            socket.off('call_accepted', handleCallAccepted);
            socket.off('call_rejected', handleCallRejected);
            socket.off('call_ended', handleCallEnded);
        };
    }, [socket, endCall]);

    return {
        callState,
        isVideoEnabled,
        isAudioEnabled,
        incomingCall,
        currentCall,
        localVideoRef,
        remoteVideoRef,
        peerReady,
        startCall,
        answerCall,
        rejectCall,
        endCall,
        toggleVideo,
        toggleAudio
    };
};