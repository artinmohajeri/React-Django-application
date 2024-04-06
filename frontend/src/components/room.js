import { Grid, Typography, TextField, Button, FormHelperText, FormControl, Radio, RadioGroup, FormControlLabel, FormLabel } from '@material-ui/core';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import CreateRoomPage from './createRoomPage';


const RoomPage = (props) => {
    const navigate = useNavigate()
    const roomCode = props.roomCode;
    const [showSettingsPage, setShowSettingsPage] = useState(false)
    const [roomExist, setRoomExist] = useState(false)
    const [roomDetails, setRoomDetails] = useState({
        votesToSkip: 2,
        guestCanPause: true,
        isHost: false,
    });

    useLayoutEffect(() => {
        const checkRoomExist = async () => {
            const response = await fetch('/api/room-exist');
            const data = await response.json();
            data.forEach(i => {
                if (i.code === roomCode) {
                    setRoomExist(true)
                }
            });
        }
        checkRoomExist();
    }, []);

    useEffect(() => {
        const getRoomDetails = async () => {
            const response = await fetch(`/api/get-room?code=${roomCode}`);
            const data = await response.json();
            setRoomDetails({
                votesToSkip: data.votes_to_skip,
                guestCanPause: data.guest_can_pause,
                isHost: data.host,
            });
        };
        getRoomDetails();
    }, []);

    const handleLeaveRoomButton = () => {
        const csrftoken = getCookie('csrftoken');
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
            },
        };

        fetch('/api/leave-room', requestOptions)
            .then((response) => {
                if (response.ok) {
                    navigate("/")
                }
            })
    };


    const getCookie = (name) => {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    };



    const handleUpdateButton = (guestCanPause, votesToSkip) => {
        const csrftoken = getCookie('csrftoken');
        const data = {
            method: "PATCH",
            headers: { "Content-Type": "application/json", "X-CSRFToken": csrftoken },
            body: JSON.stringify({
                guest_can_pause: guestCanPause,
                votes_to_skip: votesToSkip,
                code: roomCode,
            }),
        };
        fetch("/api/update-room", data)
            .then((response) => response.json())
            .then((data) => {
                setShowSettingsPage(false);
                setRoomDetails({
                    votesToSkip: data.votes_to_skip,
                    guestCanPause: data.guest_can_pause,
                    isHost : true,
                })
            })
    }



    if (roomExist) {
        if (!showSettingsPage) {
            return (
                <div className='w-100 h-100 d-flex align-items-center'>
                    <Grid container spacing={1} align="center">
                        <Grid item xs={12}>
                            <h3>Votes to skip: {roomDetails.votesToSkip}</h3>
                        </Grid>
                        <Grid item xs={12}>
                            <h3>Guest can pause: {roomDetails.guestCanPause ? 'Yes' : 'No'}</h3>
                        </Grid>
                        <Grid item xs={12}>
                            <h3>Is host: {roomDetails.isHost ? 'Yes' : 'No'}</h3>
                        </Grid>
                        <Grid item xs={12}>
                            {roomDetails.isHost ? <Button variant='contained' onClick={() => setShowSettingsPage(true)}>settings</Button> : null}
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant='contained' style={{ color: "white", background: "red" }} onClick={handleLeaveRoomButton}>Leave The Room</Button>
                        </Grid>
                    </Grid>
                </div>
            );
        } else {
            return (
                <div id='create-room-container'>
                    <Grid container spacing={1} align="center">
                        <Grid item xs={12}>
                            <CreateRoomPage
                                update={true}
                                votesToSkip={roomDetails.votesToSkip}
                                guestCanPause={roomDetails.guestCanPause}
                                roomCode={roomCode}
                                callback={handleUpdateButton}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant='contained' style={{ color: "white", background: "red" }} onClick={() => setShowSettingsPage(false)}>Close Settings</Button>
                        </Grid>
                    </Grid>
                </div>
            )
        }
    } else {
        return (
            <div className='w-100 h-100'>
                <Grid container spacing={1} align="center">
                    <Grid item xs={12}>
                        <h1 className='text-danger text-center mt-5'>The Room Does Not Exist</h1>
                    </Grid>
                </Grid>
            </div>
        )
    }
};

export default RoomPage;


// when we type through the url. we can access room which are not defined.
