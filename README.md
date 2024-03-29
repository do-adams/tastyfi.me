# Tastyfi.me

A web app for revealing a user's (good) taste in music with Spotify.

![tastyfi showcase](public/images/tasty-showcase.gif)

Tastyfi.me is a full-stack application built with Node.js, Express, MongoDb, and EJS that uses the Spotify Web API for querying unique user and song data for generating dynamic user pages.

It exists to help listeners understand their musical tastes over different time periods by viewing their most loved Artists, Tracks, trends, and musical kinks.

Listeners can sign up with one click, create and view their user profiles, and share them with friends and family for discovering great new music.

### Features

Back-End:
* MV* Back-End Architecture
* RESTful Routes
* User Sessions with express-session
* Session Storage with connect-mongo
* Oath 2.0 Authentication with Passport and Spotify
* Asynchronous HTTP Requests and Db Queries with JavaScript Promises and Async/Await
* In-Memory Caching of HTTP Responses with memory-cache
* Custom Middleware for Express Routers
* Flash Messages with connect-flash

Front-End:
* Dynamic Views with EJS
* Responsive Pages and Components with Semantic-UI
* Responsive Media Queries for Mobile Layouts
* Web Browser Clipboard Functionality with Clipboard.js

### Getting Started

##### 1. System Requirements:

You'll need a computer with the following software installed:
* Node.js
* npm
* Gulp (optional)
* MongoDb

##### 2. Spotify Credentials

You'll need to have a registered Developer Account with Spotify and a valid **Client ID** and **Client Secret**. Your web application registration must be set up to use the **Authorization Code Flow** OAuth 2.0 [scheme](https://developer.spotify.com/documentation/general/guides/authorization-guide/).

See the [Spotify Developers](https://developer.spotify.com/) website for information on how to do this.

##### 3. Environment Variables

Tastyfi.me uses the [dotenv](https://www.npmjs.com/package/dotenv) Node module so you must create a `.env` file in the project directory with the following key-value pairs:

```
# Application Variables
NODE_ENV=<node_environment>
DATABASE_URL=<connection_string_for_mongo_db>
SESSION_SECRET=<key_for_encrypting_session_cookies>
PORT=<port_number>

# Spotify Variables
CLIENT_ID=<spotify_client_id>
CLIENT_SECRET=<spotify_client_secret>
REDIRECT_URI=<redirect_uri_for_spotify_authentication>

# Caching
SPOTIFY_CACHE_DURATION_MS=<cache_duration_value_in_milliseconds>
```

The `REDIRECT_URI` should be the same as the Redirect URI registered with your Spotify application.

Tastyfi.me already comes with preconfigured runtime values for Application and Caching Variables. **You'll just need to provide the Spotify Variables values if you're only interested in deploying to a local instance**.

##### 4. How to Deploy:

1. Clone the repo
2. Open a Terminal in the project directory
3. Run `npm install`
4. In another Terminal tab or window, run `mongod`, the Mongo daemon instance for your db
5. Run `npm start`
6. Open a browser window and visit http://localhost:3000/

##### Optional: Building Semantic UI with Gulp

This repository intentionally contains the compiled Semantic UI files in version control under the `public/semantic` directory, but in case of an upgrade or a fresh build, follow these instructions:

1. Open a Terminal in the project directory
2. Run `cd node_modules/semantic-ui` to open the semantic-ui package directory
3. Run `gulp install` and perform an 'Express' installation.
4. Set the installation directory to `public/semantic` when prompted by Gulp
5. Run `cd public/semantic`
6. Run `gulp build` to build the Semantic UI distribution files

For more information on installing and using Semantic UI, see [Getting Started with Semantic UI](https://semantic-ui.com/introduction/getting-started.html).

*Note: This project uses a CDN resource for the required jQuery file for Semantic UI. If you're upgrading the Semantic UI version you might need to also upgrade to a newer version of jQuery in your landing and partial view files.*

### Photo Credits

* Hand holding an iPhone Photo by [Jean](https://unsplash.com/photos/3NgcTH0CFJg?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
* 404 Pug Photo by [Matthew Henry](https://unsplash.com/photos/hnYMacpvKZY?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

### Licensing

MIT License

Copyright (c) 2018 Damián Adams

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
