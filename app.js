const express = require('express')
const http = require('http')
const app = express()
const db = require('./models')
const bodyParser = require('body-parser')
const port = 3000
const {
  sequelize,
  Student,
  Course,
} = require("./models");

require('dotenv').config()

// app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/// enroll a student for a course
app.post('/students/:studentId/enroll', async (req, res) => {
  const student_id = req.params.studentId;
  const { course_id } = req.body;

  try {
    const student = await Student.findByPk(student_id);

    const course = await Course.findByPk(course_id);

    const result = await student.addCourse(course);

    return res.json({
      status: true,
      message: "student enrolled for course",
      student: student,
      course: course,
     });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
})


/// get all students
app.get('/students', async (req, res) => {
  try {
    const students = await Student.findAll();

    return res.json({
      status: true,
      message: "list of students returned",
      students: students
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
})

/// get a single student
app.get('/student/:id', async (req, res) => {
  const uuid = req.params.id;

  try {
    const student = await Student.findOne({
      where: { id: uuid },
      include: {
        model: Course,
        through: {
         attributes: []
        }
      },
    });

    return res.json({
      status: true,
      message: "student retrived",
      student: student
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
})

/// get all courses
app.get('/courses', async (req, res) => {
  try {
    const courses = await Course.findAll();

    return res.json({
      status: true,
      message: "list of courses returned",
      students: courses
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
})

/// get a single course
app.get('/course/:id', async (req, res) => {
  const uuid = req.params.id;

  try {
    const course = await Course.findOne({
      where: { id: uuid },
    });

    return res.json({
      status: true,
      message: "course retrived",
      course: course
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
})

/// create a student
app.post('/student', async (req, res) => {
  const { first_name, last_name, gender, dob, email, phone_number } = req.body;

  try {
    const student = await Student.create({
      first_name,
      last_name,
      gender,
      dob,
      email,
      phone_number
    });

    return res.json({
      status: true,
      message: "student created",
      student: student
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: false,
      message: err
    });
  }
})


/// create a course
app.post('/course', async (req, res) => {
  const { title, credit_score, course_code } = req.body;

  try {
    const course = await Course.create({
      title,
      credit_score,
      course_code
    });

    return res.json({
        status: true,
        message: "course created",
        student: course
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
})

const server = http.createServer((req, res) => {
  console.log('request made')
})

db.sequelize.sync({ force: false }).then(function () {
  app.listen(port, 'localhost', () => {
    console.log(`Example app listening on port ${port}`)
  })
});
