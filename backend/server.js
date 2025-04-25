const express = require("express");
const cors = require("cors");
const { SerialPort, ReadlineParser } = require("serialport");
const { spawn } = require("child_process");

const app = express();
app.use(cors());
app.use(express.json());

let serialPort;
let parser;

// Hàm mở lại cổng Serial nếu cần
const openSerialPort = () => {
    if (!serialPort || !serialPort.isOpen) {
        serialPort = new SerialPort({ path: "COM7", baudRate: 115200 });
        parser = serialPort.pipe(new ReadlineParser());
    }
};

// Hàm restart server
const restartServer = () => {
    console.log("Đang khởi động lại server...");

    // Khởi động lại tiến trình server
    spawn("node", ["server.js"], {
        stdio: "inherit", // Kế thừa luồng I/O từ tiến trình cha
        detached: true,   // Tách tiến trình con ra khỏi cha
    });

    process.exit(); // Thoát tiến trình hiện tại
};

app.post("/SERVO-MOVEDEFAULT", (req, res) => {
    openSerialPort();

    serialPort.write("SERVO-MOVEDEFAULT\n", (err) => {
        if (err) {
            return res.status(500).json({ message: "Lỗi gửi dữ liệu" });
        }
        res.json({ message: "Đã gửi string đến COM6" });
    });
});

app.post("/SERVO-MOVEDN", (req, res) => {
    openSerialPort();

    serialPort.write("SERVO-MOVEDN\n", (err) => {
        if (err) {
            return res.status(500).json({ message: "Lỗi gửi dữ liệu" });
        }
        res.json({ message: "Đã gửi string đến COM6" });
    });
});

app.post("/SERVO-MOVEUP", (req, res) => {
    openSerialPort();

    serialPort.write("SERVO-MOVEUP\n", (err) => {
        if (err) {
            return res.status(500).json({ message: "Lỗi gửi dữ liệu" });
        }
        res.json({ message: "Đã gửi string đến COM6" });
    });
});

app.post("/SERVO-STOP", (req, res) => {
    openSerialPort();

    // serialPort.write("height\n", (err) => {
    serialPort.write("SERVO-STOP\n", (err) => {
        if (err) {
            return res.status(500).json({ message: "Lỗi gửi dữ liệu" });
        }
        res.json({ message: "Đã gửi string đến COM6" });
    });
});

app.post("/send-height", (req, res) => {
    openSerialPort();

    serialPort.write("SERVO-GETANGLE\n", (err) => {
        // serialPort.write("SERVO-MOVEDN\n", (err) => {
        if (err) {
            return res.status(500).json({ message: "Lỗi gửi dữ liệu" });
        }
        res.json({ message: "Đã gửi height đến COM6" });
    });
});

app.post("/send-weight", (req, res) => {
    openSerialPort();

    serialPort.write("SCALE-GETWEIGHT\n", (err) => {
        if (err) {
            return res.status(500).json({ message: "Lỗi gửi dữ liệu" });
        }
        res.json({ message: "Đã gửi height đến COM6" });
    });
});

app.post("/send-temp", (req, res) => {
    openSerialPort();

    serialPort.write("TEMP-GETOBJ\n", (err) => {
        if (err) {
            return res.status(500).json({ message: "Lỗi gửi dữ liệu" });
        }
        res.json({ message: "Đã gửi height đến COM6" });
    });
});

app.post("/send-heart", (req, res) => {
    openSerialPort();

    serialPort.write("POX-GETDATA\n", (err) => {
        if (err) {
            return res.status(500).json({ message: "Lỗi gửi dữ liệu" });
        }
        res.json({ message: "Đã gửi height đến COM6" });
    });
});

app.post("/send-sp02", (req, res) => {
    openSerialPort();

    serialPort.write("POX-GETDATA\n", (err) => {
        if (err) {
            return res.status(500).json({ message: "Lỗi gửi dữ liệu" });
        }
        res.json({ message: "Đã gửi height đến COM6" });
    });
});

