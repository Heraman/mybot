const path = require('path');
const fs = require('fs');

// Path absolut ke data.json
const dataPath = path.join(__dirname, 'data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

function getRandomData(jumlah) {
    jumlah = Math.min(jumlah, data.length); // Pastikan tidak melebihi jumlah data yang tersedia

    // Acak data
    const shuffled = data.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, jumlah);
}

module.exports = getRandomData;
