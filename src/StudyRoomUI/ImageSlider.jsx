import React from "react";
import Slider from "react-slick";
import "../../node_modules/slick-carousel/slick/slick.css";
import "../../node_modules/slick-carousel/slick/slick-theme.css";
import "./ImageSlider.css";

function ImageSlider() {
    const settings = {
        dots: true,
        infinitie: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 2
    }
    return (
        <div className="w-3/4 m-auto">
            <div className="mt-20">
                <Slider {...settings}>
                {data.map((d) => (
                   <div className="slider-item">
                    <div className="sliter-item-top">
                        <img src={d.img} alt="" className="slider-item-image"/>
                    </div>
                    <div className="slider-item-content">
                        <p className="slider-item-description">{d.name}</p>
                        <p>{d.description}</p>
                        <button className="slider-item-button">Start Room</button>
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
        img: '../assests/carouselNext.jpg',
        description: 'Math Study Room',
    },
    {
        name: 'Sophie Konger',
        img: '../assests/carouselPrev.jpg',
        description: 'English Study Room',
    }
]

export default ImageSlider;

