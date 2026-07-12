<!-- docs\development\issue7\pr.md -->
<!-- template=pr version=93bb9b4e created=2026-07-12T18:53Z updated= -->
# Fix empty print pages on desktop and mobile viewports

Oplossing voor lege printpagina's aan het begin (desktop grid conflict) en aan het einde (mobile viewport height stretch) van de intake checklist. Tevens is de projectomschrijving op papier vergroot naar een paginabreed blok en is er een invoerlimiet van 200 tekens met teller toegevoegd.
## Changes
Print-layout aangepast (grid gedeactiveerd tijdens printen, min-h stretch geneutraliseerd). Projectomschrijving verplaatst naar paginabreed print-blok met text-xs. Maximaal 200 tekens limiet en teller toegevoegd aan projectomschrijving textarea. Data-migratie toegevoegd voor compatibiliteit met oude dossiers.

## Testing
Visueel handmatig getest op poort 5178 voor zowel desktop als mobiele viewports en print preview. Alle TypeScript en ESLint checks slagen. Productie-build met succes voltooid.
## Checklist

- [ ] Geen lege pagina's meer bij het afdrukken op desktop en mobiel
- [ ] Projectomschrijving is goed leesbaar over de volle breedte op papier
- [ ] Invoerlimiet van 200 tekens en teller werken correct
- [ ] Monorepo build slaagt


---

Closes: #7