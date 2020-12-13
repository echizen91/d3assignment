const sql = require("./db.js");

// constructor
const Teacher = function(teacher) {
    this.email = teacher.email
};

// Create new teacher with email
Teacher.create = (teacher, result) => {
  sql.query("INSERT IGNORE INTO teachers SET ?", teacher, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return err;
    }

    console.log("created teacher: ", { id: res.insertId, ...teacher });
    result(null, {});
  });
}

// Get all teachers created
Teacher.getAll = result => {
  sql.query("SELECT * FROM teachers", (err, res) => {
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
      result(null, { teachers: output });
      return;
    }
    // console.log("teachers: ", res);
    result(null, { teachers: []});
  });
}

// Delete teacher
Teacher.delete = (teacher, result) => {
  sql.query("DELETE FROM teachers WHERE email = ?;", teacher.email, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return err;
    }

    console.log("deleted teacher: ", { id: res.insertId, ...teacher });
    result(null, {});
  });
}

module.exports = Teacher;
