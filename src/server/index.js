import 'server/dotenv';
import express from 'express';
import compression from 'compression';
import path from 'path';
import port from 'constants/port';
import listenLog from 'constants/listenLog';

const app = express();

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '../public')));
app.use(compression());

app.get('*', (req, res) => {
  res.render('index', {});
});

app.post('*', (req, res) => {
  res.render('index', {});
});

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(listenLog); // KEEP THIS AS WATCH SCRIPT RELIES ON THIS BEING LOGGED
});
