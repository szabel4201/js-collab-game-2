const MAKS_ENERGIA = 10;

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

function start(stan) {
  stan.pokoj = 1;
  stan.energia = MAKS_ENERGIA;
  stan.karta = false;
  stan.bezpiecznik = false;
  stan.zasilanie = false;
  stan.koniec = false;
  stan.wygrana = false;
  console.log("Start gry! Wpisz gra.pomoc()");
  rozejrzyj(stan);
  return stan;
}

function zakonczTure(stan) {
  stan.energia = stan.energia - 1;
  console.log("Pozostała energia: " + stan.energia);
  if (stan.wygrana) {
    console.log("WYGRANA!");
  } else if (stan.energia === 0) {
    stan.koniec = true;
    console.log("PRZEGRANA! Wpisz gra.start()");
  }
}

function pomoc() {
  console.log("Dostępne komendy: gra.start(), gra.status(), gra.mapa(), gra.rozejrzyj(), gra.idz('lewo'), gra.idz('prawo'), gra.akcja('karta'), gra.akcja('bezpiecznik'), gra.akcja('napraw'), gra.akcja('wyjdz')");
}

function status(stan) {
  console.log("Pokój: " + stan.pokoj);
  console.log("Energia: " + stan.energia);
  console.log("Karta: " + stan.kartera ? "tak" : "nie");
  console.log("Bezpiecznik: " + stan.bezpiecznik);
  console.log("Zasilanie: " + stan.zasilanie);
}

function mapa(stan) {
  for (let i = 1; i <= 4; i++) {
    if (i === stan.pokoj) {
      console.log(i + " [tu jesteś]");
    } else {
      console.log(i);
    }
  }
}

function rozejrzyj(stan) {
  if (stan.pokoj === 1) {
    console.log("Jesteś w Recepcji. Leży tu karta.");
  } else if (stan.pokoj === 2) {
    console.log("Jesteś w Magazynie. Leży tu bezpiecznik.");
  } else if (stan.pokoj === 3) {
    console.log("Jesteś w Serwerowni.");
  } else if (stan.pokoj === 4) {
    console.log("Jesteś przy Wyjściu.");
  }
}

function idz(stan, kierunek) {
  if (stan.koniec) {
    console.log("Gra się skończyła.");
    return;
  }

  let nowyPokoj = stan.pokoj;
  if (kierunek === "prawo") {
    nowyPokoj = stan.pokoj + 1;
  } else if (kierunek === "lewo") {
    nowyPokoj = stan.pokoj - 1;
  } else {
    console.log("Użyj 'lewo' lub 'prawo'.");
    return;
  }

  if (nowyPokoj < 1 || nowyPokoj > 4) {
    console.log("Ściana!");
    return;
  }

  stan.pokoj = nowyPokoj;
  rozejrzyj(stan);
  zakonczTure(stan);
}

function akcja(stan, co) {
  if (stan.koniec) {
    console.log("Gra się skończyła.");
    return;
  }

  if (co === "karta") {
    if (stan.pokoj !== 1 || stan.karta) {
      console.log("Nie można tego zrobić.");
      return;
    }
    stan.karta = true;
    console.log("Podniesiono kartę.");
  } else if (co === "bezpiecznik") {
    if (stan.pokoj !== 2 || stan.bezpiecznik || stan.zasilanie) {
      console.log("Nie można tego zrobić.");
      return;
    }
    stan.bezpiecznik = true;
    console.log("Podniesiono bezpiecznik.");
  } else if (co === "napraw") {
    if (stan.pokoj !== 3 || !stan.bezpiecznik || stan.zasilanie) {
      console.log("Nie można tego zrobić.");
      return;
    }
    stan.bezpiecznik = false;
    stan.zasilanie = true;
    console.log("Naprawiono zasilanie.");
  } else if (co === "wyjdz") {
    if (stan.pokoj !== 4 || !stan.karta || !stan.zasilanie) {
      console.log("Nie można tego zrobić.");
      return;
    }
    stan.wygrana = true;
    stan.koniec = true;
    console.log("Otwarto drzwi!");
  } else {
    console.log("Nieznana akcja.");
    return;
  }

  zakonczTure(stan);
}