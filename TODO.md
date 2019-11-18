# TODO

## Backend

- Datan haku GraphQL-API:sta
- MongoDB:n alustaminen ja konfigurointi
- Skeeman viimeistely: User, Note - mitä muuta?
- API-design
- API:n kytkeminen MongoDB-tietokantaan
- Token perustainen autentikointi
- Käyttäjien rekisteröinti ja salasanojen hallinta
- Testit
- Subscriptionit
- Tsekkaa, kuinka Apollo Server saadaan käyttämään https:ää

## Frontend

- Design ja toteutus: komponentit ja näkymät
- Datan haku ApolloClientilla
- Token-perustainen autentikointi
- Joku UI-framework käyttöön
- Toteutus :)
- Validointi:
  - regexit
  - email eihän ole duplikaatteja

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

* Tarkista turvallisuus-asiat: XSS-vaarat etc.
* Validointi
