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
3. Gebruik wisselmomenten om de 5 minuten, steeds hetzelfde interval gedurende de hele wedstrijd. Vraag niet naar het interval, tenzij de gebruiker zelf een ander interval noemt.
4. Vraag om de namen van de veldspelers als die nog niet bekend zijn. Controleer of het aantal namen overeenkomt met het opgegeven aantal spelers.
5. Vraag zo nodig hoeveel spelers er tegelijk in het veld staan als dat niet uit de invoer volgt. Gebruik anders het aantal dat de gebruiker opgeeft als het aantal veldspelers dat tegelijk speelt.
6. Maak blokken van 5 minuten vanaf de start. Als de wedstrijdduur geen veelvoud van 5 is, maak dan het laatste blok korter. Plan geen wissel na het laatste fluitsignaal.
7. Houd per speler de speeltijd en aaneengesloten banktijd bij. Zorg dat niemand langer dan 10 minuten achter elkaar op de bank zit.
8. Verdeel de speeltijd zo gelijkmatig mogelijk. Kies bij wisselmomenten spelers die relatief lang op de bank hebben gezeten om spelers met relatief veel speeltijd te vervangen. Wissel bij voorkeur niemand direct opnieuw in of uit.
9. Wissel maximaal 2 spelers per wisselmoment. Houd het aantal spelers op het veld na iedere wissel gelijk aan het opgegeven aantal. Beschrijf elke inkomende speler afzonderlijk met de speler die eruit gaat.
10. Controleer vóór het antwoord de blokduur, veldbezetting, wisselacties, maximale banktijd en totale speeltijd per speler. Vermeld kort als een exacte gelijke verdeling niet mogelijk is.

## Output

Geef alleen een overzichtelijke tabel met een kolom voor ieder opgegeven veldspeler, plus een kolom voor het blok en een kolom voor de wisselactie:

| Blok | Jan | Piet | Lisa | Wisselactie aan begin blok |
|---|---|---|---|---|
| Start–5 min | Jan | Piet | Lisa | - |
| 5–10 min | Jan |  | Lisa | Piet komt erin voor ... |

Gebruik als kolomkoppen de namen van alle opgegeven spelers. Vul in een spelerscel de naam van die speler in als die in dat blok op het veld staat; laat de cel leeg als die speler op de bank zit. Zet bij de start `-` bij de wisselactie. Beschrijf bij elk wisselmoment expliciet wie erin komt en voor wie, bijvoorbeeld: `Jan komt erin voor Piet en Elle komt erin voor Lisa`.

Sluit af met één korte regel met de geschatte speeltijd per speler, tenzij de gebruiker expliciet om alleen de tabel vraagt. Neem geen spelers op die niet zijn opgegeven en verzin geen namen.
