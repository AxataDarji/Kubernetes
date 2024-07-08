const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const PERSISTENT_DIR = '/home/axatahalifax/data'; // Replace with your name

app.use(express.json());

// Endpoint to store the file
app.post('/store-file', (req, res) => {
    const { file, data } = req.body;
    console.log('Incoming request body:', req.body);

    if (!file || !data) {
        return res.status(400).json({ file: null, error: "Invalid JSON input." });
    }

    const filePath = path.join(PERSISTENT_DIR, file);

    fs.writeFile(filePath, data, (err) => {
        if (err) {
            return res.status(500).json({ file, error: "Error while storing the file to the storage. error is "+err });
        }
        res.json({ file, message: "Success." });
    });
});

function isValidCSV(data) {
    const lines = data.split('\n').map(line => line.trim());
    if (lines.length < 2) return false; // At least one header and one data line
    const numColumns = lines[0].split(',').length;
    return lines.every(line => line.split(',').length === numColumns);
}

// Endpoint to calculate the product sum
app.post('/calculate', async (req, res) => {
    const { file, product } = req.body;

    if (!file || !product) {
        return res.status(400).json({ file: null, error: "Invalid JSON input." });
    }

    const filePath = path.join(PERSISTENT_DIR, file);

    fs.readFile(filePath, 'utf8', async (err, data) => {
        if (err) {
            return res.status(404).json({ file, error: "File not found." });
        }
        // Check if the file content is in CSV format
        if (!isValidCSV(data)) {
            return res.status(400).json({ file, error: "Input file not in CSV format." });
        }

        try {
            const response = await axios.post(`http://container2-service:3001/calculate`, { file, data, product });
            res.json({ file, sum: response.data.sum });
        } catch (error) {
            res.status(500).json({ file, error: "Error communicating with container 2." });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Container 1 listening on port ${PORT}`);
});