app.post("/send-ECG", (req, res) => {
    openSerialPort();

    serialPort.write("ECG\n", (err) => {
        if (err) {
            return res.status(500).json({ message: "Lỗi gửi dữ liệu" });
        }
        res.json({ message: "Đã gửi height đến COM6" });
    });
});


// API lắng nghe dữ liệu từ ESP32 và restart server sau khi hoàn thành
app.get("/listen", (req, res) => {
    openSerialPort();

    let receivedData = "";
    const timeout = setTimeout(() => {
        res.json({ data: receivedData });

        parser.removeAllListeners("data"); // Xóa lắng nghe
        restartServer(); // Thực hiện restart server
    }, 20000);

    parser.on("data", (data) => {
        receivedData += data;
    });
});

app.get("/listen-height", (req, res) => {
    openSerialPort();

    let receivedValues = [];
    let averageValue = 0;

    const onDataHandler = (data) => {
        if (data.startsWith("ANGLE-")) { // Kiểm tra dữ liệu bắt đầu với 'ANGLE-'
            const value = parseInt(data.split("-")[1]); // Tách giá trị số từ dữ liệu
            if (!isNaN(value)) {
                receivedValues.push(value);
            }
        }

        if (receivedValues.length === 5) { // Kiểm tra đủ 5 giá trị
            averageValue = receivedValues.reduce((sum, value) => sum + value, 0) / receivedValues.length;

            res.json({ average: averageValue }); // Gửi giá trị trung bình
            parser.removeListener("data", onDataHandler); // Xóa lắng nghe
            restartServer(); // Thực hiện restart server
        }
    };

    parser.on("data", onDataHandler);
});

app.get("/listen-weight", (req, res) => {
    openSerialPort();

    let receivedValues = [];
    let averageValue = 0;

    const onDataHandler = (data) => {
        if (data.startsWith("WEIGHT-")) { // Kiểm tra dữ liệu bắt đầu với 'ANGLE-'
            const value = parseFloat(data.split("-")[1]); // Tách giá trị số từ dữ liệu
            if (!isNaN(value)) {
                receivedValues.push(value);
            }
        }

        if (receivedValues.length === 5) { // Kiểm tra đủ 5 giá trị
            averageValue = receivedValues.reduce((sum, value) => sum + value, 0) / receivedValues.length;

            res.json({ average: averageValue }); // Gửi giá trị trung bình
            parser.removeListener("data", onDataHandler); // Xóa lắng nghe
            restartServer(); // Thực hiện restart server
        }
    };

    parser.on("data", onDataHandler);
});

app.get("/listen-temp", (req, res) => {
    openSerialPort();

    let receivedValues = [];
    let timeout = null; // Biến timeout
    let averageValue = 0;

    const onDataHandler = (data) => {
        if (data.startsWith("OBJ-")) {
            const value = parseFloat(data.split("-")[1]); // Lấy giá trị số
            if (!isNaN(value)) {
                receivedValues.push(value);
            }
        }

        // Kiểm tra nếu đã nhận đủ 5 giá trị
        if (receivedValues.length === 5) {
            averageValue = receivedValues.reduce((sum, value) => sum + value, 0) / receivedValues.length;

            // Gửi kết quả tính trung bình
            res.json({ average: averageValue });

            // Xóa listener và timeout
            parser.removeListener("data", onDataHandler);
            clearTimeout(timeout);

            // Restart server
            restartServer();
        } else {
            // Đặt timeout để xử lý nếu không đủ giá trị sau một thời gian
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if (receivedValues.length > 0) {
                    averageValue = receivedValues.reduce((sum, value) => sum + value, 0) / receivedValues.length;
                    res.json({ average: averageValue });
                } else {
                    res.json({ error: "Không nhận được đủ dữ liệu trong khoảng thời gian quy định." });
                }

                parser.removeListener("data", onDataHandler);
                restartServer();
            }, 20000); // Timeout 5 giây
        }
    };

    parser.on("data", onDataHandler);
});


