const express = require('express');
const postCotroller = require('../controllers/postController');
const shapefileCotroller = require('../controllers/shapefileController')
const router = express.Router();


// router.route('/').get(postCotroller.getAllPosts).post(postCotroller.createNewPost);

// router.route('/:id').get(postCotroller.getPostById).delete(postCotroller.deletePostById);

router.route('/').post(shapefileCotroller.uploadShapefile)

module.exports = router;