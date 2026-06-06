// Alustetaan Express ja muut tarvittavat kirjastot
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// HUOM: Voit myöhemmin vaihtaa tähän oman salaisen Stripe-avaimesi (sk_test_...)
const stripe = require('stripe')('sk_test_51Pabcdefghijklmnopqrstuvwxyz1234567890'); 

app.use(express.json());
app.use(cors());

// Näytetään index.html automaattisesti, kun joku menee sivustolle
app.use(express.static(path.join(__dirname, '/')));

// Express kuuntelee fetch-pyyntöä tässä osoitteessa
app.post('/luo-maksu-istunto', async (req, res) => {
    try {
        const { koko, kuvaus } = req.body;

        // Määritetään hinnat euroina koon mukaan
        let hintaSentteina = 5000; // A4 = 50.00 €
        if (koko === 'A3') hintaSentteina = 8000;  // A3 = 80.00 €
        if (koko === 'A2') hintaSentteina = 12000; // A2 = 120.00 €

        // Luodaan virallinen Stripe-maksusessio
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
            // Korvaa nämä myöhemmin omalla Render-osoitteellasi
            success_url: 'https://render.com', 
            cancel_url: 'https://render.com',
        });

        console.log(`Uusi CustomArt-tilaus vastaanotettu! Koko: ${koko}, Toive: ${kuvaus}`);

        // Lähetetään Stripen maksulinkki takaisin fetch-funktiolle
        res.json({ url: session.url });

    } catch (error) {
        console.error("Stripe-virhe:", error);
        res.status(500).json({ error: error.message });
    }
});

// Render määrittää portin automaattisesti netissä
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`CustomArt-palvelin käynnissä portissa ${PORT}!`));
