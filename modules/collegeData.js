const Sequelize = require('sequelize');
var sequelize = new Sequelize('dpugdcfe', 'dpugdcfe', '1k8iKpentTIQh4rMGcvhbvqfkCMfLTAS', {
          host: 'trumpet.db.elephantsql.com',
          dialect: 'postgres',
          port: 5432,
          dialectOptions: {
          ssl: { rejectUnauthorized: false }
          },
          query:{ raw: true }
});

// Create studnet table model
const Student = sequelize.define('student', {
  studentNum: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  addressStreet: Sequelize.STRING,
  addressCity: Sequelize.STRING,
  addressProvince: Sequelize.STRING,
  TA: Sequelize.BOOLEAN,
  status: Sequelize.STRING,
});

// Create course table model
const Course = sequelize.define('course', {
  courseId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  courseCode: Sequelize.STRING,
  courseDescription: Sequelize.STRING,
});

// Define the relationship: Course has many Students
Course.hasMany(Student, { foreignKey: 'course' });

// -----------------------

// #crete db coonnection
function initialize() {
  return new Promise((resolve, reject) => {
    sequelize.sync().then(() => {
        console.log('Models synced successfully.');
        resolve();
      }).catch((error) => {
        console.error('Error syncing models:', error);
        reject('Unable to sync the database');
      });
  });
}

function getAllStudents() {
  return new Promise((resolve, reject) => {
    Student.findAll()
      .then((students) => {
        if (students.length === 0) {
          reject('No results returned');
        } else {
          resolve(students);
        }
      })
      .catch((error) => {
        console.error('Error getting all students:', error);
        reject('Error getting students');
      });
  });
}

function getCourses() {
  return new Promise((resolve, reject) => {
    Course.findAll()
      .then((courses) => {
        // console.log(courses)
        if (courses.length === 0) {
          reject('No results returned');
        } else {
          resolve(courses);
        }
      })
      .catch((error) => {
        console.error('Error getting all courses:', error);
        reject('Error getting courses');
      });
  });
}

function getCourseById(id){
  return new Promise((resolve, reject) => {
    Course.findAll({
      where: {
        courseId: id,
      },
    })
      .then((courses) => {
        if (courses.length === 0) {
          reject('No results returned');
        } else {
          resolve(courses[0]); // Only provide the first object
        }
      })
      .catch((error) => {
        console.error('Error getting course by ID:', error);
        reject('Error getting course');
      });
  });
}

function getStudentsByCourse(courseID) {
  return new Promise((resolve, reject) => {
    Student.findAll({
      where: {
        course: course,
      },
    })
      .then((students) => {
        if (students.length === 0) {
          reject('No results returned');
        } else {
          resolve(students);
        }
      })
      .catch((error) => {
        console.error('Error getting students by course:', error);
        reject('Error getting students');
      });
  });  
}

function getStudentByNum(num){
  return new Promise((resolve, reject) => {
    Student.findAll({
      where: {
        studentNum: num,
      },
    })
      .then((students) => {
        if (students.length === 0) {
          reject('No results returned');
        } else {
          resolve(students[0]); // Only provide the first object
        }
      })
      .catch((error) => {
        console.error('Error getting student by number:', error);
        reject('Error getting student');
      });
  });
}

function updateStudent(studentData){
  studentData.TA = studentData.TA ? true : false;
  for (const prop in studentData) {
    if (studentData[prop] === "") {
      studentData[prop] = null;
    }
  }
  return new Promise((resolve, reject) => {
    Student.update(studentData, {
      where: {
        studentNum: studentData.studentNum,
      },
    })
      .then(() => {
        resolve();
      })
      .catch((error) => {
        console.error('Error updating student:', error);
        reject('Unable to update student');
      });
  });
}

function addStudent(studentData) {
  
  studentData.TA = studentData.TA ? true : false;
  
  for (const data in studentData) {
    if (studentData[data] === "") {
      studentData[data] = null;
    }
  }
  return new Promise((resolve, reject) => {
    Student.create(studentData)
      .then(() => {
        console.log(studentData);
        resolve();

      })
      .catch((error) => {
        console.error('Error adding student:', error);
        reject('Unable to create student');
      });
  });
}

////////courses////////////
function addCourse(courseData){
  for (const data in courseData) {
    if (courseData[data] === '') {
      courseData[data] = null;
    }
  }
  return new Promise((resolve, reject) => {
    Course.create(courseData)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        console.error('Error adding course:', error);
        reject('Unable to create course');
      });
  });
}

function updateCourse(courseData){
  for (const data in courseData) {
    if (courseData[data] === '') {
      courseData[data] = null;
    }
  }
  return new Promise((resolve, reject) => {
    Course.update(courseData, {
      where: {
        courseId: courseData.courseId,
      },
    })
      .then(() => {
        resolve();
      })
      .catch((error) => {
        console.error('Error updating course:', error);
        reject('Unable to update course');
      });
  });
}
function deleteCourseById(id){
  return new Promise((resolve, reject) => {
    Course.destroy({
      where: {
        courseId: id,
      },
    })
      .then((affectedRows) => {
        if (affectedRows > 0) {
          resolve();
        } else {
          reject('Course not found');
        }
      })
      .catch((error) => {
        console.error('Error deleting course:', error);
        reject('Error deleting course');
      });
  });
}

function deleteStudentByNum(studentNum){
  return new Promise((resolve, reject) => {
    Student.destroy({
      where: {
        studentNum: studentNum,
      },
    })
      .then((affectedRows) => {
        if (affectedRows > 0) {
          resolve();
        } else {
          reject('Student not found');
        }
      })
      .catch((error) => {
        console.error('Error deleting student:', error);
        reject('Error deleting student');
      });
  });
}




module.exports = {
  initialize,
  getAllStudents,
  getCourses,
  getCourseById,
  getStudentsByCourse,
  getStudentByNum,
  addStudent,
  updateStudent,
  updateCourse,
  addCourse,
  deleteCourseById,
  deleteStudentByNum
};
