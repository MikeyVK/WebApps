<!-- docs\development\issue5\walkthrough.md -->
<!-- template=generic_doc version=43c84181 created=2026-07-12T08:03:00Z updated=2026-07-12 -->
# Walkthrough - Digital A4 Instroom Checklist

**Status:** APPROVED  
**Version:** 1.0.0  
**Last Updated:** 2026-07-12

---

## Purpose

Dit document beschrijft de gerealiseerde wijzigingen voor het introduceren van de nieuwe digitale A4 Instroom Checklist.

---

## Summary

Volledige oplevering van de digitale A4 checklist met dashboard, print en thema functionaliteit.

---

## Wijzigingen per Component

### 1. Central Configuration & Infrastructure
- **`apps-metadata.json`**: Geregistreerd van de nieuwe applicatie `project_intake_checklist` en verhoging van de order van `project_intake_scan` naar `3` om de checklist vooraan te plaatsen.
- **`package.json`**: Toevoeging van `"npm run dev -w project_intake_checklist"` aan het `"dev"` opstartscript.
- **`vite.config.ts (root)`**: Configureren van proxy-mappen voor poort `5178`.
- **`build-monorepo.js`**: Checklist toegevoegd aan de workspaces die meegekopieerd worden naar de root `dist/` map.

### 2. Project Intake Checklist (`apps/project_intake_checklist`)
Nieuwe lichtgewicht applicatie met:
- **Projectpaspoort**: Inputvelden voor Projectnaam, Beschrijving, Uitdager en Datum met inline validatiemelding bij ontbrekende gegevens.
- **A4 Checklist Grid**: 6 gekleurde blokken (Geel, Grijs, Perzik, Roze, Bruin, Paars) overeenkomstig het originele PDF-ontwerp. Elk blok is uitgerust met een bijpassende, modern-brutalistische vector-illustratie aan de linkerkant (Gereedschapskist, Ster, Uitdager met vergrootglas, Treurig gezicht, Sleutel met verbodsteken, Vraagteken) die de oorspronkelijke A4-plaatjes representeren.
- **Geïntegreerde Klikbare Bullets**: Criteria en selectievakjes zijn volledig geïntegreerd in één strakke lijst van klikbare bullets. De statische opsomming en de losse checkboxen zijn samengevoegd, waardoor dubbele teksten en herhalingen volledig zijn geëlimineerd.
- **Toelichtingen-paneel**: Een interactief paneel aan de rechterkant dat direct bij het hoveren (zweven met de muis) over een checklist-blok geactiveerd wordt en de bijbehorende toelichting en voorbeelden (WEL/NIET-lijstjes) toont.
- **Opslaan in Geschiedenis**: Gegevens worden in `localStorage` opgeslagen met een custom brutalistische succes-modal.
- **Geschiedenis Dashboard**: Toont eerdere intakes met opties tot direct openen, printen (laadt de specifieke intake-gegevens in en opent direct de afdrukdialoog), of verwijderen. De redundante "Nieuwe Intake" knop binnen het dossierblok is verwijderd om de interface overzichtelijker te maken. Daarnaast is het dossierdashboard volledig responsive gemaakt: op desktop wordt een strakke, geordende tabel getoond, terwijl op mobiele breedtes (`md:hidden`) automatisch wordt omgeschakeld naar een lijst met verticale kaarten (cards) om zijwaarts scrollen volledig te elimineren.
- **Afdrukweergave**: Printvriendelijke stylesheet (`print:block` en `print:hidden`) die de invoervelden en het toelichtingenpaneel verbergt en een klassiek papieren formulier inclusief handtekeningenblok genereert.
- **Naamgeving**: De primaire actieknop in de header is hernoemd naar "Nieuwe Intake" voor consistente terminologie.

### 3. Portal Integrations
- **FysiekFabriek Portal**: De oude `project_intake_scan` is vervangen door een link naar de nieuwe `project_intake_checklist`.
- **WebApps Portal**: Toont beide versies naast elkaar.

