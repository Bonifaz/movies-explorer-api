const router = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { validate } = require('../utils/validate');

router.get('/movies', getMovies);
router.post('/movies', validate.createMovies, createMovie);
router.delete('/movies/:movieId', validate.deleteMovie, deleteMovie);

module.exports = router;
