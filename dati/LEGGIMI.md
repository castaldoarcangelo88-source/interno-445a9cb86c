# dati/ · pagina riservata

Pagina «Dati analitici» cifrata (AES-GCM, chiave PBKDF2-SHA256 600.000 iterazioni), stessa password di progetti/. noindex.
Si rigenera con `/workspace/vetrina-progetti-strumenti/pubblica-dati.sh [sorgente]` (default: /workspace/analytics-unica/index.html).
**La routine 8:41/20:41 NON deve copiare qui la pagina in chiaro**: va usato pubblica-dati.sh. Un hook pre-commit locale cifra comunque in automatico un dati/index.html in chiaro e blocca il commit se resta in chiaro.
