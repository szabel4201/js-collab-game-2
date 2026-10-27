const MAKS_ENERGIA = 10;

// Kolekcja pokojów
const pokoje = [
  { id: 1, nazwa: "Recepcja", opis: "Na biurku leży plastikowa karta dostępu." },
  { id: 2, nazwa: "Magazyn", opis: "Na półce leży zapasowy bezpiecznik." },
  { id: 3, nazwa: "Serwerownia", opis: "Pomieszczenie z głównymi szafami serwerowymi." },
  { id: 4, nazwa: "Wyjscie", opis: "Drzwi prowadzące na wolność." }
];

// Fabryka stanu początkowego (zwraca niezależny obiekt)
function stanPoczatkowy() {
  return {
    pokoj: 1,
    energia: MAKS_ENERGIA,
    karta: false,
    bezpiecznik: false,
    zasilanie: false,
    koniec: false,
    wygrana: false
  };
}

function pobierzPokoj(id) {
  return pokoje.find(p => p.id === id);
}

// Czysta funkcja przejścia (reguły gry)
function przejscie(stanPrzed, komenda) {
  if (stanPrzed.koniec) {
    return { stan: stanPrzed, komunikat: "Gra dobiegła końca. Wpisz gra.start(), aby zacząć od nowa." };
  }

  let nowyStan = { ...stanPrzed };
  let udane = false;
  let komunikat = "";

  // Obsługa ruchu
  if (komenda === "lewo" || komenda === "prawo") {
    let nastepnyPokoj = nowyStan.pokoj + (komenda === "prawo" ? 1 : -1);
    if (nastepnyPokoj < 1 || nastepnyPokoj > 4) {
      return { stan: stanPrzed, komunikat: "Nie możesz iść w tę stronę — napotykasz ścianę." };
    }
    nowyStan.pokoj = nastepnyPokoj;
    udane = true;
    const p = pobierzPokoj(nastepnyPokoj);
    komunikat = "Idziesz do: " + p.nazwa + ". " + p.opis;
  } 
  // Obsługa akcji
  else {
    switch (komenda) {
      case "karta":
        if (nowyStan.pokoj !== 1 || nowyStan.karta) {
          return { stan: stanPrzed, komunikat: "Tutaj nie ma karty lub już ją masz." };
        }
        nowyStan.karta = true;
        udane = true;
        komunikat = "Zabierasz kartę dostępu.";
        break;

      case "bezpiecznik":
        if (nowyStan.pokoj !== 2 || nowyStan.bezpiecznik || nowyStan.zasilanie) {
          return { stan: stanPrzed, komunikat: "Nie możesz podnieść bezpiecznika." };
        }
        nowyStan.bezpiecznik = true;
        udane = true;
        komunikat = "Zabierasz zapasowy bezpiecznik.";
        break;

      case "napraw":
        if (nowyStan.pokoj !== 3 || !nowyStan.bezpiecznik || nowyStan.zasilanie) {
          return { stan: stanPrzed, komunikat: "Nie możesz tutaj naprawić zasilania." };
        }
        nowyStan.bezpiecznik = false;
        nowyStan.zasilanie = true;
        udane = true;
        komunikat = "Montujesz bezpiecznik i przywracasz zasilanie w serwerowni!";
        break;

      case "wyjdz":
        if (nowyStan.pokoj !== 4 || !nowyStan.karta || !nowyStan.zasilanie) {
          return { stan: stanPrzed, komunikat: "Nie możesz otworzyć drzwi (wymaga karty i zasilania)." };
        }
        nowyStan.wygrana = true;
        nowyStan.koniec = true;
        udane = true;
        komunikat = "Otwierasz drzwi wyjściowe! Wygrana!";
        break;

      default:
        return { stan: stanPrzed, komunikat: "Nieznana komenda. Wpisz gra.pomoc()." };
    }
  }

  // Rozliczenie energii po udanym działaniu
  if (udane) {
    nowyStan.energia = nowyStan.energia - 1;
    if (nowyStan.wygrana) {
      // Wygrana ma priorytet
    } else if (nowyStan.energia <= 0) {
      nowyStan.koniec = true;
      komunikat += "\nPRZEGRANA. Zasilanie awaryjne padło.";
    } else {
      komunikat += "\nPozostała energia: " + nowyStan.energia;
    }
  }

  return { stan: nowyStan, komunikat };
}

// Walidator stanu
function czyStan(kandydat) {
  if (kandydat === null || typeof kandydat !== "object" || Array.isArray(kandydat)) {
    return false;
  }
  if (!Number.isInteger(kandydat.pokoj) || kandydat.pokoj < 1 || kandydat.pokoj > 4) return false;
  if (!Number.isInteger(kandydat.energia) || kandydat.energia < 0 || kandydat.energia > MAKS_ENERGIA) return false;
  if (typeof kandydat.karta !== "boolean") return false;
  if (typeof kandydat.bezpiecznik !== "boolean") return false;
  if (typeof kandydat.zasilanie !== "boolean") return false;
  if (typeof kandydat.koniec !== "boolean") return false;
  if (typeof kandydat.wygrana !== "boolean") return false;
  return true;
}

// Eksport do JSON
function eksportujStan(stanAktualny) {
  const pakiet = { wersja: 1, stan: stanAktualny };
  return JSON.stringify(pakiet);
}

// Import z JSON
function importujStan(tekst) {
  if (typeof tekst !== "string" || tekst.trim() === "") {
    throw new Error("Podany tekst jest pusty lub nie jest ciągiem znaków.");
  }
  const pakiet = JSON.parse(tekst);
  if (!pakiet || pakiet.wersja !== 1 || !czyStan(pakiet.stan)) {
    throw new Error("Niepoprawna struktura pakietu, wersja lub błąd walidacji stanu.");
  }
  return pakiet.stan;
}