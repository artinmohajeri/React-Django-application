import React from 'react';
import { useParams } from 'react-router-dom';
import RoomPage from './room';


const RoomPageWrapper = () => {
    let { roomCode } = useParams()
    return <RoomPage roomCode={roomCode} />;
}

export default RoomPageWrapper;
