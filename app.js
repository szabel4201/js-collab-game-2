let stan = stanPoczatkowy();

function pomoc() {
  console.log("=== POMOC ===");
  console.log("gra.start()");
  console.log("gra.status()");
  console.log("gra.mapa()");
  console.log("gra.rozejrzyj()");
  console.log("gra.idz('lewo') / gra.idz('prawo')");
  console.log("gra.akcja('karta')");
  console.log("gra.akcja('bezpiecznik')");
  console.log("gra.akcja('napraw')");
  console.log("gra.akcja('wyjdz')");
  console.log("gra.eksportuj()");
  console.log("gra.importuj(tekst)");
}

function status() {
  console.log("--- STATUS ---");
  console.log("Pokój: " + stan.pokoj + " (" + nazwaPokoju(stan.pokoj) + ")");
  console.log("Energia: " + stan.energia);
  console.log("Karta: " + stan.karta);
  console.log("Bezpiecznik: " + stan.bezpiecznik);
  console.log("Zasilanie: " + stan.zasilanie);
}

function mapa() {
  let i = 1;
  while (i <= 4) {
    if (i === stan.pokoj) {
      console.log(i + " [tu jesteś]");
    } else {
      console.log(i);
    }
    i++;
  }
}

function rozejrzyj() {
  if (stan.pokoj === 1) {
    console.log("Jesteś w Recepcji.");
    if (stan.karta === false) {
      console.log("Na biurku leży karta.");
    } else {
      console.log("Biurko jest puste.");
    }
  } else if (stan.pokoj === 2) {
    console.log("Jesteś w Magazynie.");
    if (stan.bezpiecznik === false && stan.zasilanie === false) {
      console.log("Na półce leży bezpiecznik.");
    } else {
      console.log("Półka jest pusta.");
    }
  } else if (stan.pokoj === 3) {
    console.log("Jesteś w Serwerowni. Zasilanie włączone: " + stan.zasilanie);
  } else if (stan.pokoj === 4) {
    console.log("Stoisz przy Wyjściu.");
  }
}

window.gra = {
  start: function() {
    stan = stanPoczatkowy();
    console.log("Start gry! Zasilanie: 10 tur.");
    pomoc();
    rozejrzyj();
  },
  status: function() {
    status();
  },
  mapa: function() {
    mapa();
  },
  rozejrzyj: function() {
    rozejrzyj();
  },
  pomoc: function() {
    pomoc();
  },
  idz: function(kierunek) {
    let wynik = przejscie(stan, kierunek);
    stan = wynik.stan;
    console.log(wynik.komunikat);
    if (stan.koniec === false && stan.wygrana === false) {
      rozejrzyj();
    }
  },
  akcja: function(co) {
    let wynik = przejscie(stan, co);
    stan = wynik.stan;
    console.log(wynik.komunikat);
  },
  eksportuj: function() {
    return eksportuj(stan);
  },
  importuj: function(tekst) {
    let nowyStan = importuj(tekst);
    if (nowyStan !== false) {
      stan = nowyStan;
      console.log("Sukces! Wczytano stan gry.");
      status();
      return true;
    }
    return false;
  }
};

// Automatyczny start przy ładowaniu strony
window.gra.start();