// app.get("/listen-pox", (req, res) => {
//     openSerialPort();

//     let xValues = [];
//     let yValues = [];
//     let averageX = 0;
//     let averageY = 0;

//     const onDataHandler = (data) => {
//         if (data.startsWith("POX-")) { // Kiểm tra dữ liệu bắt đầu với 'POX-'
//             const parts = data.split("-"); // Tách các phần dữ liệu
//             const x = parseInt(parts[1]); // Lấy giá trị đầu tiên (x)
//             const y = parseFloat(parts[2]); // Lấy giá trị thứ hai (y, số thập phân)

//             if (!isNaN(x) && !isNaN(y)) {
//                 xValues.push(x);
//                 yValues.push(y);
//             }
//         }

//         if (xValues.length === 5 && yValues.length === 5) { // Đủ 5 giá trị cho cả x và y
//             averageX = xValues.reduce((sum, value) => sum + value, 0) / xValues.length;
//             averageY = yValues.reduce((sum, value) => sum + value, 0) / yValues.length;

//             res.json({ averageX, averageY }); // Gửi giá trị trung bình của x và y
//             parser.removeListener("data", onDataHandler); // Xóa lắng nghe
//             restartServer(); // Thực hiện restart server
//         }
//     };

//     parser.on("data", onDataHandler);
// });

app.get("/listen-pox", (req, res) => {
    openSerialPort();

    let xValues = [];
    let yValues = [];
    let averageX = 0;
    let averageY = 0;
    let timeout = null; // Biến timeout

    const onDataHandler = (data) => {
        if (data.startsWith("POX-")) { // Kiểm tra dữ liệu bắt đầu với 'POX-'
            const parts = data.split("-"); // Tách các phần dữ liệu
            const x = parseInt(parts[1]); // Lấy giá trị đầu tiên (x)
            const y = parseFloat(parts[2]); // Lấy giá trị thứ hai (y, số thập phân)

            if (!isNaN(x) && !isNaN(y)) {
                xValues.push(x);
                yValues.push(y);
            }
        }

        // Kiểm tra nếu đã nhận đủ 5 giá trị cho cả x và y
        if (xValues.length === 5 && yValues.length === 5) {
            averageX = xValues.reduce((sum, value) => sum + value, 0) / xValues.length;
            averageY = yValues.reduce((sum, value) => sum + value, 0) / yValues.length;

            // Gửi kết quả trung bình
            res.json({ averageX, averageY });

            // Xóa listener và timeout
            parser.removeListener("data", onDataHandler);
            clearTimeout(timeout);

            // Restart server
            restartServer();
        } else {
            // Đặt timeout để xử lý nếu không nhận đủ giá trị sau một thời gian
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if (xValues.length > 0 && yValues.length > 0) {
                    averageX = xValues.reduce((sum, value) => sum + value, 0) / xValues.length;
                    averageY = yValues.reduce((sum, value) => sum + value, 0) / yValues.length;

                    res.json({ averageX, averageY });
                } else {
                    res.json({ error: "Không nhận được đủ dữ liệu trong khoảng thời gian quy định." });
                }

                parser.removeListener("data", onDataHandler);
                restartServer();
            }, 35000); // Timeout 5 giây
        }
    };

    parser.on("data", onDataHandler);
});


// Lắng nghe trên cổng 5000
const PORT = 5000;
app.listen(PORT, () => console.log(`Server đang chạy trên cổng ${PORT}`));

process.on("SIGINT", () => {
    console.log("Đang thoát server...");
    if (serialPort && serialPort.isOpen) {
        serialPort.close(() => {
            console.log("Đã đóng cổng Serial.");
            process.exit();
        });
    } else {
        process.exit();
    }
});


// netstat -ano | findstr :5000
// taskkill /F /PID 7228
