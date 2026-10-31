---
name: hockeyopstelling
description: "Maak een hockeyopstelling met eerlijke speeltijd. Gebruik bij vragen over hockeywissels, veldbezetting, speeltijd verdelen of een wisselschema."
argument-hint: "Geef eventueel de namen van de veldspelers"
user-invocable: true
---

# Hockeyopstelling maken

Maak een praktisch wisselschema voor een hockeywedstrijd waarin iedere veldspeler ongeveer evenveel speeltijd krijgt.

## Werkwijze

1. Vraag eerst hoeveel veldspelers er beschikbaar zijn.
2. Vraag daarna hoeveel minuten de wedstrijd duurt.
3. Gebruik standaard wisselmomenten om de 5 minuten, steeds hetzelfde interval gedurende de hele wedstrijd. Gebruik een ander interval als de gebruiker dat opgeeft.
4. Vraag om de namen van de veldspelers als die nog niet bekend zijn. Controleer of het aantal namen overeenkomt met het opgegeven aantal spelers.
5. Vraag zo nodig hoeveel spelers er tegelijk in het veld staan als dat niet uit de invoer volgt. Gebruik anders het aantal dat de gebruiker opgeeft als het aantal veldspelers dat tegelijk speelt.
6. Maak vanaf de start blokken met het gekozen interval. Als de wedstrijdduur geen veelvoud van dat interval is, maak dan het laatste blok korter. Plan geen wissel na het laatste fluitsignaal.
7. Houd per speler de speeltijd en aaneengesloten banktijd bij. Hanteer standaard maximaal 10 minuten achter elkaar op de bank; gebruik een andere ingestelde limiet als de gebruiker die opgeeft. Vermeld een waarschuwing als die limiet met de beschikbare spelers en instellingen niet haalbaar is.
8. Verdeel de speeltijd zo gelijkmatig mogelijk. Kies bij wisselmomenten spelers die relatief lang op de bank hebben gezeten om spelers met relatief veel speeltijd te vervangen. Wissel bij voorkeur niemand direct opnieuw in of uit.
9. Wissel standaard maximaal 2 spelers per wisselmoment, tenzij de gebruiker een ander maximum opgeeft. Houd het aantal spelers op het veld na iedere wissel gelijk aan het opgegeven aantal. Beschrijf elke inkomende speler afzonderlijk met de speler die eruit gaat.
10. Controleer vóór het antwoord de blokduur, veldbezetting, wisselacties, maximale banktijd en totale speeltijd per speler. Vermeld kort als een exacte gelijke verdeling niet mogelijk is.

## Output

Toon eventuele keeperinformatie en meldingen buiten de tabellen. Als er een keeper is, begin met `Keeper: <naam>`. Als alle veldspelers de hele wedstrijd spelen, vermeld dat er geen wissels nodig zijn.

Toon daarna de wissels als een tabel met eerst `Blok`, dan `Wissels`, gevolgd door een kolom voor iedere veldspeler:

| Blok | Wissels | Jan | Piet | Lisa |
|---|---|---|---|---|
| 0–5 | - | Jan | Piet | Lisa |
| 5–10 | Piet ↔ Jan | Piet |  | Lisa |

Gebruik de verstreken minuten als blokgrenzen, zonder `min` achter de getallen. Gebruik alle veldspelers als kolomkoppen. Vul de naam in als de speler dat hele blok op het veld staat, laat de cel leeg als die op de bank zit en toon `uit` als de speler vanaf dat blok is uitgevallen. Zet bij het eerste blok `-` bij Wissels. Toon iedere wissel afzonderlijk als `inkomende speler ↔ uitgaande speler`; gebruik meerdere regels in die cel als er meer dan één wissel is.

Toon onder de wisseltabel een aparte tabel `Naam | Minuten` met de totale speeltijd per veldspeler. Vermeld daarna, indien van toepassing, dat een exacte gelijke verdeling niet mogelijk is en toon waarschuwingen over haalbare wissels of maximale banktijd. Neem geen spelers op die niet zijn opgegeven en verzin geen namen.
