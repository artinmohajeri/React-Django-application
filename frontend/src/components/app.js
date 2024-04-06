import React, { Component } from 'react';
import { render } from 'react-dom';
import HomePage from './homePage';
import ReactDOM from 'react-dom/client';
import CreateRoomPage from './createRoomPage';
import RoomPage from './room';
import RoomJoinPage from './roomJoinPage';
import { BrowserRouter as Router, Routes, Route, Link, Switch, RedirectFunction } from 'react-router-dom'
import RoomPageWrapper from './roomPageWrapper';


class App extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Router>
                <Routes>
                    <Route exact path='/' element={<HomePage />} />
                    <Route path='join' element={<RoomJoinPage />} />
                    <Route path='create' element={<CreateRoomPage />} />
                    <Route path='room/:roomCode' element={<RoomPageWrapper />} />
                </Routes>
            </Router>
        )
    }
}

export default App;
const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
