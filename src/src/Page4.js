import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import "./styles2.css";
import soundFile from "./page4.mp3";
import { GlobalContext } from "./App"; // Import GlobalContext

function PageFour() {
    const [receivedDataX, setReceivedDataX] = useState(""); // State lưu giá trị x
    const [setReceivedDataY] = useState(""); // State lưu giá trị y
    const { globalVar4, setGlobalVar4, globalVar5, setGlobalVar5 } = useContext(GlobalContext);
    const { flag4, setFlag4 } = useContext(GlobalContext);

    const playAudio = () => {
        const audio = new Audio(soundFile); // Đường dẫn tới file âm thanh
        audio.play();
    };

    const sendSerialData = async () => {
        try {
            await fetch("http://localhost:5000/send-heart", { method: "POST" });

            const response = await fetch("http://localhost:5000/listen-pox"); // Gửi yêu cầu tới endpoint listen-pox
            const data = await response.json();

            const roundedAverageX = parseFloat(data.averageX).toFixed(3);
            const roundedAverageY = parseFloat(data.averageY).toFixed(3);
            setGlobalVar4(roundedAverageX);
            setGlobalVar5(roundedAverageY);
            setReceivedDataX(roundedAverageX);
            setReceivedDataY(roundedAverageY);

            // setGlobalVar4(data.averageX);
            // setGlobalVar5(data.averageY);
            // setReceivedDataX(data.averageX);
            // setReceivedDataY(data.averageY);
        } catch (error) {
            console.error("Lỗi giao tiếp với server:", error);
        }
    };

    useEffect(() => {
        if (flag4) {
            const timer = setTimeout(() => {
                playAudio();
                setFlag4(false); // Set flag1 to false after executing
            }, 1000);

            // Cleanup the timer when the component is unmounted
            return () => clearTimeout(timer);
        }
    }, [flag4, setFlag4]);

    return (
        <div className="page-container">
            <div className="header-4">
                <h1>Nhịp tim & Oxy máu</h1>
            </div>
            <div className="content">
                <div className="square">{globalVar4} bpm</div>
                <div className="square">{globalVar5} %</div>
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
                <Link to="/page-three">
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

export default PageFour;
