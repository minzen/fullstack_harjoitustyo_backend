# TODO

## Backend

- Deployment-skripti?
- Testit
- Subscriptionit
- Github actions: triggeröidään joka pushilla masteriin: deployment to heroku both for the production and for the E2E testing
- Frontendille actionit, jotka toisaalta deployaavat tuotantoversion (master) käyttöön github-pagesiin, ja toisaalta ajaa E2E-testit (push masteriin/developiin tai mihin branchiin hyvänsä).

## Frontend

- Design ja toteutus: komponentit ja näkymät
- Validointi:
  - regexit
  - email eihän ole duplikaatteja
- Luo webpack-konfiguraatio koko sovellukselle
- Responsiivisuus-ongelmien korjaaminen
- dark / light -teeman valinta profiiliin
- ensimmäisellä kerralla näytetään; jos käyttäjä on klikannut sen piiloon, ei näytetä seuraavalla kerralla (tieto evästeeseen?)
- CORS?
- Luo loggeri middleware
- E2E-testien korjaaminen
- Muistiinpanojen järjestäminen raahaamalla
- Salasana unohtunut -toiminto
- Sovelluksen kielen valinta käyttäjäkohtaiseksi ja tallentaminen käyttäjän tietoihin
- Lisää sivutus muistiinpanoille
- Unarchive-toiminto jo arkistoiduille muistiinpanoille
- Testaa myös huonoilla verkkoyhteyksillä
- Korvaa backendin virheilmoitukset lokalisoiduilla

## React Native

- Internationalization, esim. https://github.com/react-native-community/react-native-localize
- Datan haku ApolloClientilla API:n kautta
- Näkymien suunnittelu:
  - tietojen haku-näkymä (voi olla yhdistetty muistiinpanojen listaus -näkymään)
  - Käyttäjäprofiili
  - Käyttäjätilin rekisteröinti-näkymä
- muistiinpanojen editointi ja poistaminen
- suosikkien asettaminen
- toteuta unit- ja e2e-testit
- Kuvien ja videoiden lisääminen dokumenttitietokantaan? Mieluummin ei, vaan tallennetaan ainoastaan linkkejä resursseihin ja kuvat esim. S3-bucketiin
- Logout / tiedot käyttäjästä

- Tarkista turvallisuus-asiat: XSS-vaarat etc.
- Validointi
- Graafiset viilaukset (himmennetyt näkymät, popup-efektit)
- Muistiinpanojen jakaminen ja kommentointi
- Lisää e2e-testejä

## Yleistä

- React Native -osion muuttaminen käyttämään typescriptiä (projekti luotu jo alunperin ts:lle)
- User input sanitization
- Testaa kaikki vielä kerran
