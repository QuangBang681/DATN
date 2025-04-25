import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import "./styles2.css";
import soundFile from "./page3.mp3";
import { GlobalContext } from "./App"; // Import GlobalContext

function PageThree() {
    const [receivedData, setReceivedData] = useState("");
    const { globalVar3, setGlobalVar3 } = useContext(GlobalContext);
    const { flag3, setFlag3 } = useContext(GlobalContext);


    const playAudio = () => {
        const audio = new Audio(soundFile); // Đường dẫn tới file âm thanh
        audio.play();
    };

    const sendSerialData = async () => {
        try {
            await fetch("http://localhost:5000/send-temp", { method: "POST" });

            const response = await fetch("http://localhost:5000/listen-temp");
            const data = await response.json();

            const roundedValue = parseFloat(data.average).toFixed(3);
            setGlobalVar3(roundedValue);
            setReceivedData(roundedValue);

            // setGlobalVar3(data.average);
            // setReceivedData(data.average);
        } catch (error) {
            console.error("Lỗi giao tiếp với server:", error);
        }
    };

    useEffect(() => {
        if (flag3) {
            const timer = setTimeout(() => {
                playAudio();
                setFlag3(false); // Set flag1 to false after executing
            }, 1000);

            // Cleanup the timer when the component is unmounted
            return () => clearTimeout(timer);
        }
    }, [flag3, setFlag3]);

    return (
        <div className="page-container">
            <div className="header-3">
                <h1>Nhiệt độ</h1>
            </div>
            <div className="content">
                <div className="square">{receivedData || globalVar3} ℃</div>
            </div>
            <div className="audio-button-container">
                <button onClick={playAudio} className="icon-button">
                    <FontAwesomeIcon icon={faVolumeUp} />
                </button>
            </div>
            <div className="audio-button-container">
                <button onClick={sendSerialData} className="serial-button">
                    Bắt đầu
                </button>
            </div>
            <div id="button-container">
                <Link to="/page-two">
                    <button>
                        <FontAwesomeIcon icon={faArrowLeft} size="2x" />
                    </button>
                </Link>
                <Link to="/page-four">
                    <button>
                        <FontAwesomeIcon icon={faArrowRight} size="2x" />
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default PageThree;
