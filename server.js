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
