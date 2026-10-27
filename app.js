let stan = stanPoczatkowy();

function start() {
  stan = stanPoczatkowy();
  console.log("UCIECZKA Z SERWEROWNI 2: ZEMSTA KONSOLI");
  pomoc();
  rozejrzyj();
}

function pomoc() {
  console.log("=== POMOC I INSTRUKCJA ===");
  console.log(' - gra.start() - restartuje grę.');
  console.log(' - gra.pomoc() - wyświetla instrukcję.');
  console.log(' - gra.status() - pokazuje aktualny stan gry.');
  console.log(' - gra.mapa() - pokazuje plan pomieszczeń.');
  console.log(' - gra.rozejrzyj() - rozgląda się po pokoju.');
  console.log(' - gra.idz("lewo") / gra.idz("prawo") - poruszanie się.');
  console.log(' - gra.akcja("karta") / gra.akcja("bezpiecznik") / gra.akcja("napraw") / gra.akcja("wyjdz")');
  console.log(' - gra.eksportuj() - generuje kod JSON zapisu.');
  console.log(' - gra.importuj(tekst) - wczytuje zapis z JSON.');
}

function status() {
  const p = pokoje.find(x => x.id === stan.pokoj);
  console.log("--- STATUS GRY ---");
  console.log("Pokój: " + stan.pokoj + " (" + p.nazwa + ")");
  console.log("Energia: " + stan.energia + " / " + MAKS_ENERGIA);
  console.log("Karta: " + (stan.karta ? "tak" : "nie"));
  console.log("Bezpiecznik: " + (stan.bezpiecznik ? "tak" : "nie"));
  console.log("Zasilanie: " + (stan.zasilanie ? "aktywne" : "wyłączone"));
  console.log("Koniec: " + (stan.koniec ? "tak" : "nie") + " | Wygrana: " + (stan.wygrana ? "tak" : "nie"));
}

function mapa() {
  pokoje.forEach(p => {
    if (p.id === stan.pokoj) {
      console.log(p.id + " " + p.nazwa + " <-- jesteś tutaj");
    } else {
      console.log(p.id + " " + p.nazwa);
    }
  });
}

function rozejrzyj() {
  const p = pokoje.find(x => x.id === stan.pokoj);
  console.log("Jesteś w: " + p.nazwa + ". " + p.opis);
  if (stan.pokoj === 1 && stan.karta) console.log("Biurko jest puste.");
  if (stan.pokoj === 2 && (stan.bezpiecznik || stan.zasilanie)) console.log("Półka jest pusta.");
  if (stan.pokoj === 3) console.log("Zasilanie: " + (stan.zasilanie ? "Włączone" : "Wyłączone"));
}

function idz(kierunek) {
  const wynik = przejscie(stan, kierunek);
  console.log(wynik.komunikat);
  stan = wynik.stan;
  if (!stan.koniec && wynik.komunikat.includes("Idziesz do")) {
    rozejrzyj();
  }
}

function akcja(co) {
  const wynik = przejscie(stan, co);
  console.log(wynik.komunikat);
  stan = wynik.stan;
}

function eksportuj() {
  const json = eksportujStan(stan);
  console.log("--- ZAPIS GRY (JSON) ---");
  console.log(json);
  return json;
}

function importuj(tekst) {
  try {
    const wczytanyStan = importujStan(tekst);
    stan = wczytanyStan;
    console.log("Gra została pomyślnie wczytana!");
    status();
    rozejrzyj();
    return true;
  } catch (blad) {
    console.log("ODMOWA: Nie wczytano gry. Szczegóły: " + blad.message);
    return false;
  }
}

// Globalne API gry
window.gra = {
  start,
  pomoc,
  status,
  mapa,
  rozejrzyj,
  idz,
  akcja,
  eksportuj,
  importuj
};

console.log("Skrypty załadowane pomyślnie. Wpisz w konsoli: gra.start()");