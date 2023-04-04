const express = require('express');
const userRouter = require('./routes/user.routes');
const postRouter = require('./routes/post.routes');
const profileRouter = require('./routes/profile.routes');
const courseRouter = require('./routes/course.routes');
const todoRouter = require('./routes/todo.routes');
const cors = require('cors');

const PORT = process.env.PORT ||8080;

const app = express();

app.use(express.json());
app.use(cors({
    origin: ["http://127.0.0.1:5500/"]
}));
app.use('/api', cors(), userRouter);
app.use('/api', cors(), postRouter);
app.use('/api', cors(), profileRouter);
app.use('/api', cors(), courseRouter);
app.use('/api', cors(), todoRouter);
app.listen(PORT, () => console.log(`server started on port ${PORT}`));

// cors origin передавать хосты с которого идут запросы 