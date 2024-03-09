import React, { useState, useRef } from 'react';
import Header from "../StudyRoomUI/Header";
//import FavSlider from "../StudyRoomUI/FavSlider";
import InviteSlider from "../StudyRoomUI/InviteSlider";
import RoomDetailsPage from './RoomDetailsPage'; // Adjust the path as needed


import { Routes, Route } from 'react-router-dom';

function StudyRoomUI() {
    return (
      <>
        <Header />
        {/* Setup Routes within StudyRoomUI */}
        <Routes>
          <Route path="/" element={<InviteSlider />} />
          <Route path="room" element={<RoomDetailsPage />} />
        </Routes>
        {/* Other components or content here */}
      </>
    );
}

export default StudyRoomUI;
