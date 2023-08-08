
/********************************************************************************** 
 * WEB700 – Assignment 04* I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
 * No part* of this assignment has been copied manually or electronically from any other source* (including 3rd party web sites) 
 * or distributed to other courses.**
 * 
 *   Name: Vincent Carl Elipe Student ID: 167943216 Date: July 12, 2023
 * Course Online (Cyclic) Link: https://creepy-eel-girdle.cyclic.app/
 * *********************************************************************************/

const collegeData = require('./modules/collegeData');
var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();

var path = require('path');


app.use(express.static('public'));
// Parse JSON data in the request body
app.use(express.json());

const exphbs = require('express-handlebars');
app.engine('.hbs', exphbs.engine({ 
  extname: '.hbs',
  helpers: { 
    equal: function (lvalue, rvalue, options) {if (arguments.length < 3)throw new Error("Handlebars Helper equal needs 2 parameters");if (lvalue != rvalue) {return options.inverse(this);} else {return options.fn(this);}},
    navLink: function(url, options){return '<li' +((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +'><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';},
  }

 }));

app.set('view engine', '.hbs');


app.use(function(req,res,next){let route = req.path.substring(1);app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));next();});



app.get('/', (req, res) => {  
  // let filePath = path.join(__dirname, 'views/home.html');
  // res.sendFile(filePath);
  res.render('home');
});

app.get('/about', (req, res) => {  
  // let filePath = path.join(__dirname, 'views/about.html');
  // res.sendFile(filePath);
  res.render('about');
});

app.get('/htmlDemo', (req, res) => {  
  // let filePath = path.join(__dirname, 'views/htmlDemo.html');
  // res.sendFile(filePath);
  res.render('htmlDemo');
});

app.get('/students', (req, res) => {
  var studentcode = req.query.course;
  // console.log(studentcode)
    studentcode = parseInt(studentcode);
    if(studentcode){
      // collegeData.initialize().then(() => {
        collegeData.getStudentsByCourse(studentcode).then(studentListBycourses => {
            result = studentListBycourses;
            res.send(result);
          }).catch(error => {
            result = 'getCoursesResult'+ error;
            res.send(result);
          });
    }else{
  // collegeData.initialize().then(() => {
    ////////////////
    collegeData.getAllStudents().then(
      function (data) {  
        
          if (data.length > 0) {
              res.render('students', { students: data });
            } else {
              res.render('students', { message: 'No results' });
            }
      }
      ).catch(function(reason){
          res.render("students", {message: "No results"});
      });
    ///////////////
  //   }).catch(error => {
  //     res.send(error);
  //   }
  // );
    }
})


app.get('/courses', (req, res) => { 
  collegeData.getCourses().then(
    function (data) {
        if (data.length > 0) {
            res.render('courses', { courses: data });
          } else {
            res.render('courses', { message: 'No results' });
          }

      }
    ).catch(function(reason){
        res.render("courses", {message: "No results"});
});
})

app.get("/course/:id", (req, res) => {
  
  collegeData.getCourseById(req.params.id).then(
  function (data) {   
      res.render("course", {course: data});

    }
  ).catch(function(reason){
      res.render("course", {message: "no results"});
});
});


app.get("/student/:num", (req, res) => {
            // initialize an empty object to store the values
    let viewData = {};
    collegeData.getStudentByNum(req.params.num).then((data) => {
    if (data) {
        viewData.student = data; //store student data in the "viewData" object as "student"
    } else {
        viewData.student = null; // set student to null if none were returned
    }
    }).catch(() => {
        viewData.student = null; // set student to null if there was an error
    }).then(collegeData.getCourses).then((data) => {
            viewData.courses = data; 
        for (let i = 0; i < viewData.courses.length; i++) {
        if (viewData.courses[i].courseId == viewData.student.course) {
            viewData.courses[i].selected = true;
        }
        }
    }).catch(() => {
        viewData.courses = []; // set courses to empty if there was an error
    }).then(() => {
        if (viewData.student == null) { // if no student - return an error
            res.status(404).send("Student Not Found");
        } else {
            res.render("student", { viewData: viewData }); // render the "student" view
        }
    });
});



// ---------------------- Default assign 4------------------------------------- //
const { addStudent } = require('./modules/collegeData');
// app.use(express.static(__dirname + '/public')); // for css
app.use(express.urlencoded({ extended: true }) ); 
app.get('/students/add', (req, res) => {  
  // let filePath = path.join(__dirname, 'views/addStudent.html');
  // res.sendFile(filePath);
  // res.render('addStudent');
  collegeData.getCourses()
        .then((courses) => {
        res.render("addStudent", { courses: courses });
        })
        .catch(() => {
        res.render("addStudent", { courses: [] });
        });
});

app.post("/students/add", (req, res) => {
  collegeData.addStudent(req.body).then(
      res.redirect('/students')
  ).catch(function(reason){
      console.log(reason);
});
});


app.post('/student/update', (req, res) => {
  //console.log(req.body);
  collegeData.updateStudent(req.body).then(
      res.redirect('/students')
  ).catch(function(reason){
      console.log(reason);
  });
 });

/////courses -- a6
app.get('/courses/add', (req, res) => {  
  res.render('addCourse');
});
app.post('/courses/add', (req, res) => {
  const newCourseData = {
    courseCode: req.body.courseCode,
    courseDescription: req.body.courseDescription,
  };
  collegeData.addCourse(newCourseData)
        .then(() => {
          res.redirect('/courses');
        })
        .catch((error) => {
          console.error('Error:', error);
          res.render('addCourse', { message: 'Error adding course' });
        });
    
});

app.post("/course/update", (req, res) => {
  collegeData.updateCourse(req.body).then(
      res.redirect('/courses')
  ).catch(function(reason){
      console.log(reason);
  });
});


app.get('/course/delete/:id', (req, res) => {
  const courseId = parseInt(req.params.id);
  
  collegeData.deleteCourseById(courseId)
      .then(() => {
          res.redirect('/courses');
      })
      .catch((error) => {
          console.error('Error:', error);
          res.status(500).send('Unable to Remove Course / Course not found');
      });
    
});


app.get('/student/delete/:studentNum', (req, res) => {
  const studentNum = parseInt(req.params.studentNum); 
  collegeData.deleteStudentByNum(studentNum)
      .then(() => {
          res.redirect('/students');
      })
      .catch(() => {
          res.status(500).send('Unable to Remove Student / Student not found');
      });
});



///end coursee

// ---------------------- Default ------------------------------------- //

app.get('*', (req, res) => {
  // res.status(404).send('Page Not Found');
  let filePath = path.join(__dirname, 'views/404.html');
  res.sendFile(filePath);
});


  collegeData.initialize().then(() => {
    app.listen(HTTP_PORT, ()=>{console.log("server listening on port: " + HTTP_PORT)});
    }).catch(error => {
      console.log(error);
    }
  );