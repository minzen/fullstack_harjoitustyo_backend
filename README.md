# Helsingin yliopiston Full Stack Web Development -kurssin harjoitustyö "Muistijäljet"

Kts. https://courses.helsinki.fi/en/aytkt21010/129098202 ja https://github.com/fullstackopen-2019/misc/blob/master/projekti.md
Tämä sovellus on rakennettu Full Stack Web Development -kurssille. Projekti on jaettu kahteen kolmeen eri repositoryyn: [ensimmäisessä Backend-toteutus](https://github.com/minzen/fullstack_harjoitustyo_backend) ja [toisessa normaali Frontend](https://github.com/minzen/fullstack_harjoitustyo_frontend) ja [kolmannessa](https://github.com/minzen/fullstackharjoitustyoreactnative) kokeellinen React Native -toteutus.

## Yleistä

"Muistijäljet"-sovellus on tarkoitettu käyttäjälle, joka käyttää monia päätelaitteita ja haluaa päästä helposti käsiksi aiemmin tallennettuihin tietoihin. Sovellus mahdollistaa käyttäjälle helpon tavan tallentaa/linkittää merkityksellistä sisältöä (esim. tärkeät muistiinpanot, linkit resursseihin, joihin käyttäjä haluaa palata myöhemmin, mutta juuri kyseisellä hetkellä ei ole aikaa tai halua tehdä sitä). Kunkin tallennettavan tiedon yhteyteen tallennetaan asiasanoja, joiden mukaan sisältöjä luokitellaan ja on mahdollista hakea myöhemmin. Backend-huolehtii tietojen tallentamisesta dokumenttitietokantaan sekä tarjoaa API:n tietojen hakuun ja tallennukseen.

## Backend-toteutus

Backend-toteutus rakentuu pääosin teknologioiden MongoDB Atlas, Mongoose, GraphQL ja NodeJS päälle. GraphQL:n päälle rakentuva dokumentoitu API on tutkittavissa palvelimella (kts. seuraava kappale).

Backendin (eli GraphQL-API, joka laukkaa ApolloServerin päällä) tämänhetkinen versio löytyy osoitteesta: http://gyarados.feetunyrhinen.de:4000/graphql

## Työaikakirjanpito

[Työaikakirjanpito](tyokirjanpito.md)
