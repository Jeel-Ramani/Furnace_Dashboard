// server.js
import express from 'express';
import ModbusRTU from 'modbus-serial';
import cors from 'cors';
const app = express();
app.use(cors());
const port = 3001;

const client = new ModbusRTU();

client.connectRTUBuffered("/dev/ttyAMA3", { baudRate: 9600 }) // or "COM3" on Windows
  .then(() => {
    console.log("Connected to Modbus");
    client.setID(1); // Set the Modbus slave ID
  })
  .catch(err => console.error("Connection error:", err));



// app.get("/temperature", async (req, res) => {
//   try {
//     const result = await client.readHoldingRegisters(1, 1); // Replace with correct address
//     const rawValue = result.data[0];
//     const temperature = rawValue; // Example scaling
//     // res.json({ temperature });
//     res.json({ temperature });

//   } catch (err) {

//     res.status(500).json({ error: err.message });
//   }
// });

app.get("/temperature", async (req, res) => {
  try {
    let sum = 0;
    const numReadings = 5;

    for (let i = 0; i < numReadings; i++) {
      const result = await client.readHoldingRegisters(1, 1); // Replace with correct address
      sum += result.data[0];
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay (100ms) between reads
    }

    const average = sum / numReadings;
    res.json({ temperature: average });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Modbus API running on http://localhost:${port}`);
});
