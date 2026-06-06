const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Kertoo palvelimelle, että index.html on päänäkymä
app.use(express.static(__dirname));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Kauppa pyörii portissa ${port}`);
});
