const Processes = require("../models/processes.model.js");
const Student = require("../models/student.model.js");
const Teacher = require("../models/teacher.model.js");

// Register students to teacher
exports.register = (req, res) => {
    // Validate request
    if (!req.body.teacher || !req.body.students) {
        res.status(400).send({
            message: "Please input both teacher and students email."
          });
          return;
    }
  
    // Create a TeacherStudent
    const ts = new Processes.TeacherStudent({
        teacher: req.body.teacher,
        students: req.body.students
    });
  
    // Register students to teacher
    Processes.register(ts, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while registering students to teacher."
        });
      else if (data === null) 
        res.status(404).send({
            message:
                "Teacher/student email not found."
        });
      else res.status(204).send();
    });
    return;
};

// Find common students
exports.commonstudents = (req, res) => {
    if (!req.query.teacher) {
        res.status(400).send({
            message: "Please input at least one teacher email."
        });
        return;
    }
    
    const cs = new Processes.ListOfTeachers({
        listOfTeachers: req.query.teacher
    });

    Processes.CommonStudents(cs, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving common students"
        });
        else if (data === null) 
            res.status(404).send({
                message:
                    "Teacher email not found / No common students."
            });
        else res.status(200).send(data);
    });
    return;
};

// Suspend student
exports.suspend = (req, res) => {
    // Validate request
    if (!req.body.student) {
        res.status(400).send({
            message: "Please input student email."
        });
        return;
    }

    const student = new Student({
        email: req.body.student
    });

    Processes.suspend(student, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while suspending student"
        });
        else if (data === null) 
            res.status(404).send({
                message:
                    "Student email not found."
            });
        else res.status(204).send();
    });


};

// Unsuspend student
exports.unsuspend = (req, res) => {
    // Validate request
    if (!req.body.student) {
        res.status(400).send({
            message: "Please input both student email."
        });
        return;
    }

    const student = new Student({
        email: req.body.student
    });

    Processes.unsuspend(student, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while unsuspending student"
        });
        else if (data === null) 
            res.status(404).send({
                message:
                    "Student email not found."
            });
        else res.status(204).send();
    });
};

// Retrieve students for notification
exports.retrievefornotifications = (req, res) => {
    // Validate request
    if (!req.body.teacher || !req.body.notification) {
        res.status(400).send({
            message: "Please input both teacher email and notification."
        });
        return;
    }

    let notification = req.body.notification;
    const teacher = new Teacher({
        email: req.body.teacher
    });

    Processes.retrievefornotifications(teacher, notification, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving for notification"
        });
        else if (data === null) 
            res.status(404).send({
                message:
                    "Teacher email not found."
            });
        else res.status(200).send(data);
    });
    return;

};