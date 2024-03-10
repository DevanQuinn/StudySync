import React from "react";
import Slider from "react-slick";
import "../../node_modules/slick-carousel/slick/slick.css";
import "../../node_modules/slick-carousel/slick/slick-theme.css";
import "./Slider.css"; // Ensure this file is linked to your component
import { useNavigate } from 'react-router-dom';

function InviteSlider() {
    const navigate = useNavigate();
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 2,
        // Additional settings as needed
    };
    
    const handleEnterRoom = (roomData) => {
        navigate(`/room/${encodeURIComponent(roomData.name)}`, { state: { ...roomData } });
    };
    

    return (
        <div className="image-slider-container">
            {/* Header Text */}
            <div className="slider-header">
                <h2>Room Invites</h2>
            </div>

            <div className="slider-wrapper">
                <Slider {...settings} className="custom-slider">
                    {data.map((d, idx) => (
                        <div className="slider-item" key={idx}>
                            <div className="slider-item-top">
                                <img src={d.img} className="slider-item-image"/>
                            </div>
                            <div className="slider-item-content">
                                <p className="slider-item-name">{d.name}</p>
                                <p className="slider-item-description">{d.description}</p>
                                <button className="slider-item-button" onClick={() => handleEnterRoom(d)}>Enter Room</button>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
        
    );
}

const data = [
    {
        name: 'Sophie Konger',
        img: '../assets/carouselNext.jpg',
        description: 'Math Study Room',
    },
    {
        name: 'Sophie Konger',
        img: '../assets/carouselPrev.jpg',
        description: 'English Study Room adkjohfoahn;iefhaoidfhnisdfoidfhadfhoefholaefholfhoueiefhoaefhiaefhowf',
    }
]

export default InviteSlider;
