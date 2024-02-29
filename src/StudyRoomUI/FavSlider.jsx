import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import "../../node_modules/slick-carousel/slick/slick.css";
import "../../node_modules/slick-carousel/slick/slick-theme.css";
import "./Slider.css";
import { getAuth } from 'firebase/auth';

function FavSlider() {
    const [favRooms, setFavRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    // Initialize settings state with default values
    const [sliderSettings, setSliderSettings] = useState({
        dots: true,
        infinite: false, // Consider setting to false if not many slides
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 2,
    });

    const handleEnterRoom = (roomData) => {
        navigate(`/room/${encodeURIComponent(roomData.name)}`, { state: { ...roomData } });
    };

    useEffect(() => {
        const fetchFavRooms = async () => {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) {
                console.log("User not logged in");
                setLoading(false);
                return;
            }

            const collectionName = `${user.uid}_studyrooms`;
            const db = getFirestore();
            const querySnapshot = await getDocs(collection(db, collectionName));
            const rooms = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setFavRooms(rooms);
            setLoading(false);
        };

        fetchFavRooms().catch(console.error);
    }, []);

    // Conditional rendering based on loading and whether there are favorite rooms
    if (loading) return <div>Loading...</div>;

    return (
        <div className="image-slider-container">
            <div className="slider-header">
                <h2>{favRooms.length > 0 ? 'Favorite Rooms' : 'No Favorite Rooms'}</h2>
            </div>
            {favRooms.length > 0 ? (
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
            ) : (
                <div className="no-favorite-rooms">
                    <p>No Favorite Rooms</p>
                </div>
            )}
        </div>
    );
}

export default FavSlider;
