const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const PERSISTENT_DIR = '/home/axatahalifax/data'; // Replace with your name

app.use(express.json());

// Endpoint to calculate the sum of a product
app.post('/calculate', (req, res) => {
    const { file, data, product } = req.body;

    const filePath = path.join(PERSISTENT_DIR, file);

    const lines = data.split('\n');
    let sum = 0;

    for (let line of lines) {
        const [prod, amount] = line.split(',').map(s => s.trim());

        if (prod === product) {
            sum += parseInt(amount, 10);
        }
    }

    res.json({ file, sum });
});

app.listen(PORT, () => {
    console.log(`Container 2 listening on port ${PORT}`);
});
