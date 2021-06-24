# bbb-analytics
Application that collect analytics from the BigBlueButton Analytics Callback and put it in a postgresql database for analytics purpose


## Configuration of the app

- `JWT_SECRET_SALT=toSetup` (Not yet implemented)
- `DATABASE_URL=postgres://...` (Not yet implemented)

## Configuration of bigbluebutton server

- The 'BigBlueButton Analytics Callback'  https://github.com/bigbluebutton/bigbluebutton/blob/develop/record-and-playback/core/scripts/post_events/post_events_analytics_callback.rb is executed after each conference
- Set the metadata attributes "meta_analytics-callback-url" to the url of this app : `https://bbb-analytics.hosting.com/v1/post_events`
- In `/usr/share/bbb-web/WEB-INF/classes/bigbluebutton.properties` set the `securitySalt` to the same value of `JWT_SECRET_SALT`
- Running post_events scripts requires that you enable keepEvents=true in bbb-web's bigbluebutton.properties configuration. Or you can also use the param           
 'meetingKeepEvents=true' in the "meeting creation" call to enable it.

## Notes
- You should use an app like Metabase for analytics purpose of the constituted database
- Use the conference id as key, check that two serveur don't generate the same id

### Run in dev mode

Once Postgres is launched, you can start the application with these commands :

```
» npm install # Récupère les dépendances
» npm run migrate # Applique les migrations
» npm run dev
   ...
   Running on port: 8100
```

The application will be available on `http: // localhost: 8100` (8100 is the default port, you can change it with the env variable` PORT`)

### Run with docker-compose
- Create the configuration file : `cp .env.example .env` and fill it in with the env var specified above.
- Start the service and initialize the database : `docker-compose up` - disponible sur http://localhost:8100
- To add data to the database (optional): `docker-compose run web npm run seed;`
- Run the tests : `docker-compose run web npm test`

### Run with docker without docker-compose

- Example to develop in a container :
	- `docker run --rm --env-file ../.env.bbbanalytics.dev -v $(pwd):/app -w /app -ti -p 8100 node /bin/bash` ((with your environment variables in ../.env.bbbanalytics.dev)

### Run in production
```
» npm run start
   ...
   Running on port: 8100
```

### Run tests

```
» npm run test
```
