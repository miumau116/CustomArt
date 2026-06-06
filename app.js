function lahetaTilaus() {
    // 1. Haetaan asiakkaan valinnat div-rakenteesta
    const koko = document.getElementById('artSize').value;
    const kuvaus = document.getElementById('artDetails').value;

    if (!kuvaus) {
        alert("Ole hyvä ja kuvaile lyhyesti mitä haluat taideteokseen!");
        return;
    }

    // 2. TEHDÄÄN FETCH-PYYNTÖ RENDER-PALVELIMELLE
    // Huom: vaihdetaan tähän myöhemmin sinun oma Render-osoitteesi
    fetch('/luo-maksu-istunto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            koko: koko, 
            kuvaus: kuvaus 
        })
    })
    .then(response => {
        if (!response.ok) throw new Error("Palvelinvirhe");
        return response.json();
    })
    .then(session => {
        // 3. Ohjataan asiakas Stripen maksusivulle
        window.location.href = session.url;
    })
    .catch(error => {
        console.error("Virhe tilauksessa:", error);
        alert("Jotain meni vikaan. Yritä uudelleen.");
    });
}
