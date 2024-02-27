import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import "../../node_modules/slick-carousel/slick/slick.css";
import "../../node_modules/slick-carousel/slick/slick-theme.css";
import "./Slider.css";

function FavSlider() {
    const [favRooms, setFavRooms] = useState([]);
    const navigate = useNavigate();
    // Initialize settings state with default values
    const [sliderSettings, setSliderSettings] = useState({
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 2,
    });

    const handleEnterRoom = (roomData) => {
        navigate(`/room/${encodeURIComponent(roomData.name)}`, { state: { ...roomData } });
    };

    useEffect(() => {
        const fetchFavRooms = async () => {
            const db = getFirestore();
            const querySnapshot = await getDocs(collection(db, "favstudyroom"));
            const rooms = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setFavRooms(rooms);

            // Update slidesToShow and slidesToScroll based on fetched rooms
            const visibleSlides = Math.min(rooms.length, 2); // Assuming you want up to 2 slides visible at most
            setSliderSettings(prevSettings => ({
                ...prevSettings,
                slidesToShow: visibleSlides,
                slidesToScroll: visibleSlides > 1 ? 2 : 1 // Scroll by 2 if more than 1 slide, else scroll by 1
            }));
        };

        fetchFavRooms().catch(console.error);
    }, []);

    return (
        <div className="image-slider-container">
            <div className="slider-header">
                <h2>Favorite Rooms</h2>
            </div>
            <div className="slider-wrapper">
                <Slider {...sliderSettings} className="custom-slider">
                    {favRooms.map((room, idx) => (
                        <div className="slider-item" key={idx}>
                            <div className="slider-item-top">
                                <img src={room.img} alt="Room" className="slider-item-image"/>
                            </div>
                            <div className="slider-item-content">
                                <p className="slider-item-name">{room.name}</p>
                                <p className="slider-item-description">{room.description}</p>
                                <button className="slider-item-button" onClick={() => handleEnterRoom(room)}>Restart Room</button>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
}

export default FavSlider;
