const START_ENERGIA = 10;
const MAKS_ENERGIA = 100;
const AKTUALNA_WERSJA = 1;

// Kolekcja pomieszczeń (1-4 główny korytarz, 5 sekretne laboratorium)
const pokoje = [
  { id: 1, nazwa: "Recepcja", opis: "Na biurku leży plastikowa karta dostępu. Stoi tu również stary automat do gier z napisem: 'Zagraj za 1 Energię!'." },
  { id: 2, nazwa: "Magazyn", opis: "Na półce leży zapasowy bezpiecznik." },
  { id: 3, nazwa: "Serwerownia", opis: "Pomieszczenie z głównymi szafami serwerowymi. W ścianie zauważasz ukryte, zamknięte drzwi na [sekret]." },
  { id: 4, nazwa: "Wyjście", opis: "Drzwi prowadzące na wolność." },
  { id: 5, nazwa: "Tajne Laboratorium", opis: "Wokół unosi się zapach ozonu. Na ścianie miga stary terminal badawczy." }
];

function nazwaPokoju(numer) {
  const p = pokoje.find(x => x.id === numer);
  return p ? p.nazwa : "Nieznane pomieszczenie";
}

// Fabryka stanu początkowego
function stanPoczatkowy() {
  return {
    pokoj: 1,
    energia: START_ENERGIA,
    maksEnergia: MAKS_ENERGIA,
    karta: false,
    bezpiecznik: false,
    zasilanie: false,
    koniec: false,
    wygrana: false,
    kod_secret: false,
    rzadki_item: false
  };
}

// Walidator stanu
function czyStan(kandydat) {
  if (kandydat === null || typeof kandydat !== "object" || Array.isArray(kandydat)) {
    return false;
  }
  if (!Number.isInteger(kandydat.pokoj) || kandydat.pokoj < 1 || kandydat.pokoj > 5) return false;
  if (!Number.isInteger(kandydat.maksEnergia) || kandydat.maksEnergia < 10 || kandydat.maksEnergia > 105) return false;
  if (!Number.isInteger(kandydat.energia) || kandydat.energia < 0 || kandydat.energia > kandydat.maksEnergia) return false;
  if (typeof kandydat.karta !== "boolean") return false;
  if (typeof kandydat.bezpiecznik !== "boolean") return false;
  if (typeof kandydat.zasilanie !== "boolean") return false;
  if (typeof kandydat.koniec !== "boolean") return false;
  if (typeof kandydat.wygrana !== "boolean") return false;
  if (typeof kandydat.kod_secret !== "boolean") return false;
  if (typeof kandydat.rzadki_item !== "boolean") return false;
  return true;
}

