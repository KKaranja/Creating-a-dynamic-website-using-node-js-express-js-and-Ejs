const express = require('express');

const speakersRouter = require('./speakers');
const feedbackRouter = require('./feedback');

const router = express.Router();

module.exports = (params) => {
  const { speakerService } = params;

  router.get('/', async (req, res, next) => {
    // return next(new Error('some error'));
    try {
      const artwork = await speakerService.getAllArtwork();
      const topSpeakers = await speakerService.getList();
      return res.render('layout', {
        pageTitle: 'Welcome',
        template: 'index',
        topSpeakers,
        artwork,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.use('/speakers', speakersRouter(params));

  router.use('/feedback', feedbackRouter(params));

  return router;
};
