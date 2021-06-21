# bbb-analytics
Application that collect analytics from the BigBlueButton Analytics Callback and put it in a postgresql database for analytics purpose


## Configuration of the app

- `JWT_SECRET_SALT=toSetup` (Not yet implemented)
- `DATABASE_URL=postgres://...` (Not yet implemented)

## Configuration of bigbluebutton server

- The 'BigBlueButton Analytics Callback'  https://github.com/bigbluebutton/bigbluebutton/blob/develop/record-and-playback/core/scripts/post_events/post_events_analytics_callback.rb is executed after each conference
- Set the metadata attributes "analytics-callback-url" to the url of this app : `https://bbb-analytics.hosting.com/v1/post_events`
- In `/usr/share/bbb-web/WEB-INF/classes/bigbluebutton.properties` set the `securitySalt` to the same value of `JWT_SECRET_SALT`


## Notes
- You should use an app like Metabase for analytics purpose of the constituted database
- Use the conference id as key, check that two serveur don't generate the same id
