import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import "./styles2.css";
import soundFile from "./page5.mp3";
import { GlobalContext } from "./App"; // Import GlobalContext

function PageFive() {

    const { globalVar5 } = useContext(GlobalContext);
    const { flag5, setFlag5 } = useContext(GlobalContext);

    const playAudio = () => {
        const audio = new Audio(soundFile); // Đường dẫn tới file âm thanh
        audio.play();
    };

    useEffect(() => {
        if (flag5) {
            const timer = setTimeout(() => {
                playAudio();
                setFlag5(false); // Set flag1 to false after executing
            }, 1000);

            // Cleanup the timer when the component is unmounted
            return () => clearTimeout(timer);
        }
    }, [flag5, setFlag5]);

    return (
        <div className="page-container">
            <div className="header-5">
                <h1>Oxy trong máu</h1>
            </div>
            <div className="content">
                <div className="square">{globalVar5} %</div>
            </div>
            <div className="audio-button-container">
                <button onClick={playAudio} className="icon-button">
                    <FontAwesomeIcon icon={faVolumeUp} />
                </button>
            </div>
            <div className="audio-button-container">
                <button className="serial-button" disabled>
                    Bắt đầu
                </button>
            </div>
            <div id="button-container">
                <Link to="/page-four">
                    <button>
                        <FontAwesomeIcon icon={faArrowLeft} size="2x" />
                    </button>
                </Link>
                <Link to="/page-seven">
                    <button>
                        <FontAwesomeIcon icon={faArrowRight} size="2x" />
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default PageFive;
