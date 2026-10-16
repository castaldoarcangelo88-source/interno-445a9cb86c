# Vetrina progetti · uso interno

Sito statico con l'elenco dei progetti del Titolare (Arcangelo Castaldo, DevShare SRL), diviso per aree.
HTML, CSS e JS vanilla; tutti i dati stanno in `progetti.json`.

## File
- `index.html` · pagina unica (routing con hash: `#/` home, `#/area/<id>` area, `#/area/<id>/<idProgetto>` progetto)
- `style.css` · stile, responsive
- `app.js` · legge `./progetti.json` e disegna le pagine; ricerca e filtro per stato
- `progetti.json` · i dati
- `robots.txt` (Disallow: /), `.nojekyll`, meta `noindex, nofollow`
- `screenshot/` · home-desktop.png (1440), home-mobile.png (390), sviluppo-pwa-desktop.png

Percorsi tutti relativi: funziona anche in una sottocartella di GitHub Pages.
In locale serve un server web (es. `python3 -m http.server`), perché `fetch` non legge file aperti con `file://`.

## Schema di progetti.json
```
{
  "versione": 1,
  "ultimoAggiornamento": "AAAA-MM-GGTHH:MM:SS+02:00",   // mostrato in alto, ora di Roma
  "aggiornamento": "due volte al giorno (mattina e sera)",
  "fontiGenerali": ["percorso", ...],
  "aree": [
    {
      "id": "sviluppo-pwa",            // usato nell'indirizzo #/area/<id>
      "nome": "Sviluppo PWA",
      "descrizione": "testo breve",
      "progetti": [
        {
          "id": "pwa-natale",
          "nome": "PWA Natale",
          "stato": "attivo | in-attesa | bloccato | pausa | chiuso",
          "spiegazione": "cos'è e a che punto è",
          "ultimoAggiornamento": "AAAA-MM-GG oppure «da verificare»",
          "cronologia":   [ { "data": "AAAA-MM-GG", "testo": "cosa è stato fatto", "fonte": "facoltativa" } ],
          "prossimiPassi":[ { "passo": "cosa fare", "scadenza": "AAAA-MM-GG oppure «da verificare»" } ],
          "blocchi":      [ "testo" ],
          "daTitolare":   [ "cosa serve dal Titolare" ],
          "fonti":        [ "percorso del file" ]
        }
      ]
    }
  ]
}
```
Conteggi della home (calcolati da `app.js`): progetti; bloccati = `stato` «bloccato»; aspettano il Titolare = `daTitolare` non vuoto e stato diverso da «chiuso».

## Aggiornamento (due volte al giorno: dopo il digest delle 9:00 e la sera)
1. Leggere `quadro/ALBERO_VIVO.md`, `quadro/GRAFO_PROGETTI.md`, `quadro/STORICO.md` e i file STATO / consegna nuovi.
2. Aggiornare `progetti.json` (stato, cronologia, prossimi passi, blocchi, richieste) e `ultimoAggiornamento`.
3. Mai inventare: se un dato manca si scrive «da verificare».
4. Prima di salvare, fare la scansione di riservatezza (nessuna password, IBAN, token, chiave, carta, codice fiscale di persona fisica, dato sanitario; dei minori solo il nome di battesimo).
