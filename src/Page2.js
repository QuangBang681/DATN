import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import "./styles2.css";
import soundFile from "./page2.mp3";
import { GlobalContext } from "./App"; // Import GlobalContext

function PageTwo() {
    const [receivedData, setReceivedData] = useState("");
    const { globalVar2, setGlobalVar2 } = useContext(GlobalContext); // Access globalVar2
    const { flag2, setFlag2 } = useContext(GlobalContext);
    const [isDisabled, setIsDisabled] = useState(false);

    const playAudio = () => {
        const audio = new Audio(soundFile); // Audio file path
        audio.play();
    };

    const sendSerialData = async () => {
        setIsDisabled(true);
        try {
            await fetch("http://localhost:5000/send-weight", { method: "POST" });

            const response = await fetch("http://localhost:5000/listen-weight");
            const data = await response.json();
            setReceivedData(data.average); // Cập nhật state với giá trị trung bình từ server
            setGlobalVar2(data.average); // Lưu giá trị trung bình vào biến toàn cục globalVar2
        } catch (error) {
            console.error("Lỗi giao tiếp với server:", error);
        }
        setTimeout(() => {
            setIsDisabled(false); // Kích hoạt lại nút sau 2.5 giây
        }, 2500);
    };

    useEffect(() => {
        if (flag2) {
            const timer = setTimeout(() => {
                playAudio();
                setFlag2(false); // Set flag1 to false after executing
            }, 1000);

            // Cleanup the timer when the component is unmounted
            return () => clearTimeout(timer);
        }
    }, [flag2, setFlag2]);

    return (
        <div className="page-container">
            <div className="header-2">
                <h1>Cân nặng</h1>
            </div>
            <div className="content">
                {/* Use globalVar2 as the primary value */}
                <div className="square">{receivedData || globalVar2} kg</div>
            </div>
            <div className="audio-button-container">
                <button onClick={playAudio} className="icon-button">
                    <FontAwesomeIcon icon={faVolumeUp} />
                </button>
            </div>
            <div className="audio-button-container">
                <button onClick={sendSerialData} className="serial-button" disabled={isDisabled}>
                    Bắt đầu
                </button>
            </div>
            <div id="button-container">
                <Link to="/page-one">
                    <button>
                        <FontAwesomeIcon icon={faArrowLeft} size="2x" />
                    </button>
                </Link>
                <Link to="/page-three">
                    <button>
                        <FontAwesomeIcon icon={faArrowRight} size="2x" />
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default PageTwo;
