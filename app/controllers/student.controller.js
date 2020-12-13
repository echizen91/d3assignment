const Student = require("../models/student.model.js");

// Create and Save a new Student
exports.create = (req, res) => {
  // Validate request
  if (!req.body.email) {
      res.status(400).send({
         message: "Please input a student email." 
      });
      return;
  }

  // Create a Student
  const student = new Student({
    email: req.body.email
  });

  // Save Student in the database
  Student.create(student, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Student."
      });
    else res.status(204).send();
  });
};

// Get all students
exports.getAll = (req, res) => {
    Student.getAll((err, data) => {
        if (err) {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving students."
          });
          return;
        }
        else res.status(200).send(data);
      });
    
};

// Delete student
exports.delete = (req, res) => {
  // Validate request
  if (!req.body.email) {
    res.status(400).send({
       message: "Please input a student email." 
    });
    return;
}

  // Create a Student
  const student = new Student({
    email: req.body.email
  });

  // Delete a student in the database
  Student.delete(student, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Student."
      });
    else res.status(204).send();
  });
  return;
};


