const MAKS_ENERGIA = 10;
let pokoj = 1;
let energia = MAKS_ENERGIA;
let karta = false;
let bezpiecznik = false;
let zasilanie = false;
let koniec = false;
let wygrana = false;

function start() {
  pokoj = 1;
  energia = MAKS_ENERGIA;
  karta = false;
  bezpiecznik = false;
  zasilanie = false;
  koniec = false;
  wygrana = false;
  console.log("UCIECZKA Z SERWEROWNI. Zasilanie awaryjne wystarczy na 10 tur.");
  pomoc();
  rozejrzyj();
}

function zakonczTure() {
  energia = energia - 1;
  console.log("Pozostała energia: " + energia);
  if (wygrana) {
    console.log("WYGRANA! Drzwi otwarte. Możesz wrócić do domu.");
  } else if (energia === 0) {
    koniec = true;
    console.log("PRZEGRANA. Zasilanie awaryjne padło. Wpisz start().");
  }
}

function nazwaPokoju(numer) {
  switch(numer) {
    case 1:
      return "Recepcja";
    case 2:
      return "Magazyn";
    case 3:
      return "Serwerownia";
    case 4:
      return "Wyjście";
    default:
      return "Nieznane pomieszczenie";
  }
}

function pomoc() {
  console.log("=== POMOC I INSTRUKCJA ===");
  console.log("Dostępne komendy:");
  console.log(' - start() - restartuje grę i ustawia stan początkowy.');
  console.log(' - pomoc() - wyświetla te instrukcje.');
  console.log(' - status() - pokazuje aktualny stan gry, energię i przedmioty.');
  console.log(' - mapa() - pokazuje plan pomieszczeń i Twoją pozycję.');
  console.log(' - rozejrzyj() - rozgląda się po aktualnym pomieszczeniu.');
  console.log(' - idz("lewo") / idz("prawo") - poruszanie się między pokojami.');
  console.log(' - akcja("karta") - podnoszenie karty.');
  console.log(' - akcja("bezpiecznik") - podnoszenie bezpiecznika.');
  console.log(' - akcja("napraw") - montowanie bezpiecznika w serwerowni.');
  console.log(' - akcja("wyjdz") - próba ucieczki przy wyjściu.');
}

function status() {
  console.log("--- STATUS GRY ---");
  console.log("Aktualny pokój: " + pokoj + " (" + nazwaPokoju(pokoj) + ")");
  console.log("Energia: " + energia + " / " + MAKS_ENERGIA);
  console.log("Karta: " + (karta ? "tak" : "nie"));
  console.log("Bezpiecznik (w kieszeni): " + (bezpiecznik ? "tak" : "nie"));
  console.log("Zasilanie: " + (zasilanie ? "aktywne" : "wyłączone"));
  console.log("Stan gry - Koniec: " + (koniec ? "tak" : "nie") + " | Wygrana: " + (wygrana ? "tak" : "nie"));
}

function mapa() {
  for (let numer = 1; numer <= 4; numer++) {
    if (numer === pokoj) {
      console.log(numer + " " + nazwaPokoju(numer) + " <-- jesteś tutaj");
    } else {
      console.log(numer + " " + nazwaPokoju(numer));
    }
  }
}

function rozejrzyj() {
  switch (pokoj) {
    case 1:
      console.log("Jesteś w Recepcji.");
      if (!karta) {
        console.log("Na biurku leży plastikowa karta dostępu.");
      } else {
        console.log("Biurko jest puste.");
      }
      break;
    case 2:
      console.log("Jesteś w Magazynie.");
      if (!bezpiecznik && !zasilanie) {
        console.log("Na półce leży zapasowy bezpiecznik.");
      } else {
        console.log("Półka jest pusta.");
      }
      break;
    case 3:
      console.log("Jesteś w Serwerowni.");
      console.log("Stan zasilania: " + (zasilanie ? "Włączone (stabilne)" : "Wyłączone (ciemno i cicho)"));
      break;
    case 4:
      console.log("Stoisz przy Wyjściu.");
      console.log("Wymagania do ucieczki: Potrzebujesz aktywnego zasilania oraz posiadania karty dostępu.");
      break;
    default:
      console.log("Jesteś w nieznanej przestrzeni.");
      break;
  }
}

function idz(kierunek) {
  if (koniec) {
    console.log("Gra już się skończyła. Wpisz start(), aby zagrać ponownie.");
    return;
  }

  let nastepnyPokoj = pokoj;
  if (kierunek === "prawo") {
    nastepnyPokoj = pokoj + 1;
  } else if (kierunek === "lewo") {
    nastepnyPokoj = pokoj - 1;
  } else {
    console.log("Nieznany kierunek. Użyj idz(\"lewo\") lub idz(\"prawo\").");
    return;
  }

  if (nastepnyPokoj < 1 || nastepnyPokoj > 4) {
    console.log("Nie możesz iść w tę stronę — napotykasz ścianę.");
    return;
  }

  pokoj = nastepnyPokoj;
  rozejrzyj();
  zakonczTure();
}

function akcja(co) {
  if (koniec) {
    console.log("Gra już się skończyła. Wpisz start(), aby zagrać ponownie.");
    return;
  }

  switch (co) {
    case "karta":
      if (pokoj !== 1 || karta) {
        console.log("Tutaj nie ma karty do zabrania.");
        return;
      }
      karta = true;
      console.log("Zabierasz kartę dostępu.");
      break;

    case "bezpiecznik":
      if (pokoj !== 2 || bezpiecznik || zasilanie) {
        console.log("Tutaj nie ma bezpiecznika do zabrania.");
        return;
      }
      bezpiecznik = true;
      console.log("Zabierasz bezpiecznik z półki.");
      break;

    case "napraw":
      if (pokoj !== 3 || !bezpiecznik || zasilanie) {
        console.log("Nie możesz tutaj tego zrobić.");
        return;
      }
      bezpiecznik = false;
      zasilanie = true;
      console.log("Montujesz bezpiecznik i przywracasz zasilanie w serwerowni!");
      break;

    case "wyjdz":
      if (pokoj !== 4 || !karta || !zasilanie) {
        console.log("Drzwi są zablokowane. Potrzebujesz karty i działającego zasilania.");
        return;
      }
      wygrana = true;
      koniec = true;
      console.log("Otwierasz drzwi wyjściowe!");
      break;

    default:
      console.log("Nieznana akcja. Wpisz pomoc(), aby zobaczyć dostępne polecenia.");
      return;
  }

  zakonczTure();
}

start();