const db = require('../db');

type MetadataInterface = {
  attendees: String[],
  meeting_name: String,
  meeting_id: String,
  internal_meeting_id: String,
  create_time: String,
  create_date: String,
  voice_bridge: String,
  dial_number: String,
  attendee_pw: String,
  moderator_pw: String,
  running: String,
  duration: Number,
  has_user_joined: Boolean,
  recording: Boolean,
  has_been_forcibly_ended: Boolean,
  start_time: String,
  end_time: String,
  participant_count: String,
  listener_count: String,
  voice_participant_count: String,
  video_count: String,
  max_users: String,
  moderator_count: String
}

type PayloadInterface = { 
  version: String,
  meeting_id: String,
  internal_meeting_id: String,
  data: MetadataInterface,
}

type DbData = {
  version: String,
  meeting_id: String,
  internal_meeting_id: String,
  MetadataInterface
}

module.exports.getIndex = function (req, res) {
  return res.json({}, 200)
};

module.exports.postEvents = async function (req, res) {
    const data : PayloadInterface = req.body
    try {
      await db('stats').insert({
        ...data,
        ...data.data
      })
    }
    catch (err) {
      throw new Error(`${err}`);
    }
  
    return res.redirect('/');
  };
  