---

## Verificatie & Kwaliteitscontrole

### Kwaliteitspoorten (Quality Gates)
- TypeScript checks (`npx tsc --noEmit`) en ESLint slagen zonder fouten in alle workspaces.
- Monorepo productie-build (`npm run build`) met succes voltooid.

### Visuele Inspectie & Thema's
- Automatische browser QA tests zijn uitgevoerd op poorten `5174`, `5175` en `5178`.
- Werking van de checkboxes, dynamische geschiktheidsstatus (`GESCHIKT` / `IN BEOORDELING`), opslaan naar de geschiedenis dashboard en de custom overkoepelende modals zijn volledig geverifieerd.
- **Scroll & Viewport Fix**: `overflow-x-hidden` op de hoofdwrapper is vervangen door `overflow-x-clip` om te voorkomen dat de browser een interne scroll-container aanmaakt (inline frame gevoel). Scrollen is nu volledig centraal op het `HTML`/`body` niveau.
- **Eenduidige Uitlijning & Print Checkbox Fix**:
  - De layout van de checklist-kaarten is vereenvoudigd tot een enkele kolom met de geïntegreerde checklist-items direct naast het icoon (`flex items-start gap-4`), wat zorgt voor een rustig en gebalanceerd beeld op alle apparaten.
  - Bij het printen worden de native invoervelden verborgen (`print:hidden`) en vervangen door een custom flex-element met een omlijnde box en vinkje (`✓` of spatie) dat netjes mee afdrukt op papier, onafhankelijk van de browserinstellingen voor achtergrondkleuren.
