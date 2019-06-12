# Maximo REST client

This is a promise-based Node.JS library written in TypeScript for interacting with the IBM Maximo REST API.

## Installation
```sh
npm install maximo-rest-client
```
## Usage
With JavaScript
```js
const mx = require('maximo-rest-client');

const client = new mx.MaximoClient({
    host: "IP",
    port: 9080,
    lean: true, // this option is currently forced to true
    user: "username",
    password: "password"
});

// If you wish to use a reusable session
client.initializeReusableSession().then(() => {
    client.getResources("mxasset").then((results) => {
        // do stuff with results
    });
});
```
With TypeScript (or ES6+ imports) and `async/await`
```ts
import { MaximoClient } from "maximo-rest-client";

const client = new MaximoClient({
    host: "IP",
    port: 9080,
    lean: true, // this option is currently forced to true
    user: "username",
    password: "password"
});

await client.initializeReusableSession();

const results = await client.getResources("mxasset");
```

## Remarks
This is a very simple library written for use in another project that I am a part of. It is also in a very early stage. Several features are missing, for example the only authentication option available right now is maxauth while the Maximo REST API allows for FORM and BASIC.

## Roadmap
This is a side project, therefore updates and feature additions will not be as frequent as I would like, but will try my best. 

Some features that I plan to implement are all authentication options and pagination.

## Contributing
Pull requests and issues are welcome.

## License
[MIT](https://choosealicense.com/licenses/mit/)