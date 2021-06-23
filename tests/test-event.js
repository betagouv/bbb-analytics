const chai = require('chai');
const app = require('../src/index.ts');
const knex = require('../src/db');

describe('Account', () => {
  afterEach((done) => {
    knex('marrainage').truncate()
      .then(() => done());
  });

  describe('GET /account unauthenticated', () => {
    it('should redirect to login', (done) => {
      chai.request(app)
        .get('/account')
        .redirects(0)
        .end((err, res) => {
          res.should.have.status(302);
          res.headers.location.should.include('/login');
          res.headers.location.should.equal('/login?next=/account');
          done();
        });
    });
  });

  describe('POST /v1/post_events authenticated', () => {
    // first render of template 'account' can be slow and exceed timeout this test may fail if timeout < 2000

    it('should return a valid page', (done) => {
      chai.request(app)
        .post('/v1/post_events')
        .send({
            attendees: [],
            meeting_name: 'Demo Meeting',
            meeting_id:'Demo Meeting' ,
            internal_meeting_id: '183f0bf3a0982a127bdb8161e0c44eb696b3e75c-1531240585189',
            create_time: 1531240585189,
            create_date: 'Tue Jul 10 16:36:25 UTC 2018',
            voice_bridge: 70066,
            dial_number: '613-555-1234',
            attendee_pw: 'ap',
            moderator_pw: 'mp',
            running: false,
            duration: 0,
            has_user_joined: true,
            recording: false,
            has_been_forcibly_ended: false,
            start_time: 1531240585239,
            end_time: 0,
            participant_count: 2,
            listener_count: 1,
            voice_participant_count: 1,
            video_count: 1,
            max_users: 20,
            moderator_count: 1
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});