// Czysta funkcja przejścia (reguły gry)
function przejscie(stanPrzed, komenda) {
  if (stanPrzed.koniec) {
    return { stan: stanPrzed, komunikat: "Gra dobiegła końca. Wpisz gra.start(), aby zacząć od nowa." };
  }

  let nowyStan = { ...stanPrzed };
  let udane = false;
  let komunikat = "";

  // Obsługa ruchu po korytarzu
  if (komenda === "lewo" || komenda === "prawo") {
    if (nowyStan.pokoj === 5) {
      return { stan: stanPrzed, komunikat: "Jesteś w sekretnym pokoju. Użyj komendy 'wroc', aby wrócić do Serwerowni." };
    }

    let nastepnyPokoj = nowyStan.pokoj + (komenda === "prawo" ? 1 : -1);
    if (nastepnyPokoj < 1 || nastepnyPokoj > 4) {
      return { stan: stanPrzed, komunikat: "Ściana! Nie możesz tam pójść." };
    }
    nowyStan.pokoj = nastepnyPokoj;
    udane = true;
    const p = pokoje.find(x => x.id === nastepnyPokoj);
    komunikat = "Idziesz do: " + p.nazwa + ". " + p.opis;
  } 
  else {
    switch (komenda) {
      case "karta":
        if (nowyStan.pokoj !== 1 || nowyStan.karta) {
          return { stan: stanPrzed, komunikat: "Nie ma tu karty lub już ją masz." };
        }
        nowyStan.karta = true;
        udane = true;
        komunikat = "Zabierasz kartę dostępu.";
        break;

      case "bezpiecznik":
        if (nowyStan.pokoj !== 2 || nowyStan.bezpiecznik || nowyStan.zasilanie) {
          return { stan: stanPrzed, komunikat: "Nie możesz podnieść bezpiecznika w tym miejscu." };
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

      case "automat":
        if (nowyStan.pokoj !== 1) {
          return { stan: stanPrzed, komunikat: "Nie widzisz tu żadnego automatu." };
        }
        udane = false;
        komunikat = "Podchodzisz do automatu. Wpisz gra.akcja(\"zagraj\"), aby spróbować szczęścia za 1 Energię.";
        break;

      case "zagraj":
        if (nowyStan.pokoj !== 1) {
          return { stan: stanPrzed, komunikat: "Nie ma tu automatu do gry." };
        }
        if (nowyStan.energia <= 0) {
          return { stan: stanPrzed, komunikat: "Nie masz już energii na grę!" };
        }
        udane = true;
        
        const los = Math.floor(Math.random() * 100) + 1;
        if (los < 25) {
          nowyStan.energia = Math.max(0, nowyStan.energia - 1);
          komunikat = "Ojojoj komuś tu nie idzie... -1 energia";
        } 
        else if (los < 50) {
          nowyStan.energia = Math.min(nowyStan.maksEnergia, nowyStan.energia + 1);
          komunikat = "Tym razem na czysto. +1 energia";
        } 
        else if (los < 75) {
          nowyStan.energia = Math.min(nowyStan.maksEnergia, nowyStan.energia + 2);
          komunikat = "Szczęśliwy traf! Automat oddaje! +2 energie";
        } 
        else if (los < 86) {
          nowyStan.energia = Math.max(0, nowyStan.energia - 5);
          komunikat = "ALE PECHHH! Co za niefart. -5 energii";
        }
        else if (los < 90) {
          nowyStan.kod_secret = true;
          komunikat = "??? Otrzymujesz kod do sekretu (5258)!";
        } 
        else if (los < 93) {
          nowyStan.energia = Math.min(nowyStan.maksEnergia, nowyStan.energia + 10);
          komunikat = "JACKPOT! MEGA BIG WIN! +10 energii!";
        } 
        else if (los < 99) {
          nowyStan.koniec = true;
          komunikat = "Automat uległ spięciu i cię poraził. Koniec gry!";
        }
        else {
          nowyStan.wygrana = true;
          nowyStan.koniec = true;
          komunikat = "Bóg hazardu! Trafiasz główną wygraną. WYGRANA!";
        }
        break;

      case "wyjdz":
        if (nowyStan.pokoj !== 4 || !nowyStan.karta || !nowyStan.zasilanie) {
          return { stan: stanPrzed, komunikat: "Drzwi są zamknięte. Potrzebujesz karty i aktywnego zasilania." };
        }
        nowyStan.wygrana = true;
        nowyStan.koniec = true;
        udane = true;
        komunikat = "Otwierasz drzwi wyjściowe! Wygrana!";
        break;

      case "sekret":
        if (nowyStan.pokoj !== 3) {
          return { stan: stanPrzed, komunikat: "Nie widzisz tu tajnego przejścia." };
        }
        if (!nowyStan.kod_secret) {
          return { stan: stanPrzed, komunikat: "Drzwi są zablokowane. Potrzebujesz kodu (zdobędziesz go z automatu)!" };
        }
        nowyStan.pokoj = 5;
        udane = true;
        komunikat = "Wpisujesz kod i wchodzisz do Tajnego Laboratorium.";
        break;

      case "terminal":
        if (nowyStan.pokoj !== 5) {
          return { stan: stanPrzed, komunikat: "Nie ma tu terminala." };
        }
        return { stan: nowyStan, komunikat: "Terminal wyświetla: Artefaktem tego miejsca jest legendarny MEDUSKA KONGO." };

      case "wroc":
        if (nowyStan.pokoj !== 5) {
          return { stan: stanPrzed, komunikat: "Nie jesteś w sekretnym pokoju." };
        }
        nowyStan.pokoj = 3;
        udane = true;
        komunikat = "Wracasz do Serwerowni.";
        break;

      case "pobierz":
        if (nowyStan.pokoj !== 5 || nowyStan.rzadki_item) {
          return { stan: stanPrzed, komunikat: "Nie ma tu nic do podniesienia." };
        }
        nowyStan.rzadki_item = true;
        nowyStan.maksEnergia += 5;
        nowyStan.energia = Math.min(nowyStan.maksEnergia, nowyStan.energia + 5);
        udane = true;
        komunikat = "Podnosisz legendarny MEDUSKA KONGO! Twój maksymalny limit energii wzrósł do " + nowyStan.maksEnergia + ", a ty odzyskujesz +5 energii.";
        break;

      default:
        return { stan: stanPrzed, komunikat: "Nieznana komenda. Wpisz gra.pomoc()." };
    }
  }

  // Rozliczenie kosztu energii za akcję/ruch
  if (udane) {
    if (!nowyStan.wygrana) {
      nowyStan.energia = nowyStan.energia - 1;
      if (nowyStan.energia <= 0) {
        nowyStan.koniec = true;
        komunikat += "\nPRZEGRANA. Zabrakło energii!";
      } else {
        komunikat += "\nPozostała energia: " + nowyStan.energia;
      }
    }
  }

  return { stan: nowyStan, komunikat };
}

// Eksport do JSON
function eksportuj(stan) {
  let pakiet = { wersja: AKTUALNA_WERSJA, stan: stan };
  return JSON.stringify(pakiet);
}

// Import z JSON
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