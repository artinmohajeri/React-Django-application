import React, { Component, useState, useEffect } from 'react';
import { Grid, Typography, TextField, Button, FormHelperText, FormControl, Radio, RadioGroup, FormControlLabel, FormLabel } from '@material-ui/core';
import { Link, useNavigate } from 'react-router-dom';



const RoomJoinPage = () => {
    const [roomCode, setRoomCode] = useState("");
    const [errorText, setErrorText] = useState(false);
    const [isError, setIsError] = useState(false)
    const navigate = useNavigate()

    const handleCodeInputChange = (e) => {
        setRoomCode(e.target.value);
    }

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

    const handleRoomJoinButton = () => {
        const csrftoken = getCookie('csrftoken');

        const data = {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-CSRFToken": csrftoken },
            body: JSON.stringify({
                code: roomCode,
            }),
        };

        try {
            fetch("/api/join-room", data)
                .then((response) => {
                    if (response.ok) {
                        response.json()
                        navigate(`/room/${roomCode}`)
                    } else {
                        setErrorText("Invalid Code")
                        setIsError(true)
                        let e = document.querySelector(".MuiOutlinedInput-notchedOutline")
                        e.style.setProperty('border-color', '#f44336', 'important');
                    }
                })
        } catch (error) {
            alert(error)
        }
    }

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
        <div id='join-container'>
            <Grid container spacing={1} align='center'>
                <Grid item xs={12}>
                    <Typography variant='h4' component='h4'>
                        Join a Room
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        error={isError}
                        label="code"
                        placeholder="Enter a Room Code"
                        value={roomCode}
                        variant="outlined"
                        helperText={<Typography variant="caption">{errorText}</Typography>}
                        InputProps={{ style: { color: 'white' } }}
                        InputLabelProps={{ style: { color: 'white' } }}
                        onChange={handleCodeInputChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button variant='contained' style={{ color: "white", background: "green" }} onClick={handleRoomJoinButton}>Join a Room</Button>
                </Grid>

                <Grid item xs={12}>
                    <Button variant='contained' style={{ color: "black", background: "red" }} to="/" component={Link}>Back</Button>
                </Grid>
            </Grid>
        </div>
    );
};

export default RoomJoinPage;
