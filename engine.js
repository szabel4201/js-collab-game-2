const MAKS_ENERGIA = 10;
const AKTUALNA_WERSJA = 1;

const POKOJE = [
  { id: 1, nazwa: "Recepcja" },
  { id: 2, nazwa: "Magazyn" },
  { id: 3, nazwa: "Serwerownia" },
  { id: 4, nazwa: "Wyjście" }
];

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

function czyStan(wartosc) {
  if (wartosc === null || typeof wartosc !== "object" || Array.isArray(wartosc)) {
    return false;
  }
  if (!Number.isInteger(wartosc.pokoj) || wartosc.pokoj < 1 || wartosc.pokoj > 4) {
    return false;
  }
  if (!Number.isInteger(wartosc.energia) || wartosc.energia < 0 || wartosc.energia > MAKS_ENERGIA) {
    return false;
  }
  if (typeof wartosc.karta !== "boolean" ||
      typeof wartosc.bezpiecznik !== "boolean" ||
      typeof wartosc.zasilanie !== "boolean" ||
      typeof wartosc.koniec !== "boolean" ||
      typeof wartosc.wygrana !== "boolean") {
    return false;
  }
  return true;
}

function nazwaPokoju(numer) {
  let i = 0;
  while (i < POKOJE.length) {
    if (POKOJE[i].id === numer) {
      return POKOJE[i].nazwa;
    }
    i++;
  }
  return "Nieznane pomieszczenie";
}

function przejscie(stanPrzed, komenda) {
  let s = {
    pokoj: stanPrzed.pokoj,
    energia: stanPrzed.energia,
    karta: stanPrzed.karta,
    bezpiecznik: stanPrzed.bezpiecznik,
    zasilanie: stanPrzed.zasilanie,
    koniec: stanPrzed.koniec,
    wygrana: stanPrzed.wygrana
  };

  if (s.koniec === true) {
    return { stan: stanPrzed, komunikat: "Gra dobiegła końca." };
  }

  if (komenda === "lewo" || komenda === "prawo") {
    let nowyPokoj = s.pokoj;
    if (komenda === "prawo") {
      nowyPokoj = s.pokoj + 1;
    } else {
      nowyPokoj = s.pokoj - 1;
    }

    if (nowyPokoj < 1 || nowyPokoj > 4) {
      return { stan: stanPrzed, komunikat: "Ściana! Nie możesz tam pójść." };
    }

    s.pokoj = nowyPokoj;
    s.energia = s.energia - 1;

    if (s.energia === 0) {
      s.koniec = true;
      return { stan: s, komunikat: "Przechodzisz do: " + nazwaPokoju(s.pokoj) + ". Zabrakło energii - PRZEGRANA!" };
    }

    return { stan: s, komunikat: "Przechodzisz do: " + nazwaPokoju(s.pokoj) + ". Pozostała energia: " + s.energia };
  }

  if (komenda === "karta") {
    if (s.pokoj !== 1 || s.karta === true) {
      return { stan: stanPrzed, komunikat: "Nie ma tu karty lub już ją masz." };
    }
    s.karta = true;
    s.energia = s.energia - 1;
    let komunikat = "Podnosisz kartę dostępu.";
    if (s.energia === 0) {
      s.koniec = true;
      komunikat = komunikat + " Zabrakło energii - PRZEGRANA!";
    }
    return { stan: s, komunikat: komunikat };
  }

  if (komenda === "bezpiecznik") {
    if (s.pokoj !== 2 || s.bezpiecznik === true || s.zasilanie === true) {
      return { stan: stanPrzed, komunikat: "Nie możesz podnieść bezpiecznika w tym miejscu." };
    }
    s.bezpiecznik = true;
    s.energia = s.energia - 1;
    let komunikat = "Podnosisz zapasowy bezpiecznik.";
    if (s.energia === 0) {
      s.koniec = true;
      komunikat = komunikat + " Zabrakło energii - PRZEGRANA!";
    }
    return { stan: s, komunikat: komunikat };
  }

  if (komenda === "napraw") {
    if (s.pokoj !== 3 || s.bezpiecznik === false || s.zasilanie === true) {
      return { stan: stanPrzed, komunikat: "Nie możesz tutaj naprawić zasilania." };
    }
    s.bezpiecznik = false;
    s.zasilanie = true;
    s.energia = s.energia - 1;
    let komunikat = "Montujesz bezpiecznik i przywracasz zasilanie!";
    if (s.energia === 0) {
      s.koniec = true;
      komunikat = komunikat + " Zabrakło energii - PRZEGRANA!";
    }
    return { stan: s, komunikat: komunikat };
  }

  if (komenda === "wyjdz") {
    if (s.pokoj !== 4 || s.karta === false || s.zasilanie === false) {
      return { stan: stanPrzed, komunikat: "Drzwi są zamknięte. Potrzebujesz karty i aktywnego zasilania." };
    }
    s.wygrana = true;
    s.koniec = true;
    return { stan: s, komunikat: "WYGRANA! Otwierasz drzwi i uciekasz z serwerowni!" };
  }

  return { stan: stanPrzed, komunikat: "Nieznana komenda." };
}

function eksportuj(stan) {
  let pakiet = { wersja: AKTUALNA_WERSJA, stan: stan };
  return JSON.stringify(pakiet);
}

function importuj(tekst) {
  if (typeof tekst !== "string" || tekst === "") {
    console.log("Odmowa: niepoprawny format lub pusty tekst.");
    return false;
  }
  try {
    let kandydat = JSON.parse(tekst);
    if (kandydat === null || typeof kandydat !== "object" || Array.isArray(kandydat)) {
      console.log("Odmowa: błędna struktura pakietu.");
      return false;
    }
    if (kandydat.wersja !== AKTUALNA_WERSJA) {
      console.log("Odmowa: nieobsługiwana wersja zapisu.");
      return false;
    }
    if (!czyStan(kandydat.stan)) {
      console.log("Odmowa: stan nie przeszedł walidacji.");
      return false;
    }
    return kandydat.stan;
  } catch (e) {
    console.log("Odmowa: błąd parsowania JSON.");
    return false;
  }
}