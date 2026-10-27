# Decyzja techniczna zespołu

- Problem użytkownika lub implementacji:
- Ograniczenie, którego nie możemy zmienić:
- Wariant A i jego koszt:
- Wariant B i jego koszt:
- Krótka próba porównawcza i wynik:
- Wybór oraz uzasadnienie:
- Kiedy wrócimy do decyzji:
- Które kontrakty lub pliki trzeba zaktualizować:

Wystarczy kilka zdań. Nie oceniamy długości dokumentu ani popularności autora pomysłu.

1. Jeden obiekt (fabryka `stanPoczatkowy()`), co zapobiega rozpraszaniu zmiennych po przestrzeni globalnej.
2. Odrzucona alternatywa
Alternatywa: Zmienne gloabalne bo sa proste w urzyciu(`let pokoj = 1; let energia = 10; ...`) 
Powód odrzucenia:Nie podoba nam sie.
