
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

const stripe = require('stripe')('sk_test_51Pabcdefghijklmnopqrstuvwxyz1234567890'); 

app.use(express.json());
app.use(cors());

// TÄMÄ PAKOTTAA PALVELIMEN LÖYTÄMÄÄN INDEX-TIEDOSTON SUORAAN NYKYISESTÄ KANSIOSTA
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.post('/luo-maksu-istunto', async (req, res) => {
    try {
        const { koko, kuvaus } = req.body;
        let hintaSentteina = 5000; 
        if (koko === 'A3') hintaSentteina = 8000;  
        if (koko === 'A2') hintaSentteina = 12000; 

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: `CustomArt - Koko ${koko}`,
                        description: `Toive: ${kuvaus}`,
                    },
                    unit_amount: hintaSentteina,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: 'https://render.com', 
            cancel_url: 'https://render.com',
        });

        res.json({ url: session.url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`CustomArt-palvelin käynnissä portissa ${PORT}!`));
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); // Mahdollistaa JSON-datan vastaanottamisen

// Väliaikainen tietokanta tilauksille palvelimen muistissa
let tilaukset = [];

// Tuotteiden viralliset hinnat palvelimella (Estää hintahuijaukset selaimessa)
const tuoteHinnasto = {
  'Piirretty piirustus': 20.00,
  'Mystery Box': 35.00,
  'Jewelry (Koru)': 15.00
};

// 1. VASTAANOTETAAN TILAUS KASSALTA
app.post('/api/tilaus', (req, res) => {
  const { ostoskori, osoite, postinumero, alennuskoodi } = req.body;

  // Tarkistetaan osoitetiedot palvelimella
  if (!osoite || !postinumero) {
    return res.status(400).json({ error: "Osoite tai postinumero puuttuu!" });
  }

  // Lasketaan summa palvelimen hintojen mukaan
  let summa = 0;
  ostoskori.forEach(tuote => {
    if (tuoteHinnasto[tuote.nimi]) {
      summa += tuoteHinnasto[tuote.nimi];
    }
  });

  // Tarkistetaan alennuskoodi backendissä
  let alennus = 0;
  if (alennuskoodi === "C0s7umAr7") {
    alennus = summa * 0.30;
  }

  let loppusumma = summa - alennus;

  // Luodaan uusi tilausobjekti
  const uusiTilaus = {
    id: Date.now(),
    tuotteet: ostoskori.map(t => t.nimi),
    loppusumma: loppusumma.toFixed(2),
    osoite: osoite,
    postinumero: postinumero,
    pvm: new Date().toLocaleString('fi-FI')
  };

  // Tallennetaan listaan
  tilaukset.push(uusiTilaus);

  res.json({ success: true, viesti: "Tilaus tallennettu palvelimelle!", loppusumma: loppusumma.toFixed(2) });
});

// 2. HAETAAN TILAUKSET VAIN OMISTAJALLE (OWNER)
app.get('/api/tilaukset', (req, res) => {
  const kayttajaRooli = req.headers['user-role']; // Haetaan rooli pyynnön headereista

  if (kayttajaRooli !== 'owner') {
    return res.status(403).json({ error: "Pääsy evätty. Vain omistaja voi nähdä tilaukset." });
  }

  // Jos rooli on owner, palautetaan kaikki tilaukset
  res.json(tilaukset);
});

// Käynnistetään palvelin porttiin 3000
app.listen(3000, () => {
  console.log("Serveri pyörii osoitteessa http://localhost:3000");
});
         
