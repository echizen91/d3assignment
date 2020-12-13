const sql = require("./db.js");

// constructor
const Student = function(student) {
    this.email = student.email
};

Student.create = (newStudent, result) => {
    sql.query("INSERT IGNORE INTO students SET ?", newStudent, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return err;
        }
    
        console.log("created student: ", { id: res.insertId, ...newStudent });
        result(null, { id: res.insertId, ...newStudent });
      });
}

// Get all students created
Student.getAll = result => {
    sql.query("SELECT * FROM students", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.length > 0) {
        let output = [];
        for (i=0; i<res.length; i++) {
          output.push(res[i].email)
        }
        result(null, { students: output });
        return;
      }
      
      result(null, { students: []});
    });
}

// Delete student
Student.delete = (student, result) => {
    sql.query("DELETE FROM students WHERE email = ?;", student.email, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return err;
      }
  
      console.log("deleted student: ", { id: res.insertId, ...student });
      result(null, {});
    });
}

module.exports = Student;
