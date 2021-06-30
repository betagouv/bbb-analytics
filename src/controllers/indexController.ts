const db = require('../db');

type AttendeeInterface = {
    ext_user_id: String,
    name: String,
    moderator: Boolean,
    joins: Date[],
    leaves: Date[],
    duration: Number,
    recent_talking_time: String,
    engagement: {
      chats: Number,
      talks: Number,
      raisehand: Number,
      emojis: Number,
      poll_votes: Number,
      talk_time: Number
    },
}

type PayloadInterface = { 
  version: String,
  meeting_id: String,
  internal_meeting_id: String,
  data: {
    duration: Number,
    start: Date,
    finish: Date,
    attendees: AttendeeInterface[],
    files: String[],
    metadata: {
      meeting_name: String
    }
  },
}

type DbDataInterface = {
  meeting_id: String,
  internal_meeting_id: String,
  meeting_name: String,
  start: Date,
  finish: Date,
  duration: Number,
  attendee_count: Number,
  moderator_count: Number,
  raw_data: JSON,
  tag?: String,
  weekday: Number
}

type OptionalParamsInterface = {
  tag?: String
}

module.exports.getIndex = function (req, res) {
  return res.json({}, 200)
};

module.exports.postEvents = async function (req, res) {
  const requestData : PayloadInterface = req.body
  const queryData : OptionalParamsInterface = req.query
  const dbData : DbDataInterface = {
    meeting_id: requestData.meeting_id,
    internal_meeting_id: requestData.internal_meeting_id,
    meeting_name: requestData.data.metadata.meeting_name,
    start: requestData.data.start,
    finish: requestData.data.finish,
    duration: requestData.data.duration,
    attendee_count: requestData.data.attendees.length,
    moderator_count: requestData.data.attendees.filter(attendee => attendee.moderator).length,
    raw_data: req.body,
    tag: queryData.tag,
    weekday: (new Date(requestData.data.start)).getDay(),
  }
  try {
    await db('meetings').insert({
      ...dbData,
    })
  }
  catch (err) {
    return res.status(500).send(`${err}`);
  }
  return res.redirect('/');
};
