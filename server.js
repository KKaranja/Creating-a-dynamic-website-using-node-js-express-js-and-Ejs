const express = require('express');
const path = require('path');

const cookieSession = require('cookie-session');

const createError = require('http-errors');

const bodyParser = require('body-parser');

const FeedbackService = require('./services/feedbackService');
const SpeakerService = require('./services/speakerService');

const feedbackService = new FeedbackService('./data/feedback.json');
const speakerService = new SpeakerService('./data/speakers.json');

const routes = require('./routes');

const app = express();

const port = 4000;

app.set('trust proxy', 1);

app.use(
  cookieSession({
    name: 'session',
    keys: ['kjhg47ytrewq', 'jhgfdsa7ytr'],
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, './views'));

app.locals.siteName = 'Isaac Meetups';

app.use(express.static(path.join(__dirname, './static')));

app.use(async (req, res, next) => {
  try {
    const names = await speakerService.getNames();
    res.locals.speakerNames = names;
    return next();
  } catch (err) {
    next(err);
  }
});

app.use(
  '/',
  routes({
    feedbackService,
    speakerService,
  })
);

app.use((req, res, next) => {
  return next(createError(404, 'Page not found'));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  console.error(err);
  const status = err.status || 500;

  res.locals.status = status;
  res.status(status);
  res.render('error');
});

app.listen(port, () => {
  console.log(`Express Server is running on port ${port}!`);
});
