const express = require("express");
const cors = require("cors");
const { SerialPort, ReadlineParser } = require("serialport");

const app = express();
app.use(cors());
app.use(express.json());

let serialPort;
let parser;

// Hàm mở lại cổng Serial nếu cần
const openSerialPort = () => {
    if (!serialPort || !serialPort.isOpen) {
        serialPort = new SerialPort({ path: "COM6", baudRate: 115200 });
        parser = serialPort.pipe(new ReadlineParser());
    }
};

// API gửi dữ liệu "height\n" đến ESP32
app.post("/send-height", (req, res) => {
    openSerialPort();

    serialPort.write("height\n", (err) => {
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
    }, 3000);

    parser.on("data", (data) => {
        receivedData += data;
    });
});

// Lắng nghe trên cổng 5000
app.listen(PORT, () => console.log(`Server đang chạy trên cổng ${PORT}`));
