import getNextUser from 'models/getNextUser';
import getNextTweetForUser from 'models/getNextTweetForUser';
import postTweet from 'models/postTweet';
import log from 'server/log';

function tweetNextUser(callback, skipOffset, postTweetErrors) {
  let offset = skipOffset;
  let errors = postTweetErrors;

  if (!offset) {
    offset = 0;
  } else if (offset >= 5) {
    const error = new Error('postTweet errored too many times', errors);
    return callback(error);
  }

  return getNextUser((getNextUserErr, user) => {
    if (getNextUserErr) {
      return callback(getNextUserErr);
    }

    return getNextTweetForUser(user, (getNextTweetForUserErr, tweet) => {
      if (getNextTweetForUserErr) {
        return callback(getNextUserErr);
      }

      return postTweet(tweet, (postTweetErr) => {
        if (postTweetErr) {
          offset += 1;

          if (errors) {
            errors.push(postTweetErr);
          } else {
            errors = [postTweetErr];
          }

          return tweetNextUser(callback, offset, errors);
        }

        return callback(null, postTweetErrors);
      });
    });
  });
}

tweetNextUser((err, postTweetErrors) => {
  if (err) {
    log(err);
    throw err;
  }

  // eslint-disable-next-line
  console.log('Successfully tweeted');

  if (postTweetErrors) {
    const error = new Error('Successfully posted but had some errors', postTweetErrors);
    log(error);
  }
});
