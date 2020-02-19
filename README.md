# Project work "Memory tracks" for the course Full Stack Web Development at University of Helsinki

See [https://courses.helsinki.fi/en/aytkt21010/129098202](https://courses.helsinki.fi/en/aytkt21010/129098202) and [https://github.com/fullstackopen-2019/misc/blob/master/projekti.md](https://github.com/fullstackopen-2019/misc/blob/master/projekti.md) for the reference regarding the course information.

The project has been implemented in three different git repositories: [the first one contains the backend implementation on top of NodeJS and GraphQL (this)](https://github.com/minzen/fullstack_harjoitustyo_backend), [the second repository has the React JS based frontend implementation](https://github.com/minzen/fullstack_harjoitustyo_frontend) and [the third one has the experimental React Native implementation for iOS and Android mobile devices](https://github.com/minzen/fullstackharjoitustyoreactnative).

## General

The application "Memory tracks" is designated for a user who utilizes Internet services with multiple devices and wants to easily access the previously store data. The application enables an easy way of storing/linking meaningful content (e.g. important notes, links to web resources that the user wants to have a look at a bit later). The notes can be stored, classified and searched by using keywords. The frontend takes care of fetching and presenting the information obtained from the API provided by the backend.

## Backend implementation

The backend implementation has been mostly built on the following technologies NodeJS, MongoDB Atlas, Mongoose, and GraphQL (Apollo Server). The API built on top of GraphQL can be used directly on the server (see the following section).

## Build and execution

### System requirements

- nodejs (e.g. v.10.19.0), yarn/npm installed
- a database e.g. in MongoDB Atlas (the connection string is configured as environment variable)

### Building the application

- execute the command _yarn install_ to install the required dependencies
- the production version of the backend is run by invoking the command _yarn start_.

The production version of the backend (i.e. the GraphQL API running on top of ApolloServer) resides at [https://sleepy-woodland-08922.herokuapp.com/graphql](https://sleepy-woodland-08922.herokuapp.com/graphql). The run environment for end-to-end tests (always the most current version of the develop branch of the backend, against which the frontend code pushed to its develop branch is tested) is running at: [https://pacific-spire-56237.herokuapp.com/graphql](https://pacific-spire-56237.herokuapp.com/graphql)

## Used technologies

- NodeJS
- GraphQL + Apollo Server and other Apollo related libraries
- ESLint
- Mongoose
- MongoDB Atlas
- Nodemailer

## Time keeping

[Time keeping for the project work](tyokirjanpito.md)
