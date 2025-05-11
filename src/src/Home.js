import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css'; // Import file CSS
import { GlobalContext } from "./App";

function Home() {
    const navigate = useNavigate();

    const handleButtonClick = async () => {
        try {
            await sendSerialData(); // Call the sendSerialData function
            navigate('/cam');
        } catch (error) {
            console.error("An error occurred while handling the button click:", error);
        }
    };

    const {
        setGlobalVar1,
        setGlobalVar2,
        setGlobalVar3,
        setGlobalVar4,
        setGlobalVar5
    } = useContext(GlobalContext);

    useEffect(() => {
        // Đặt tất cả các biến global về null
        setGlobalVar1(null);
        setGlobalVar2(null);
        setGlobalVar3(null);
        setGlobalVar4(null);
        setGlobalVar5(null);
    }, [setGlobalVar1, setGlobalVar2, setGlobalVar3, setGlobalVar4, setGlobalVar5]);

    const sendSerialData = async () => {
        try {
            await fetch("http://localhost:5000/SERVO-MOVEDEFAULT", { method: "POST" });
        } catch (error) {
            console.error("Lỗi giao tiếp với server:", error);
        }
    };

    const {
        setFlag1,
        setFlag2,
        setFlag3,
        setFlag4,
        setFlag5,
        setFlag6
    } = useContext(GlobalContext);

    useEffect(() => {
        // Đặt tất cả các biến global về null
        setFlag1(true);
        setFlag2(true);
        setFlag3(true);
        setFlag4(true);
        setFlag5(true);
        setFlag6(true)
    }, [setFlag1, setFlag2, setFlag3, setFlag4, setFlag5, setFlag6]);

    return (
        <div className="home-container">
            <button className="navigate-button" onClick={handleButtonClick}>
                Bắt đầu
            </button>
        </div>
    );
}

export default Home;
//SERVO-MOVEDEFAULT