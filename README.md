# Hockeyopstelling

Een eenvoudige webapp om een eerlijk wisselschema voor een hockeywedstrijd te maken. De app is bedoeld voor M.H.C.W., de hockeyclub van het Westerkwartier.

## Functies

- Selecteer welke spelers meedoen en wijs eventueel een keeper aan.
- De knop **Genereer** wordt actief zodra minstens zes spelers zijn geselecteerd en een keeper is gekozen.
- Stel de wedstrijdduur, het aantal veldspelers en de wisselinstellingen in.
- Genereer een wisselschema met een overzicht van de speeltijd per speler.
- Pas het schema handmatig aan door op een speler in het schema te klikken.
- Gebruik een randomisatietekst om met dezelfde invoer steeds dezelfde spelersvolgorde te krijgen. Spaties worden direct uit de tekst verwijderd. Laat het veld leeg voor een willekeurige volgorde.
- Houd de wedstrijdtijd bij met de ingebouwde timer. De timer markeert het actieve wisselblok en geeft een signaal bij rust, het einde van de wedstrijd en wisselmomenten.
- Instellingen, het schema en de timer worden automatisch in de browser opgeslagen.

## Gebruiken

Open [`index.html`](./index.html) in een moderne webbrowser. Er zijn geen installatie- of buildstappen nodig.

Je kunt de app ook lokaal via een webserver bekijken:

```bash
python3 -m http.server 8000
```

Open daarna <http://localhost:8000> in je browser. De app bestaat uit statische HTML-, CSS- en JavaScript-bestanden en kan daardoor ook worden gepubliceerd via GitHub Pages.

## Spelers aanpassen

De standaardspelers staan bovenaan in `app.js`, in de array `NAMES`. Vervang de namen daar door de spelers van je team:

```js
const NAMES = ['Speler 1', 'Speler 2', 'Speler 3'];
```

Gebruik voor iedere speler een unieke naam. De keeper wordt apart gekozen en telt niet mee als veldspeler.

## Instellingen en opgeslagen gegevens

De standaardinstellingen zijn een wedstrijdduur van 50 minuten, 5 veldspelers tegelijk, wissels per 5 minuten, maximaal 2 wissels per keer en maximaal 10 minuten achter elkaar aan de kant. Je kunt deze waarden in de app aanpassen.

De app heeft geen backend: instellingen, schema en timer worden lokaal in cookies en browseropslag bewaard. Ze zijn dus alleen beschikbaar in dezelfde browser op hetzelfde apparaat. Wis je de browsergegevens, dan worden ook deze opgeslagen gegevens verwijderd.
