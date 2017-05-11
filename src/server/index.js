import 'server/dotenv';
import express from 'express';
import compression from 'compression';
import path from 'path';
import bodyParser from 'body-parser';
import port from 'constants/port';
import listenLog from 'constants/listenLog';
import addUser from 'models/addUser';
import addTweet from 'models/addTweet';

const app = express();

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.urlencoded());
app.use(compression());

app.get('*', (req, res) => {
  res.render('index');
});

app.post('*', (req, res) => {
  if (!req.body || !req.body.type) {
    return res.render('index');
  }

  switch (req.body.type) {
    case 'addUser':
      return addUser(req.body.username, (err) => {
        if (err) {
          return res.render('index', { userError: err });
        }

        return res.render('index', { userSuccess: true });
      });

    case 'addTweet':
      return addTweet(req.body.tweet, (err) => {
        if (err) {
          return res.render('index', { tweetErr: err });
        }

        return res.render('index', { tweetSuccess: true });
      });

    default:
      return res.render('index');
  }
});

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(listenLog); // KEEP THIS AS WATCH SCRIPT RELIES ON THIS BEING LOGGED
});
