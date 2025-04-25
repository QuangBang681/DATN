import React, { useRef, useEffect, useState } from "react";
import * as blazeface from "@tensorflow-models/blazeface";
import "@tensorflow/tfjs";
import "./cam.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const FaceDetection = ({ setIsCentered }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [cameraHeightAdjustment, setCameraHeightAdjustment] = useState("");

    const sendCommandToServer = async (command) => {
        try {
            await fetch(`http://localhost:5000/${command}`, { method: "POST" });
            console.log(`Đã gửi lệnh ${command} đến server`);
        } catch (error) {
            console.error("Lỗi khi gửi lệnh đến server:", error);
        }
    };

    useEffect(() => {
        const loadModel = async () => {
            const model = await blazeface.load();
            const detectFace = async () => {
                if (!canvasRef.current || !videoRef.current) return;
                const ctx = canvasRef.current.getContext("2d");
                if (!ctx) return;

                if (videoRef.current.readyState === 4) {
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    ctx.drawImage(
                        videoRef.current,
                        0,
                        0,
                        canvasRef.current.width,
                        canvasRef.current.height
                    );

                    const predictions = await model.estimateFaces(videoRef.current);
                    if (predictions.length > 0) {
                        const { topLeft, bottomRight } = predictions[0];
                        const faceCenterY = (topLeft[1] + bottomRight[1]) / 2;

                        ctx.strokeStyle = "red";
                        ctx.strokeRect(
                            topLeft[0],
                            topLeft[1],
                            bottomRight[0] - topLeft[0],
                            bottomRight[1] - topLeft[1]
                        );

                        const centerYTolerance = canvasRef.current.height * 0.075; // 4.5% chiều cao
                        const canvasCenterY = canvasRef.current.height / 2;

                        if (faceCenterY < canvasCenterY - centerYTolerance) {
                            setCameraHeightAdjustment("Move camera up");
                            setIsCentered(false); // Không cho phép nhấn nút
                            sendCommandToServer("SERVO-MOVEUP");
                        } else if (faceCenterY > canvasCenterY + centerYTolerance) {
                            setCameraHeightAdjustment("Move camera down");
                            setIsCentered(false); // Không cho phép nhấn nút
                            sendCommandToServer("SERVO-MOVEDN");
                        } else {
                            setCameraHeightAdjustment("Face is centered");
                            setIsCentered(true); // Cho phép nhấn nút
                            sendCommandToServer("SERVO-STOP");
                        }
                    }
                }
            };

            const interval = setInterval(detectFace, 100);
            return () => clearInterval(interval);
        };

        const setupCamera = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            videoRef.current.srcObject = stream;
            videoRef.current
                .play()
                .catch((error) => console.error("Error playing video:", error)); // Xử lý lỗi play
            await loadModel();
        };

        setupCamera();
    }, [setIsCentered]); // Thêm dependency `setIsCentered` để đảm bảo cập nhật khi thay đổi.

    return (
        <div className="container">
            <video
                ref={videoRef}
                width="640"
                height="480"
                style={{
                    transform: "scaleX(-1)", // Mirror effect
                    display: "none", // Ẩn video vì chỉ sử dụng canvas
                }}
            ></video>
            <canvas
                ref={canvasRef}
                width="640"
                height="480"
            ></canvas>
            <p className="adjustment-text">{cameraHeightAdjustment}</p>
        </div>
    );
};

const CamPage = () => {
    const navigate = useNavigate(); // Dùng để điều hướng
    const [isCentered, setIsCentered] = useState(false); // Trạng thái cho nút "Tiếp tục"

    const handleLeftButtonClick = () => {
        navigate("/"); // Điều hướng về trang '/'
    };

    const handleRightButtonClick = () => {
        if (isCentered) {
            navigate("/page-one"); // Điều hướng đến 'page-one'
        }
    };

    return (
        <div className="cam-container">
            <FaceDetection setIsCentered={setIsCentered} />
            <button
                className="left-button"
                style={{
                    position: "absolute",
                    bottom: "20px",
                    left: "20px",
                }}
                onClick={handleLeftButtonClick}
            >
                Trờ về màn hình chờ
            </button>
            <button
                className="right-button"
                style={{
                    position: "absolute",
                    bottom: "20px",
                    right: "20px",
                }}
                onClick={handleRightButtonClick}
                disabled={!isCentered} // Chỉ kích hoạt nếu `isCentered` là true
            >
                Tiếp tục
            </button>
        </div>
    );
};

export default CamPage;
