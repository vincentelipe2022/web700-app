
/********************************************************************************** 
 * WEB700 – Assignment 04* I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
 * No part* of this assignment has been copied manually or electronically from any other source* (including 3rd party web sites) 
 * or distributed to other students.**
 * 
 *   Name: Vincent Carl Elipe Student ID: 167943216 Date: July 12, 2023
 * 
 * Online (Cyclic) Link: https://creepy-eel-girdle.cyclic.app/
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
        // })
        // .catch(error => {
        //   res.send(error);
        // });
    }else{
  // collegeData.initialize().then(() => {
    ////////////////
      collegeData.getAllStudents().then(students => {        
        // res.send(students);
        res.render('students', {
          data: students
      });
      }).catch(error => {
        res.json({ message: 'No results' });
      });
    ///////////////
  //   }).catch(error => {
  //     res.send(error);
  //   }
  // );
    }
})

// app.get('/tas', (req, res) => { 
//   // res.send('Hello tas!')
//   collegeData.initialize().then(() => {
//     ////////////////
//     collegeData.getTAs().then(tas => {
//         result =   tas;
//         if(result.length>0){
//           res.send(result);
//         }else{
//           res.json({ message: 'No results' });
//         }        
//       }).catch(error => {                
//         res.json(error);
//       });
//     ///////////////
//     }).catch(error => {
//       res.send(error);
//     }
//   );
// })


app.get('/courses', (req, res) => { 
  // res.send('Hello tas!')
  collegeData.initialize().then(() => {
  // res.send('Hello course!')
    ////////////////
    collegeData.getCourses().then(course => {
        // result =   course;
        if(course.length>0){
          // res.send(result);
          res.render("courses",
                    {course: course}
                    );

        }else{
          res.json({ message: 'No results' });
        }        
      }).catch(error => {                
        res.json(error);
      });
    ///////////////
    }).catch(error => {
      res.send(error);
    }
  );
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


app.get('/student/:num', (req, res) => { 
  // res.send(req.params.num)
//   var studeNum = req.params.num;
//   studeNum = parseInt(studeNum);
//   collegeData.initialize().then(() => {
//   // res.send(studeNum)
//   collegeData.getStudentByNum(studeNum).then(studentListBycourses => {
//     result =   studentListBycourses;
//     if(result.length>0){
//       res.send(result);
//     }else{
//       res.json({ message: 'No results' });
//     }        
//     }).catch(error => {
//       res.json(error);
//     });
//   })
//   .catch(error => {
//     res.send(error);
//   }
// );
collegeData.getStudentByNum(req.params.num).then(

            
  function (studentData) {  
    // console.log(studentData)
      collegeData.getCourses().then(
          function (coursesData) {
              res.render("student",
                      {student: studentData,
                      courses: coursesData});
  
            }
          ).catch(function(reason){
              res.render("courses", {message: "no results"});
      });             
    }
  ).catch(function(reason){
      res.render("student", {message: "no results"});
});
});




// ---------------------- Default assign 4------------------------------------- //
const { addStudent } = require('./modules/collegeData');
// app.use(express.static(__dirname + '/public')); // for css
app.use(express.urlencoded({ extended: true }) ); 
app.get('/students/add', (req, res) => {  
  // let filePath = path.join(__dirname, 'views/addStudent.html');
  // res.sendFile(filePath);
  res.render('addStudent');
});

app.post('/students/add', async (req, res) => {
  // console.log(req.body);
  // console.log(req.body.TA);
  if (req.body.TA=== undefined) {
    req.body.TA= false;
  } else if( req.body.TA=== 'on' ) {
    req.body.TA= true;
  }
  // console.log(req.body.TA);
  var studentData = req.body;
  try {
    await collegeData.initialize();
    const result = await collegeData.addStudent(studentData);
    if (result.length > 0) {
      res.send(result);
    } else {
      res.json({ message: 'No results' });
    }
  } catch (error) {
    res.json(error);
  }
});

app.post('/student/update', (req, res) => {
  //console.log(req.body);
  collegeData.updateStudent(req.body).then(
      res.redirect('/students')
  ).catch(function(reason){
      console.log(reason);
  });
 });
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