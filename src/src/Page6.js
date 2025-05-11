import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import "./styles2.css";
import soundFile from "./page6.mp3";
import { GlobalContext } from "./App"; // Import GlobalContext

function PageSix() {
    const [receivedData, setReceivedData] = useState("");
    const { globalVar6, setGlobalVar6 } = useContext(GlobalContext);
    const { flag6, setFlag6 } = useContext(GlobalContext);

    useEffect(() => {
        setGlobalVar6(-1);
    }, [setGlobalVar6]);

    const playAudio = () => {
        const audio = new Audio(soundFile); // Đường dẫn tới file âm thanh
        audio.play();
    };

    const sendSerialData = async () => {
        try {
            await fetch("http://localhost:5000/send-ECG", { method: "POST" });

            const response = await fetch("http://localhost:5000/listen");
            const data = await response.json();
            setReceivedData(data.data);
        } catch (error) {
            console.error("Lỗi giao tiếp với server:", error);
        }
    };

    useEffect(() => {
        if (flag6) {
            const timer = setTimeout(() => {
                playAudio();
                setFlag6(false); // Set flag1 to false after executing
            }, 1000);

            // Cleanup the timer when the component is unmounted
            return () => clearTimeout(timer);
        }
    }, [flag6, setFlag6]);

    return (
        <div className="page-container">
            <div className="header-6">
                <h1>Điện tâm đồ</h1>
            </div>
            <div className="content">
                <div className="square">{receivedData || globalVar6}</div>
            </div>
            <div className="audio-button-container">
                <button onClick={playAudio} className="icon-button">
                    <FontAwesomeIcon icon={faVolumeUp} />
                </button>
            </div>
            <div className="audio-button-container">
                <button onClick={sendSerialData} className="serial-button" disabled>
                    Bắt đầu
                </button>
            </div>
            <div id="button-container">
                <Link to="/page-five">
                    <button>Previous</button>
                </Link>
                <Link to="/page-seven">
                    <button>Next</button>
                </Link>
            </div>
        </div>
    );
}

export default PageSix;
