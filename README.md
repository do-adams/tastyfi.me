# Tastyfi.me

A web app for revealing a Spotify user's (good) taste in music.

### Getting Started

#### System Requirements:
* Node.js
* npm
* Gulp (optional)
* MongoDb

#### Spotify Credentials

You'll need to have a registered Developer Account with Spotify and a valid **Client ID** and **Client Secret**. 

See the [Spotify Developers](https://developer.spotify.com/) website for information on how to do this.

#### How to Deploy:

1. Clone the repo
2. Open a Terminal in the project directory
3. Run `npm install`
4. In another Terminal tab or window, run `mongod`, the Mongo daemon instance for your db
5. Run `npm start`
6. Open a browser window and visit http://localhost:3000/

#### Building Semantic UI

This repository already contains the compiled Semantic UI files in version control under the `public/semantic` directory, but in case of an upgrade or a fresh build, follow these instructions:

1. Open a Terminal in the project directory
2. Run `gulp install`
3. Set the installation directory to `public/semantic` when prompted by Gulp
4. Run `cd public/semantic`
5. Run `gulp build` to build the Semantic UI files

For more information on Semantic UI, see [Getting Started with Semantic UI](https://semantic-ui.com/introduction/getting-started.html).

#### Environment Variables

Tastyfi.me uses the [dotenv](https://www.npmjs.com/package/dotenv) Node module so you can create a `.env` file with the following key-value pairs:

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
```
Tastyfi.me already comes with preconfigured runtime values for Application Variables. You'll definitely need the Spotify Variables values though.
