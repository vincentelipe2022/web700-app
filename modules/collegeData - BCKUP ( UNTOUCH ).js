
const fs = require('fs');
const path = require('path');

// const studPathInModuleDIR = path.join(__dirname, 'data', 'students.json');
// var studentsFilePath = studPathInModuleDIR.replace("\\modules", ""); 

// const coursePathInModuleDIR = path.join(__dirname, 'data', 'courses.json');
// var coursesFilePath  coursePathInModuleDIR.replace("\\modules", ""); 

var studentsFilePath = path.join('data', 'Refsnes', '..', 'students.json');
var coursesFilePath = path.join('data', 'Refsnes', '..', 'courses.json');

// console.log(studentsFilePath)
// console.log(coursesFilePath)
class Data {
  constructor(students, courses) {
    this.students = students;
    this.courses = courses;
  }
}

let dataCollection = null;
function initialize() {
  return new Promise((resolve, reject) => {
      fs.readFile(studentsFilePath, 'utf8', (studErr, studentDataFile) => {
      fs.readFile(coursesFilePath, 'utf8', (courseErr, courseDataFile) => {
        studentErrMessage = 'Unable to read students.json';
        courseErrMessage = 'Unable to read courses.json';
        if(studErr&&courseErr){
          reject( studentErrMessage + ' and '+ courseErrMessage);          
          return;
        }else if(studErr){
          reject(studentErrMessage);          
          return;
        }else if (courseErr) {
          reject(courseErrMessage);
          return;
        }else{
          const students = JSON.parse(studentDataFile);
          const courses = JSON.parse(courseDataFile);  
          dataCollection = new Data(students, courses);          
          resolve();
        }
      });
    });
  });
}


function getAllStudents() {
  return new Promise((resolve, reject) => {
    if (dataCollection.students.length > 0) {
      resolve(dataCollection.students);
    } else {
      reject("No results returned");
    }
  });
}

function getCourses() {
  return new Promise((resolve, reject) => {
    if (dataCollection.courses.length > 0) {
      resolve(dataCollection.courses);
    } else {
      reject("No results returned");
    }
  });
}
function getCourseById(id){
  return new Promise(function (resolve, reject) {
    allCoursesData = dataCollection.courses;
    if(allCoursesData.length <= 0){
      reject("No result returned"); 
      return;
    }
    for (let i = 0; i < allCoursesData.length; i++) {
      if(allCoursesData[i].courseId == id){
          resolve(allCoursesData[i]);
          return;
      }
    }
    reject("no results returned"); 
    return;
  });
}
// function getTAs() {
//   return new Promise((resolve, reject) => {
//     if (dataCollection.students.length > 0) {
//       const tas = dataCollection.students.filter(student => student.TA === true);
//       resolve(tas);
//     } else {
//       reject("No results returned");
//     }
//   });
// }

// Assign 3

function getStudentsByCourse(courseID) {
  return new Promise((resolve, reject) => {
    if (dataCollection.students.length > 0) {
      const studentListBycourses = dataCollection.students.filter(student => student.course === courseID);
      resolve(studentListBycourses);
    } else {
      reject("No results returned");
    }
  });
}

// function getStudentByNum(studeNUm) {
  
//   return new Promise((resolve, reject) => {
//     if (dataCollection.students.length > 0) {
//       const studentListByNum = dataCollection.students.filter(student => student.studentNum === studeNUm);
//       console.log(studentListByNum);
//       resolve(studentListByNum);
//     } else {
//       reject("No results returned");
//     }
//   });
// }
function getStudentByNum(num){
  return new Promise(function (resolve, reject) {
    studentData = dataCollection.students;
    if(studentData.length <= 0){
      reject("No result returned"); // Rejecting promise if error occours
      return;
    }
    for (let i = 0; i < studentData.length; i++) {
      if(studentData[i].studentNum == num){
          resolve(studentData[i]);
          return;
      }
    }
    reject("no results returned"); // Rejecting promise if error occours
    return;
  });
}
function updateStudent(studentData){
  return new Promise(function (resolve, reject) {
    if(studentData.length == 0){
      reject("No result returned"); // Rejecting promise if error occours
      return;
    }
    // console.log(dataCollection.students[1]);
    
    a=0
    for(i=0; i < dataCollection.students.length; i++){
      if(studentData.studentNum == dataCollection.students[i].studentNum){
        console.log(studentData.firstName)
        a=i
        dataCollection.students[i].firstName = studentData.firstName
        dataCollection.students[i].lastName = studentData.lastName
        dataCollection.students[i].email = studentData.email
        dataCollection.students[i].addressStreet = studentData.addressStreet
        dataCollection.students[i].addressCity = studentData.addressCity
        dataCollection.students[i].addressProvince = studentData.addressProvince
        dataCollection.students[i].TA = (typeof studentData.TA === 'undefined') ? false : true;
        dataCollection.students[i].status = studentData.status
        dataCollection.students[i].course = studentData.course
      }
    }
    console.log(dataCollection.students[a])
    resolve(studentData);
    return
  });
}
/////////////////////////////////
// function addStudent(studentData) {
//   const { firstName,lastName,email,addressStreet,addressCity,
//     addressProvince,TA,status,course
//   } = studentData;

//   const student = {
//     studentNum: dataCollection.students.length+1,
//     firstName,
//     lastName,
//     email,addressStreet,addressCity,
//     addressProvince,TA,status,course
//   };

//   dataCollection.students.push(student);

//   return dataCollection.students;
// }

// function addStudent(studentData) {
//   const { firstName,lastName,email,addressStreet,addressCity,
//     addressProvince,TA,status,course
//   } = studentData;

//   const student = {
//     studentNum: dataCollection.students.length+1,
//     firstName,
//     lastName,
//     email,addressStreet,addressCity,
//     addressProvince,TA,status,course
//   };
//   const studjsonData = JSON.parse(fs.readFileSync(studentsFilePath, 'utf8'));
//   console.log(studjsonData);
//   dataCollection.students.push(student);
//   // return dataCollection.students;
//  // Write the updated data back to the JSON file
// //  const filePath = 'data/students.json';
//  fs.writeFile(studentsFilePath, JSON.stringify(dataCollection), (err) => {
//    if (err) {
//      console.error('Error writing JSON file:', err);
//    } else {
//      console.log('Data pushed to JSON file successfully.');
//    }
//  });
// }
function addStudent(studentData) {
  const { firstName, lastName, email, addressStreet,
     addressCity, addressProvince, TA, status, course } = studentData;

  const student = {
    studentNum: dataCollection.students.length + 1,
    firstName,
    lastName,
    email,
    addressStreet,
    addressCity,
    addressProvince,
    TA,
    status,
    course
  };
  dataCollection.students.push(student);
  fs.writeFile(studentsFilePath, JSON.stringify(dataCollection.students), (err) => {
    if (err) {
      console.error('Error writing JSON file:', err);
    } else {
      console.log('Data pushed to JSON file successfully.');
    }
  });

  return new Promise((resolve, reject) => {
    if (dataCollection.students.length > 0) {
      resolve(dataCollection.students);
    } else {
      reject("No results returned");
    }
  });
}



module.exports = {
  initialize,
  getAllStudents,
  // getTAs,
  getCourses,
  getCourseById,
  getStudentsByCourse,
  getStudentByNum,
  addStudent,
  updateStudent
};