- **Responsive Mobiele Header**: Het gedeelde `Header.tsx` component is refactored om op mobiele schermen (`md:hidden`) automatisch alle actieknoppen te verbergen en te vervangen door een brutalist hamburger-menu (3 streepjes). Bij het openen schuift er een verticaal uitklapmenu naar beneden.
- **Print Pagina-einde Fix**: De checklist-kaarten zijn uitgerust met `print:break-inside-avoid` om te voorkomen dat een kaart halverwege wordt doorgesneden op de overgang naar een volgende pagina bij een PDF-export.
- **Elegante Thema-schakelaar**: Het gedeelde `Footer.tsx` component bevat nu een subtiele, tekstloze thema-toggle knop (die wisselt tussen een maan 🌙 en zon ☀️ icoon) die de keuze van de gebruiker bewaart in `localStorage` (`app-theme`). De thema-klasse wordt direct gesynchroniseerd met het root `<html>` element, waardoor de paginabrede achtergrond (inclusief marges rond gecentreerde kolommen) perfect en vloeibaar mee verkleurt naar de gekozen modus.
- **Volledige Thema-omslag**: De gehele interface (achtergronden, tekstkleuren, invoervelden, kaarten en randen) schakelt nu volledig om bij het selecteren van het donkere thema. 
  - **Glowing Jewel-Toned Headers & Borders**: Om de kleurensamenstelling nog verder te perfectioneren, zijn de originele pastelkleuren in de donkere modus losgelaten. In opzichte daarvan is een speciaal ontworpen, rijk palet van **donkere juweeltonen** (Amber, Teal, Blue, Crimson, Green en Violet) toegepast. Deze vullingen (25% opaciteit) blenden perfect met de leisteen-kaartachtergrond (`#1e293b`). De borders van de kaarten gloeien subtiel mee (40% opaciteit), wat zorgt voor een rustig, harmonieus en uiterst chic geheel.
  - **Custom Brutalistische Checkboxes**: De standaard browser-specifieke (felblauwe) checkboxes zijn volledig uitgeschakeld via CSS (`appearance-none`). In opzichte daarvan is er een handgemaakt brutalistisch checkbox-ontwerp toegepast:
    - *Lichte modus*: Een witte box met dikke, donkere randen die bij vinken gevuld wordt met solide donker leisteen (`#1e293b`) en een witte checkmark toont.
    - *Donkere modus*: Een donkerblauwe box met matchende randen die bij vinken wordt gevuld met de warme oranje accentkleur (`#f19d76`) en een donkere checkmark toont.
  - **Lijnhoogte & Uitlijning Checkboxes**: De tekstgrootte en lijnhoogte van checkbox-labels is exact gelijkgetrokken aan de bullets-lijst aan de linkerkant (`text-xs font-semibold text-slate-700 py-1 leading-normal`). Door de uitlijning te veranderen van `items-center` naar `items-start mt-0.5` op de checkboxes, lijnen checkboxes bij langere, meerregelige labels altijd perfect en consequent uit met de eerste regel tekst.
  - **Icon Contrast**: De iconen (plaatjes) in de blokken hebben in de donkere modus een semitransparante, gloeiende gekleurde achtergrond (20% opaciteit) gekregen met helderwitte, scherpe lijnen voor een hoog contrast en uitstekende zichtbaarheid.
  - **Typografie Contrast & Zachte Teksten**: Om te voorkomen dat de tekst in de donkere modus te fel van het scherm spat, is een verfijnde contrast-hiërarchie toegevoegd: hoofdtitels en actieve hovers zijn uitgevoerd in zacht wit/grijs (`#e2e8f0`), terwijl lopende teksten en bullet points zijn gedempt naar een comfortabeler leeszacht grijs (`#94a3b8`). Dit elimineert elk glare-effect volledig.
  - **Hover Checkbox Teksten**: Een specifieke hover-override zorgt ervoor dat de checkbox-opties bij het zweven met de muis (hoveren) veranderen naar zacht wit/grijs (`#e2e8f0`) in plaats van donkergrijs/zwart, waardoor ze in de donkere modus te allen tijde perfect zichtbaar blijven.
  - **Premium Status Badges**: De status-badges ("Geschikt" en "In beoordeling") gebruiken in de donkere modus een subtiele, semitransparante vulling (20% opaciteit) met een heldere, levendige tekstkleur (groen / geel) voor een moderne, visueel aantrekkelijke en goed leesbare weergave.
  - **Leesbare Knoppen & Tabel-Hovers**: Actieknoppen zoals de "Printen"-knop en de "Print"-acties in de geschiedenistabel passen zich dynamisch aan naar een donkere achtergrond met lichte tekst. De hover-kleur van rijen in de geschiedenistabel wordt in de donkere modus omgezet naar de donkere app-achtergrond (`#0f172a`), waardoor tekst te allen tijde perfect leesbaar blijft op hover.
  - **Custom Scrollbars**: Er zijn specifieke custom scrollbars ontworpen en toegevoegd die zich aanpassen aan de actieve modus: in het brutalistische lichte thema toont de scrollbar een lichte track met een scherpe, donkergrijze brutalistische thumb. In het donkere thema blendt de scrollbar subtiel met een donkerblauwe track en een gedempte leisteen-grijze thumb.
  - **Print Specificiteit Fix**: De `@media print`-styles zijn voorzien van specifieke thema-prefixed selectors (o.a. `.theme-dark`). Dit lost een CSS-specificiteitsconflict op, waardoor bij het afdrukken vanuit de donkere modus de elementen altijd gedwongen worden naar hun originele lichte, contrastrijke kleuren (witte achtergrond, donkere letters en originele pastel-headers en donkere iconen op papier).

---

## Related Documentation

- [Project Intake Checklist App](file:///c:/1Voudig/99_Programming/FysiekFabriek-Triage/apps/project_intake_checklist)
- [Themes Specification](file:///c:/1Voudig/99_Programming/FysiekFabriek-Triage/shared/styles/themes.css)

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-07-12 | Antigravity | Initial definitive walkthrough |