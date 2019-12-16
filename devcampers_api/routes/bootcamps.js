const express = require ('express');
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
} = require ('../controllers/bootcamps');

const Bootcamp = require ('../models/Bootcamp');

const advancedResults = require ('../middleware/advancedResults');

// Include other resouce routers
const courseRouter = require ('./courses');

const router = express.Router ();

const {protect, authorize} = require ('../middleware/auth');

// Re-route into other resource routers
router.use ('/:bootcampId/courses', courseRouter);

router.route ('/radius/:zipcode/:distance').get (getBootcampsInRadius);

router
  .route ('/')
  .get (advancedResults (Bootcamp, 'courses'), getBootcamps)
  .post (protect, createBootcamp);

router
  .route ('/:id')
  .get (getBootcamp)
  .put (protect, authorize ('publisher', 'admin'), updateBootcamp)
  .delete (protect, authorize ('publisher', 'admin'), deleteBootcamp);

module.exports = router;