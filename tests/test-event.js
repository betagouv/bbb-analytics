const chai = require('chai');
const app = require('../src/index.ts');
const knex = require('../src/db');
const config = require('../src/config');
const jwt = require('jsonwebtoken');

const apiResponse = {
  version: '1.0',
  meeting_id: 'meeting-persistent-c308049',
  internal_meeting_id: '3e677e88dl7698',
  data: {
    metadata: {
      analytics_callback_url:
        'https://webhook.site/f519038c-b956-4fa3-9b5c-148e8df09b47',
      is_breakout: 'false',
      meeting_name: 'Arawa3',
    },
    duration: 20,
    start: '2021-06-27 18:52:12 +0200',
    finish: '2021-06-27 18:52:32 +0200',
    attendees: [
      {
        ext_user_id: 'w_hll5o9o',
        name: 'Lucas Pla',
        moderator: true,
        joins: ['2021-06-23 18:52:21 +0200'],
        leaves: ['2021-06-23 18:52:32 +0200'],
        duration: 11,
        recent_talking_time: '',
        engagement: {
          chats: 0,
          talks: 0,
          raisehand: 0,
          emojis: 0,
          poll_votes: 0,
          talk_time: 0,
        },
      },
    ],
    files: ['default.pdf'],
    polls: [],
  },
};

const signForSecret = function (secret) {
  return jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    },
    secret,
    {
      algorithm: 'HS512',
      header: {
        typ: 'JWT',
      },
    }
  );
};

const sendResponseForTag = async function (tag, secret) {
  return await chai
    .request(app)
    .post(`/v1/post_events?tag=${tag}`)
    .set('content-type', 'application/json')
    .set('Authorization', 'Bearer ' + signForSecret(secret))
    .set('user-agent', 'BigBlueButton Analytics Callback')
    .send(apiResponse);
};

describe('Meetings', async () => {
  beforeEach(async () => {
    config.tagsAndSalts = 'dinum:somefancysecret';

    await knex.raw('truncate table meetings cascade');
  });

  describe('POST /v1/post_events', async () => {
    describe("when the JWT_TAGS_AND_SALTS variable isn't set", () => {
      beforeEach(() => {
        config.tagsAndSalts = null;
      });

      it('defaults to JWT_SECURITY_SALT', async () => {
        const res = await sendResponseForTag('some org', config.secret);

        res.should.have.status(200);
      });
    });

    describe('when the issuer is unknown', () => {
      it('throws an error', async () => {
        const res = await sendResponseForTag('some org', 'somefancysecret');

        res.should.have.status(403);
      });
    });

    describe('when the issuer is known but the secret is wrong', () => {
      it('throws an error', async () => {
        const res = await sendResponseForTag('dinum', 'some other secret');

        res.should.have.status(403);
      });
    });

    describe('when the issuer is known and the secret is correct', () => {
      it('should create a new entry in meetings', async () => {
        const res = await sendResponseForTag('dinum', 'somefancysecret');

        res.should.have.status(200);

        const stats = await knex('meetings')
          .orderBy('created_at', 'desc')
          .first();

        stats.duration.should.be.equal(apiResponse.data.duration);
        stats.moderator_count.should.be.equal(1);
        stats.internal_meeting_id.should.be.equal(
          apiResponse.internal_meeting_id
        );
        stats.tag.should.be.equal('dinum');
        stats.weekday.should.be.equal(0);
      });
    });
  });
});
