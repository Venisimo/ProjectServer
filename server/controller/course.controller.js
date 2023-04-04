const db = require('../db')

class CourseController {
    async createCourse(req, res) {
        const {courseName, courseDescription, experience, material, cover} = req.body;
        const newCourse = await db.query(`INSERT INTO courses (course_name, course_description, experience, material, cover) values ($1, $2, $3, $4, $5) RETURNING *`, 
        [courseName, courseDescription, experience, material, cover]);
        res.json(newCourse.rows[0]);
    }
    async getCourses(req, res) {
        const courses = await db.query(`SELECT * FROM courses`);
        res.json(courses.rows);
    }
    async getCourseById(req, res) {
        const course_id = req.params.course_id;
        const course = await db.query(`SELECT * FROM courses where course_id = $1`, [course_id]);
        res.json(course.rows[0]);
    }
    async updateCourse(req, res) {
        const {courseId, courseName, courseDescription, material, experience, cover} = req.body;
        const course = await db.query(`UPDATE courses set course_name = $2, course_description = $3, material = $4, experience = $5, cover = $6 where course_id = $1 RETURNING *`,
        [courseId, courseName, courseDescription, material, experience, cover]);
        res.json(course.rows[0]);
    }
    async deleteCourse(req, res) {
        const courseId = req.params.courseId;
        const course = await db.query(`DELETE FROM courses where course_id = $1`, [courseId]);
        res.json(course.rows[0]);
        
    }
    async countCourse(req, res) {
        const count = req.params.count;
        const courses = await db.query(`SELECT * FROM courses LIMIT '${count}'`);
        res.json(courses.rows);
    }
}

module.exports = new CourseController();