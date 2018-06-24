# Tastyfi.me

A web app for revealing a user's (good) taste in music with Spotify.

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
```

The `REDIRECT_URI` should be the same as the Redirect URI registered with your Spotify application.

Tastyfi.me already comes with preconfigured runtime values for Application Variables. **You'll just need to provide the Spotify Variables values if you're only interested in deploying to a local instance**.

##### 4. How to Deploy:

1. Clone the repo
2. Open a Terminal in the project directory
3. Run `npm install`
4. In another Terminal tab or window, run `mongod`, the Mongo daemon instance for your db
5. Run `npm start`
6. Open a browser window and visit http://localhost:3000/

##### Optional: Building Semantic UI

This repository already contains the compiled Semantic UI files in version control under the `public/semantic` directory, but in case of an upgrade or a fresh build, follow these instructions:

1. Open a Terminal in the project directory
2. Run `gulp install`
3. Set the installation directory to `public/semantic` when prompted by Gulp
4. Run `cd public/semantic`
5. Run `gulp build` to build the Semantic UI files

For more information on installing and using Semantic UI, see [Getting Started with Semantic UI](https://semantic-ui.com/introduction/getting-started.html).

*Note: This project uses a CDN resource for the required jQuery file for Semantic UI. If you're upgrading the Semantic UI version you might need to also upgrade to a newer version of jQuery in your landing and partial view files.*
