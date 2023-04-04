const db = require('../db')

class PostController {
    async createPost(req, res) {
        const {comment_text, comment_date, user_id, course_id} = req.body;
        const newPost = await db.query(`INSERT INTO comments (comment_text, comment_date, user_id, course_id) values ($1, $2, $3, $4) RETURNING *`, 
        [comment_text, comment_date, user_id, course_id]);
        res.json(newPost.rows[0]);
    }

    async getPostsByUser(req, res) {
        const user_id = req.query.user_id;
        const posts = await db.query(`SELECT * FROM comments where user_id = $1`, [user_id]);
        res.json(posts.rows);
    }
    async updatePost(req, res) {
        const {comment_id, comment_text} = req.body;
        const post = await db.query(`UPDATE comments set comment_text = $2 where comment_id = $1 RETURNING *`,
        [comment_id, comment_text]);
        res.json(post.rows);
    }
    async likePost(req, res) {
        const {comment_id} = req.body;
        const post = await db.query(`UPDATE comments set comment_like = comment_like + 1 where comment_id = $1 RETURNING *`,
        [comment_id]);
        res.json(post.rows);
    }
    async unLikePost(req, res) {
        const {comment_id} = req.body;
        const post = await db.query(`UPDATE comments set comment_like = comment_like - 1 where comment_id = $1 RETURNING *`,
        [comment_id]);
        res.json(post.rows);
    }
    async dislikePost(req, res) {
        const {comment_id} = req.body;
        const post = await db.query(`UPDATE comments set dislike = dislike + 1 where comment_id = $1 RETURNING *`,
        [comment_id]);
        res.json(post.rows);

    }
    async unDislikePost(req, res) {
        const {comment_id} = req.body;
        const post = await db.query(`UPDATE comments set dislike = dislike - 1 where comment_id = $1 RETURNING *`,
        [comment_id]);
        res.json(post.rows);

    }
    async deletePost(req, res) {
        const comment_id = req.params.comment_id;
        const post = await db.query(`DELETE FROM comments where comment_id = $1`, [comment_id]);
        res.json(post.rows[0]);
        
    }
}


module.exports = new PostController();