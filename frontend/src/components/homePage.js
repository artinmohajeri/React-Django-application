import RoomJoinPage from './roomJoinPage';
import CreateRoomPage from './createRoomPage';
import { Grid, Typography, Button } from '@material-ui/core';
import { BrowserRouter as Router, Link, RedirectFunction, useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react';

const HomePage = () => {
    const navigate = useNavigate()

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

    return (
        <div id='home-container'>
            <Grid container spacing={3} align="center">
                <Grid item xs={12}>
                    <Typography variant='h3' component='h3'>
                        React-Django website
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Button to="/join" component={Link} className='mx-4' variant='outlined' style={{ color: "#e0e0e0", borderColor: "#e0e0e0" }}>Join a Room</Button>
                    <Button to="/create" component={Link} variant='outlined' style={{ color: "#e0e0e0", borderColor: "#e0e0e0" }}>Create a Room</Button>
                </Grid>
            </Grid>
        </div>
    );
};

export default HomePage;