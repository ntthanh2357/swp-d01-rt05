import React from 'react';
import './style.css';

const CallInterface = ({
    callState,
    isVideoEnabled,
    isAudioEnabled,
    incomingCall,
    currentCall,
    localVideoRef,
    remoteVideoRef,
    peerReady, // Add this prop
    answerCall,
    rejectCall,
    endCall,
    toggleVideo,
    toggleAudio
}) => {
    if (callState === 'idle') return null;

    return (
        <div className="call-interface">
            {/* Peer Status Indicator */}
            {!peerReady && (
                <div className="peer-status-indicator">
                    <div className="connecting-indicator">
                        <i className="fas fa-spinner fa-spin"></i>
                        <span>Đang kết nối...</span>
                    </div>
                </div>
            )}

            {/* Incoming Call */}
            {callState === 'ringing' && incomingCall && (
                <div className="incoming-call-modal">
                    <div className="incoming-call-content">
                        <div className="caller-info">
                            <div className="caller-avatar">
                                {incomingCall.senderName.charAt(0).toUpperCase()}
                            </div>
                            <h3>{incomingCall.senderName}</h3>
                            <p>{incomingCall.isVideoCall ? 'Video Call' : 'Audio Call'}</p>
                        </div>
                        <div className="call-actions">
                            <button className="btn-reject" onClick={rejectCall}>
                                <i className="fas fa-phone-slash"></i>
                            </button>
                            <button
                                className="btn-answer"
                                onClick={answerCall}
                                disabled={!peerReady}
                            >
                                <i className="fas fa-phone"></i>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Active Call */}
            {(callState === 'calling' || callState === 'connected') && (
                <div className="active-call-modal">
                    <div className="call-header">
                        <div className="call-info">
                            <h3>{currentCall?.receiverName}</h3>
                            <p>
                                {callState === 'calling' ? 'Đang gọi...' :
                                    callState === 'connected' ? 'Đã kết nối' : ''}
                            </p>
                        </div>
                        <button className="btn-minimize">
                            <i className="fas fa-minus"></i>
                        </button>
                    </div>

                    <div className="video-container">
                        {/* Remote video */}
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className="remote-video"
                        />

                        {/* Local video */}
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="local-video"
                            style={{ display: isVideoEnabled ? 'block' : 'none' }}
                        />

                        {!isVideoEnabled && (
                            <div className="video-disabled">
                                <i className="fas fa-video-slash"></i>
                                <p>Camera đã tắt</p>
                            </div>
                        )}
                    </div>

                    <div className="call-controls">
                        <button
                            className={`control-btn ${!isAudioEnabled ? 'disabled' : ''}`}
                            onClick={toggleAudio}
                        >
                            <i className={`fas ${isAudioEnabled ? 'fa-microphone' : 'fa-microphone-slash'}`}></i>
                        </button>

                        {currentCall?.isVideoCall && (
                            <button
                                className={`control-btn ${!isVideoEnabled ? 'disabled' : ''}`}
                                onClick={toggleVideo}
                            >
                                <i className={`fas ${isVideoEnabled ? 'fa-video' : 'fa-video-slash'}`}></i>
                            </button>
                        )}

                        <button className="control-btn end-call" onClick={endCall}>
                            <i className="fas fa-phone-slash"></i>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CallInterface;