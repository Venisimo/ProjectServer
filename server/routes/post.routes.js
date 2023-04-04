const Router = require('express')
const router = new Router()
const postController = require('../controller/post.controller')

router.post('/post', postController.createPost);
router.get('/post', postController.getPostsByUser);
router.put('/post', postController.updatePost);
router.put('/post/like', postController.likePost);
router.put('/post/dislike', postController.dislikePost);
router.put('/post/unlike', postController.unLikePost);
router.put('/post/undislike', postController.unDislikePost);
router.delete('/post/:comment_id', postController.deletePost);


module.exports = router;