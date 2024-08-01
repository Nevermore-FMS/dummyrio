const dgram = require('node:dgram');
const net = require("net")

const udpServer = dgram.createSocket('udp4');

udpServer.on('message', (msg, rinfo) => {
    const sequenceNum = msg.readUInt16BE(0)
    const commVersion = msg.readUint8(2)
    const control = msg.readUint8(3)
    const request = msg.readUint8(4)
    const alliance = msg.readUint8(5)

    const estop = (control >> 7 & 0x01) === 0x01
    const fmsConnected = (control >> 3 & 0x01) === 0x01
    const enabled = (control >> 2 & 0x01) === 0x01
    const mode = control & 0x03

    // Construct Reply
    let status = 0x00
    if (estop) status = status | (1 << 7)
    if (enabled) status = status | (1 << 2)
    status = status | (mode & 0x03)

    let trace = 0b00110000
    if (mode === 1) trace = trace | (1 << 3)
    if (mode === 2) trace = trace | (1 << 2)
    if (mode === 0) trace = trace | (1 << 1)
    if (enabled) trace = trace | 0x01

    const reply = Buffer.alloc(8)
    reply.writeUInt16BE(sequenceNum, 0)
    reply.writeUInt8(commVersion, 2)
    reply.writeUInt8(status, 3)
    reply.writeUInt8(trace, 4)
    reply.writeUInt16BE(0x0C00, 5)
    reply.writeUInt8(0x00, 7)

    udpServer.send(reply, 1150, rinfo.address)
})

udpServer.bind(1110)

const tcpServer = net.createServer()
tcpServer.listen(1740)