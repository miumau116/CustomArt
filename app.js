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
    fetch('https://onrender.com', {
        
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

let ostoskori = [];
let alennusAktiivinen = false;

function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function naytaOsio(osionId) {
  document.getElementById('verkkokauppa').style.display = 'none';
  document.getElementById('ostoskori').style.display = 'none';
  document.getElementById('kassa').style.display = 'none';
  document.getElementById(osionId).style.display = 'block';
  toggleMenu();
}

function lisaaOstoskoriin(nimi, hinta) {
  ostoskori.push({ id: Date.now() + Math.random(), nimi: nimi, hinta: hinta });
  paivitaOstoskori();
}

function poistaOstoskorista(id) {
  ostoskori = ostoskori.filter(t => t.id !== id);
  paivitaOstoskori();
}

function paivitaOstoskori() {
  const lista = document.getElementById("ostoskoriLista");
  document.getElementById("ostoskoriMaara").innerText = ostoskori.length;
  lista.innerHTML = "";
  let summa = 0;
  ostoskori.forEach(t => {
    summa += t.hinta;
    const li = document.createElement("li");
    li.innerText = `${t.nimi} - ${t.hinta}€`;
    li.ondblclick = () => poistaOstoskorista(t.id);
    lista.appendChild(li);
  });
  let loppu = alennusAktiivinen ? summa * 0.7 : summa;
  document.getElementById("loppuSumma").innerText = loppu.toFixed(2);
}

function tarkistaKoodi() {
  if (document.getElementById("koodiSyote").value.trim() === "C0s7umAr7") {
    alennusAktiivinen = true;
    alert("30% alennus aktivoitu!");
  } else {
    alert("Väärä koodi");
  }
  paivitaOstoskori();
}

function yritaOstaa() {
  const o = document.getElementById("osoiteKentta").value.trim();
  const p = document.getElementById("postinumeroKentta").value.trim();
  if (o === "" || p === "") {
    document.getElementById("kassaViesti").innerText = "⚠️ Osoite tai postinumero puuttuu!";
  } else {
    document.getElementById("kassaViesti").innerText = "✅ Tilaus onnistui!";
  }
}
