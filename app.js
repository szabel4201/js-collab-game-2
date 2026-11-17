let stan = stanPoczatkowy();

function pomoc() {
  console.log("=== POMOC I INSTRUKCJA ===");
  console.log(" - gra.start() - restartuje grę.");
  console.log(" - gra.pomoc() - wyświetla instrukcję.");
  console.log(" - gra.status() - pokazuje aktualny stan gry.");
  console.log(" - gra.mapa() - pokazuje plan pomieszczeń.");
  console.log(" - gra.rozejrzyj() - rozgląda się po pokoju.");
  console.log(" - gra.idz('lewo') / gra.idz('prawo') - poruszanie się.");
  console.log(" - gra.akcja('karta') - podnosi kartę w recepcji.");
  console.log(" - gra.akcja('bezpiecznik') - podnosi bezpiecznik w magazynie.");
  console.log(" - gra.akcja('napraw') - montuje bezpiecznik w serwerowni.");
  console.log(" - gra.akcja('wyjdz') - ucieka przez wyjście.");
  console.log(" - gra.akcja('automat') / gra.akcja('zagraj') - interakcja z automatem.");
  console.log(" - gra.akcja('sekret') - wejście do Tajnego Laboratorium z Serwerowni.");
  console.log(" - gra.akcja('terminal') - odczytanie terminala w sekrecie.");
  console.log(" - gra.akcja('pobierz') - podniesienie MEDUSKA KONGO.");
  console.log(" - gra.akcja('wroc') - powrót do Serwerowni.");
  console.log(" - gra.eksportuj() - generuje kod JSON zapisu.");
  console.log(" - gra.importuj(tekst) - wczytuje zapis z JSON.");
}

function status() {
  console.log("--- STATUS GRY ---");
  console.log("Pokój: " + stan.pokoj + " (" + nazwaPokoju(stan.pokoj) + ")");
  
  // Obsługa energii z uwzględnieniem powiększonego limitu
  if (stan.maksEnergia !== undefined) {
    console.log("Energia: " + stan.energia + " / " + stan.maksEnergia);
  } else {
    console.log("Energia: " + stan.energia);
  }
  
  console.log("Karta: " + (stan.karta ? "tak" : "nie"));
  console.log("Bezpiecznik: " + (stan.bezpiecznik ? "tak" : "nie"));
  console.log("Zasilanie: " + (stan.zasilanie ? "aktywne" : "wyłączone"));
  console.log("Koniec: " + (stan.koniec ? "tak" : "nie") + " | Wygrana: " + (stan.wygrana ? "tak" : "nie"));
  
  if (stan.kod_secret !== undefined) {
    console.log("Kod Secretu: " + (stan.kod_secret ? "ZDOBYTY" : "brak"));
  }
  if (stan.rzadki_item !== undefined) {
    console.log("MEDUSKA KONGO: " + (stan.rzadki_item ? "POSIADANY" : "brak"));
  }
}

function mapa() {
  let i = 1;
  while (i <= 5) {
    if (i === stan.pokoj) {
      console.log(i + " " + nazwaPokoju(i) + " <-- jesteś tutaj");
    } else {
      console.log(i + " " + nazwaPokoju(i));
    }
    i++;
  }
}

function rozejrzyj() {
  if (stan.pokoj === 1) {
    console.log("Jesteś w Recepcji. Stoi tu [automat] z napojami.");
    if (stan.karta === false) {
      console.log("Na biurku leży karta dostępu.");
    } else {
      console.log("Biurko jest puste.");
    }
  } else if (stan.pokoj === 2) {
    console.log("Jesteś w Magazynie.");
    if (stan.bezpiecznik === false && stan.zasilanie === false) {
      console.log("Na półce leży zapasowy bezpiecznik.");
    } else {
      console.log("Półka jest pusta.");
    }
  } else if (stan.pokoj === 3) {
    console.log("Jesteś w Serwerowni. Zasilanie włączone: " + (stan.zasilanie ? "tak" : "nie"));
    console.log("W ścianie zauważasz ukryte, zamknięte drzwi na [sekret].");
  } else if (stan.pokoj === 4) {
    console.log("Stoisz przy Wyjściu z budynku.");
  } else if (stan.pokoj === 5) {
    console.log("Jesteś w Tajnym Laboratorium. Wokół unosi się zapach ozonu.");
    console.log("Na ścianie miga stary [terminal] badawczy.");
    if (stan.rzadki_item === false) {
      console.log("Na centralnym postumencie spoczywa legendarny, pulsujący [pobierz] MEDUSKA KONGO.");
    } else {
      console.log("Postument jest pusty.");
    }
    console.log("Możesz stąd [wroc] z powrotem do Serwerowni.");
  }
}

window.gra = {
  start: function() {
    stan = stanPoczatkowy();
    console.log("UCIECZKA Z SERWEROWNI 2: ZEMSTA KONSOLI");
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
    let kodJson = eksportuj(stan);
    console.log("--- ZAPIS GRY (JSON) ---");
    console.log(kodJson);
    return kodJson;
  },
  importuj: function(tekst) {
    let nowyStan = importuj(tekst);
    if (nowyStan !== false) {
      stan = nowyStan;
      console.log("Sukces! Wczytano stan gry.");
      status();
      rozejrzyj();
      return true;
    }
    return false;
  }
};

// Automatyczny start przy ładowaniu strony
window.gra.start();