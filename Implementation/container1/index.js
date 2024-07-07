const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const PERSISTENT_DIR = '/yourname_PV_dir'; // Replace with your name

app.use(express.json());

// Endpoint to store the file
app.post('/store-file', (req, res) => {
    const { file, data } = req.body;

    if (!file || !data) {
        return res.status(400).json({ file: null, error: "Invalid JSON input." });
    }

    const filePath = path.join(PERSISTENT_DIR, file);

    fs.writeFile(filePath, data, (err) => {
        if (err) {
            return res.status(500).json({ file, error: "Error while storing the file to the storage." });
        }
        res.json({ file, message: "Success." });
    });
});

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
