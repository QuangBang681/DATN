import React, { useState, useEffect, useContext } from "react";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import './styles2.css'; // Import file CSS
import soundFile from './page1.mp3';
import { GlobalContext } from "./App";

function PageOne() {
    const [receivedData] = useState(""); // State để lưu dữ liệu nhận được
    const { globalVar1, setGlobalVar1 } = useContext(GlobalContext); // Access globalVar1
    const { flag1, setFlag1 } = useContext(GlobalContext);

    const playAudio = () => {
        const audio = new Audio(soundFile);
        audio.play();
    };

    const sendSerialData = async () => {
        try {
            await fetch("http://localhost:5000/send-height", { method: "POST" });

            const response = await fetch("http://localhost:5000/listen-height");
            const data = await response.json();
            setGlobalVar1(data.average); // Lưu giá trị vào biến toàn cục
        } catch (error) {
            console.error("Lỗi giao tiếp với server:", error);
        }
    };

    useEffect(() => {
        if (flag1) {
            const timer = setTimeout(() => {
                playAudio();
                setFlag1(false); // Set flag1 to false after executing
            }, 1000);

            // Cleanup the timer when the component is unmounted
            return () => clearTimeout(timer);
        }
    }, [flag1, setFlag1]);

    useEffect(() => {
        // Logic chuyển đổi góc thành chiều cao
        if (globalVar1 >= 150 && globalVar1 <= 185) {
            // Giữ nguyên nếu trong khoảng từ 150 đến 185
            setGlobalVar1(globalVar1);
        } else if (globalVar1 >= 362 && globalVar1 <= 371) {
            setGlobalVar1(150);
        } else if (globalVar1 > 371 && globalVar1 <= 379) {
            setGlobalVar1(151);
        } else if (globalVar1 > 379 && globalVar1 <= 387) {
            setGlobalVar1(152);
        } else if (globalVar1 > 387 && globalVar1 <= 396) {
            setGlobalVar1(153);
        } else if (globalVar1 > 396 && globalVar1 <= 404) {
            setGlobalVar1(154);
        } else if (globalVar1 > 404 && globalVar1 <= 412) {
            setGlobalVar1(155);
        } else if (globalVar1 > 412 && globalVar1 <= 420) {
            setGlobalVar1(156);
        } else if (globalVar1 > 420 && globalVar1 <= 429) {
            setGlobalVar1(157);
        } else if (globalVar1 > 429 && globalVar1 <= 437) {
            setGlobalVar1(158);
        } else if (globalVar1 > 437 && globalVar1 <= 445) {
            setGlobalVar1(159);
        } else if (globalVar1 > 445 && globalVar1 <= 453) {
            setGlobalVar1(160);
        } else if (globalVar1 > 453 && globalVar1 <= 462) {
            setGlobalVar1(161);
        } else if (globalVar1 > 462 && globalVar1 <= 470) {
            setGlobalVar1(162);
        } else if (globalVar1 > 470 && globalVar1 <= 478) {
            setGlobalVar1(163);
        } else if (globalVar1 > 478 && globalVar1 <= 487) {
            setGlobalVar1(164);
        } else if (globalVar1 > 487 && globalVar1 <= 495) {
            setGlobalVar1(165);
        } else if (globalVar1 > 495 && globalVar1 <= 503) {
            setGlobalVar1(166);
        } else if (globalVar1 > 503 && globalVar1 <= 512) {
            setGlobalVar1(167);
        } else if (globalVar1 > 512 && globalVar1 <= 520) {
            setGlobalVar1(168);
        } else if (globalVar1 > 520 && globalVar1 <= 528) {
            setGlobalVar1(169);
        } else if (globalVar1 > 528 && globalVar1 <= 536) {
            setGlobalVar1(170);
        } else if (globalVar1 > 536 && globalVar1 <= 545) {
            setGlobalVar1(171);
        } else if (globalVar1 > 545 && globalVar1 <= 573) {
            setGlobalVar1(172);
        } else if (globalVar1 > 573 && globalVar1 <= 600) {
            setGlobalVar1(173);
        } else if (globalVar1 > 600 && globalVar1 <= 612) {
            setGlobalVar1(174);
        } else if (globalVar1 > 612 && globalVar1 <= 620) {
            setGlobalVar1(175);
        } else if (globalVar1 > 620 && globalVar1 <= 628) {
            setGlobalVar1(176);
        } else if (globalVar1 > 628 && globalVar1 <= 636) {
            setGlobalVar1(177);
        } else if (globalVar1 > 636 && globalVar1 <= 645) {
            setGlobalVar1(178);
        } else if (globalVar1 > 645 && globalVar1 <= 653) {
            setGlobalVar1(179);
        } else if (globalVar1 > 653 && globalVar1 <= 661) {
            setGlobalVar1(180);
        } else if (globalVar1 > 661 && globalVar1 <= 670) {
            setGlobalVar1(181);
        } else if (globalVar1 > 670 && globalVar1 <= 678) {
            setGlobalVar1(182);
        } else if (globalVar1 > 678 && globalVar1 <= 686) {
            setGlobalVar1(183);
        } else if (globalVar1 > 686 && globalVar1 <= 689) {
            setGlobalVar1(184);
        } else if (globalVar1 > 689 && globalVar1 <= 697) {
            setGlobalVar1(185);
        } else {
            console.error("Value out of range.");
        }
    }, [globalVar1, setGlobalVar1]);


    return (
        <div className="page-container">
            <div className="header-1">
                <h1>Chiều cao</h1>
            </div>
            <div className="content">
                <div className="square">{receivedData || globalVar1} cm</div>
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
                <button disabled>
                    <FontAwesomeIcon icon={faArrowLeft} size="2x" />
                </button>
                <Link to="/page-two">
                    <button>
                        <FontAwesomeIcon icon={faArrowRight} size="2x" />
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default PageOne;
