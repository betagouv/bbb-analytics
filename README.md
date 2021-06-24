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

### Lancer en mode développement

Une fois Postgres lancé, vous pouvez démarrer l'application avec ces commandes :

```
» npm install # Récupère les dépendances
» npm run migrate # Applique les migrations
» npm run dev
   ...
   Running on port: 8100
```
L'application sera disponible sur `http://localhost:8100` (8100 est le port par défaut, vous pouvez le changer avec la variable d'env `PORT`)

### Lancer avec docker-compose
- Créer le fichier de configuration : `cp .env.example .env` et le remplir avec les identifiants OVH obtenus plus haut.
- Lancer le service et initialiser la base de données : `docker-compose up` - disponible sur http://localhost:8100
- Pour ajouter des données à la base de données (facultatif): `docker-compose run web npm run seed;`
- Lancer les tests : `docker-compose run web npm test`

### Lancer avec docker sans docker-compose

- Exemple pour développer dans un container :
	- `docker run --rm --env-file ../.env.secretariat.dev -v $(pwd):/app -w /app -ti -p 8100 node /bin/bash` (avec vos variables d'environnement dans ../.env.secretariat.dev)

### Lancer en mode production

```
» npm run start
   ...
   Running on port: 8100
```

### Lancer les tests

```
» npm run test
```
