const START_ENERGIA = 10;
const MAKS_ENERGIA = 100;

// Kolekcja pokojów
const pokoje = [
  { id: 1, nazwa: "Recepcja", opis: "Na biurku leży plastikowa karta dostępu. Stoi tu również stary automat do gier z napisem: 'Zagraj za 1 Energię!'." },
  { id: 2, nazwa: "Magazyn", opis: "Na półce leży zapasowy bezpiecznik." },
  { id: 3, nazwa: "Serwerownia", opis: "Pomieszczenie z głównymi szafami serwerowymi." },
  { id: 4, nazwa: "Wyjscie", opis: "Drzwi prowadzące na wolność." }
];

// Fabryka stanu początkowego (zwraca niezależny obiekt)
function stanPoczatkowy() {
  return {
    pokoj: 1,
    energia: START_ENERGIA,
    karta: false,
    bezpiecznik: false,
    zasilanie: false,
    koniec: false,
    wygrana: false,
    kodSecretu: false
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

      case "automat":
        if (nowyStan.pokoj !== 1) {
          return { stan: stanPrzed, komunikat: "Nie widzisz tu żadnego automatu." };
        }
        udane = false; // Wejście w automat NIE kosztuje energii
        komunikat = "Podchodzisz do gamby. Możesz wpisać gra.akcja(\"zagraj\"), aby spróbować szczęścia lub porażki za 1 Energię.";
        break;

      case "zagraj":
        if (nowyStan.pokoj !== 1) {
          return { stan: stanPrzed, komunikat: "Nie ma tu automatu do gry." };
        }
        // Sprawdzamy czy gracz ma chociaż 1 energii na zagranie (plus 1 zapasu, bo ruch zabiera energię poniżej)
        // Lub po prostu sprawdzamy czy energia > 0 przed odliczeniem:
        if (nowyStan.energia <= 0) {
          return { stan: stanPrzed, komunikat: "Nie masz już energii na grę!" };
        }

        udane = true; // Ta akcja kosztuje energię!
        
        // Losujemy nagrodę (np. szansa na odzyskanie energii lub zdobycie czegoś)
        const los = Math.floor(Math.random() * 100) + 1;
        if (los < 25) {
          // 0% - 25%: -1 energia (strata dodatkowa, czyli w sumie -2 z ruchem, ale oddajemy w opisie)
          nowyStan.energia = nowyStan.energia - 1;
          komunikat = "Ojojoj komus tu nie idzie zaraz lose. -1 energia";
          console.log(los);
        } 
        else if (los < 50) {
          // 25% - 50% (25% szans): +1 energia
          nowyStan.energia = nowyStan.energia + 1;
          komunikat = "Tym razem za zero. +1 energia";
          console.log(los);
        } 
        else if (los < 75) {
          // 50% - 75% (25% szans): +2 energie
          nowyStan.energia = nowyStan.energia + 2;
          komunikat = "Szczęśliwy traf! Jednak automat oddaje! +2 energie";
          console.log(los);
        } 
        else if (los < 86) {
          // 90% - 93% (3% szans): +10 energii (pełne odnowienie do maksa)
          nowyStan.energia = nowyStan.energia - 5;
          komunikat = "ALE PECHHH co za nie fart. -5 energii";
          console.log(los);
        }
        else if (los < 90) {
          // 75% - 90% (15% szans): Kod do secretu (5258)
          nowyStan.kodSecretu = true;
          komunikat = "??? 5258!";
          console.log(los);
        } 
        else if (los < 93) {
          // 90% - 93% (3% szans): +10 energii (pełne odnowienie do maksa)
          nowyStan.energia = nowyStan.energia + 10;
          komunikat = "JACKPOT! MEGA BIG WIN! +10 energii chyba wygraleś chyba ze grasz dalej hehe";
          console.log(los);
        } 
        else if(los < 99) {
          nowyStan.koniec = true;
          komunikat = "Wypierdalaj";
          console.log(los);
        }
        else {
          // 1% szans: Bóg hazardu - natychmiastowa wygrana!
          nowyStan.wygrana = true;
          nowyStan.koniec = true;
          komunikat = "Przepustka do pokoju wygranego. WYGRALES!!!";
          console.log(los);
        }
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
  if (typeof kandydat.kodSecretu !== "boolean") return false;
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