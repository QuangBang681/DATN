import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { ref, set } from "firebase/database"; // Import Firebase
import database from "./firebase-config"; // File cấu hình Firebase
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import "./styles2.css";
import { GlobalContext } from "./App"; // Import GlobalContext to access global variables

function PageSeven() {
    const navigate = useNavigate(); // Initialize navigate function

    // State để kiểm soát trạng thái nút Submit
    const [isDisabled, setIsDisabled] = useState(true);

    // Kích hoạt nút sau 5 giây khi route vào trang
    useEffect(() => {
        const timer = setTimeout(() => setIsDisabled(false), 1000); //1s
        return () => clearTimeout(timer); // Xóa bộ đếm thời gian khi unmount
    }, []);

    // Access global variables from context
    const {
        globalVar1, // Height
        globalVar2, // Weight
        globalVar3, // Temp
        globalVar4, // Heart Rate
        globalVar5, // SpO2
        globalVar6, // ECG
    } = useContext(GlobalContext);

    // Handle Firebase submission
    const handleSubmit = () => {
        const dataRef = ref(database, "machine1"); // Path to Firebase location
        const formattedData = {
            _id: 1, // Fixed ID value
            height: globalVar1, // Map Height to globalVar1
            weight: globalVar2, // Map Weight to globalVar2
            temp: globalVar3,   // Map Temp to globalVar3
            heart_rate: globalVar4, // Map Heart Rate to globalVar4
            sp02: globalVar5,       // Map SpO2 to globalVar5
            ECG: globalVar6,        // Map ECG to globalVar6
        };

        set(dataRef, formattedData)
            .then(() => {
                alert("Dữ liệu đã được gửi lên Firebase!");

                // Redirect to homepage ("/") after 5 seconds
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            })
            .catch((error) => alert(`Lỗi: ${error.message}`));
    };

    // Return the updated JSX
    return (
        <div className="page-container">
            <div className="header-7">
                <h1>Tổng kết</h1>
            </div>
            <div className="content-1">
                <div className="square">
                    Height:<br />
                    {globalVar1}cm
                </div>
                <div className="square">
                    Weight:<br />
                    {globalVar2}kg
                </div>
                <div className="square">
                    Temp:<br />
                    {globalVar3}°C
                </div>
            </div>
            <div className="content-2">
                <div className="square">
                    Heart Rate:<br />
                    {globalVar4} bpm
                </div>
                <div className="square">
                    SpO2:<br />
                    {globalVar5}%
                </div>
            </div>
            <div id="button-container">
                <Link to="/page-five">
                    <button>
                        <FontAwesomeIcon icon={faArrowLeft} size="2x" />
                    </button>
                </Link>
                <button onClick={handleSubmit} disabled={isDisabled}>Submit</button>
            </div>
        </div>
    );
}

export default PageSeven;
