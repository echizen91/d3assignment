const Teacher = require("../models/teacher.model.js");

// Create and Save a new Teacher
exports.create = (req, res) => {
  // Validate request
  if (!req.body.email) {
    res.status(400).send({
       message: "Please input a teacher email." 
    });
    return;
}

  // Create a Teacher
  const teacher = new Teacher({
    email: req.body.email
  });

  // Save Teacher in the database
  Teacher.create(teacher, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Teacher."
      });
    else res.status(204).send();
  });
  return;
};

// Get all teachers
exports.getAll = (req, res) => {
    Teacher.getAll((err, data) => {
        if (err) {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving teachers."
          });
          return;
        }
        else res.status(200).send(data);
    });
    return;
};


// Delete Teacher
exports.delete = (req, res) => {
  // Validate request
  if (!req.body.email) {
    res.status(400).send({
       message: "Please input a teacher email." 
    });
    return;
}

  // Create a Teacher
  const teacher = new Teacher({
    email: req.body.email
  });

  // Save Teacher in the database
  Teacher.delete(teacher, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Teacher."
      });
    else res.status(204).send();
  });
  return;
};
