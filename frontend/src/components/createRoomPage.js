// import React, { Component } from 'react';
import { Grid, Typography, TextField, Button, FormHelperText, FormControl, Radio, RadioGroup, FormControlLabel, FormLabel } from '@material-ui/core';
import { Link, useNavigate } from 'react-router-dom';

import React, { useState, useEffect } from 'react';

const CreateRoomPage = (props) => {
    const defaultVotes = 2;
    const [guestCanPause, setGuestCanPause] = useState(true);
    const [votesToSkip, setVotesToSkip] = useState(defaultVotes);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch("/api/user-in-room");
            const data = await response.json();
            if (data.code) {
                navigate(`/room/${data.code}`)
            }
        };

        fetchData();
    }, []);

    const handleVotesChanged = (e) => {
        setVotesToSkip(e.target.value);
    };

    const handleGuestCanPauseChanged = (e) => {
        setGuestCanPause(e.target.value === "true" ? true : false);
    };

    const handleCreateRoomButton = () => {
        const csrftoken = getCookie('csrftoken');
        const data = {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-CSRFToken": csrftoken },
            body: JSON.stringify({
                guest_can_pause: guestCanPause,
                votes_to_skip: votesToSkip,
            }),
        };


        fetch("/api/create-room", data)
            .then((response) => response.json())
            .then((data) => navigate(`/room/${data.code}`));
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

    return (
        <div id='create-room-container'>
            <Grid container spacing={1}>
                <Grid item xs={12} align="center" className='mb-5'>
                    <Typography component='h4' variant='h4'>{props.update ? "Update Room" : "Create Room"}</Typography>
                </Grid>
                <Grid item xs={12} align="center" className='mb-5'>
                    <FormControl component='fieldset'>
                        <FormHelperText style={{ color: "#e0e0e0", textAlign: "center" }}>
                            Guest Control of Playback State
                        </FormHelperText>
                        <RadioGroup row defaultValue='true' onChange={handleGuestCanPauseChanged}>
                            <FormControlLabel value="true"
                                control={<Radio color='primary' />}
                                label="Play/Pause"
                                labelPlacement='bottom'
                            />
                            <FormControlLabel value= "false"
                                control={<Radio color='secondary' />}
                                label="No Control"
                                labelPlacement='bottom'
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={12} align="center" className='mb-5'>
                    <FormControl>
                        <TextField
                            onChange={handleVotesChanged}
                            id='votes'
                            required
                            type='number'
                            defaultValue={defaultVotes}
                            inputProps={{
                                min: 1,
                                style: {
                                    textAlign: "center"
                                }
                            }}
                            label="Votes To Skip The Song"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button style={{ color: "#e0e0e0" }} color='primary'
                        variant='contained' onClick={props.update ? () => { props.callback(guestCanPause, votesToSkip) } : handleCreateRoomButton}>{props.update ? "Update Room" : "Create Room"}</Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button style={{ color: "#e0e0e0" }} color='secondary'
                        variant='contained' to="/" component={Link}>Back</Button>
                </Grid>
            </Grid>
        </div>
    );
};

export default CreateRoomPage;
