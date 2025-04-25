const WebSocket = require('ws');
const { SerialPort } = require('serialport');

const wss = new WebSocket.Server({ port: 8080 });
const port = new SerialPort('/dev/tty-usbserial1', { baudRate: 9600 });

wss.on('connection', (ws) => {
    console.log('WebSocket connected!');

    // Nhận dữ liệu từ WebSocket client và gửi qua UART
    ws.on('message', (message) => {
        console.log('Received from WebSocket:', message);
        port.write(message);
    });

    // Nhận dữ liệu từ UART và gửi tới WebSocket client
    port.on('data', (data) => {
        ws.send(data.toString());
    });
});
