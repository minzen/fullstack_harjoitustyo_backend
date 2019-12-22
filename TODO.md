# TODO

## Backend

- Deployment-skripti?
- Testit
- Subscriptionit
- Tsekkaa, kuinka Apollo Server saadaan käyttämään https:ää

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
- Muistiinpanojen arkistointi (jos käyttäjä haluaa myöhemmin palata aiheeseen, mutta saada osan aiheista pois näkyvistä haluttaessa)

## React Native

- Internationalization, esim. https://github.com/react-native-community/react-native-localize
- Datan haku ApolloClientilla API:n kautta
- Näkymien suunnittelu:
  - muistiinpanojen listaus
  - muistiinpanojen lisäys
  - kirjautuminen
  - tietojen haku-näkymä (voi olla yhdistetty muistiinpanojen listaus -näkymään)
  - Käyttäjäprofiili
  - Käyttäjätilin rekisteröinti-näkymä
- Header ja menu
- Tyylien käyttö
- React Navigation käyttöön (https://facebook.github.io/react-native/docs/navigation)
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
