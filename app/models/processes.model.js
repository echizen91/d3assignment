const sql = require("./db.js");

// Constructor
const Processes = {
};

// Register Constructor
Processes.TeacherStudent = function(ts) {
    this.teacher = ts.teacher
    this.students = ts.students
}

// Common Student Constructor
Processes.ListOfTeachers = function(teachers) {
    this.listOfTeachers = teachers.listOfTeachers;
}

// Find teacher id
findTeacherId = (teacher, result) => {
    // Retrieve Teacher's ID - there will only be one match if any
    sql.query("SELECT * FROM teachers WHERE email = ?", teacher, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return err;
        }
        if (res.length > 0) {
            console.log("teacher retrieved: ", { id: res[0].id, email: res[0].email });
            result(null, res[0].id);
        } else {
            console.log("no teacher found.")
            result(null, null);
        }
        
        return;
    });
};

// Find student ids
findStudentIds = (students, result) => {
    sql.query("SELECT * FROM students WHERE email IN (?)", [students], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return err;
        }
        if (res.length > 0) {
            let output = []
            for (i=0; i<res.length; i++) {
                console.log("student retrieved: ", { id: res[i].id, email: res[i].email });
                output.push(res[i].id)
            }
            result(null, output);
        } else {
            console.log("no students found.")
            result(null, null);
        }
        
        return;
    });
};

// Registration
registerStudents = (params, result) => {
    sql.query("INSERT IGNORE INTO teacher_attached_students (teacher_id, student_id) VALUES ?;", [params], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return err;
        }
        result(null, {success: true});
        return;
    });
};

// Register students to teacher 
Processes.register = (ts, result) => {
    findTeacherId(ts.teacher, (err, data) => {
        let teacherId = data;
        
        // if err
        if (err) {
            result(err, null);
            return;
        }

        // if no teacher with specified email is found
        if (teacherId === null) {
            result(null, null)
            return;
        }

        findStudentIds(ts.students, (err, data) => {
            let studentIds = data;

            // if err
            if (err) {
                result(err, null);
                return;
            }

            // if no students with specified email is found
            if (studentIds === null) {
                result(null, null) 
                return;
            }

            // register students to teacher
            let params = []
            for (i=0; i<studentIds.length; i++) {
                let param = []
                param.push(teacherId, studentIds[i])
                params.push(param);
            }  

            registerStudents(params, (err, data) => {
                // if err
                if (err) {
                    result(err, null);
                    return;
                }
                result(null, data);
                return;
            });

        });
    });
     
};

Processes.CommonStudents = (cs, result) => {
    // if there is only one email
    if (!Array.isArray(cs.listOfTeachers)) {
        sql.query(  "SELECT s.email " +
                    "FROM teachers AS t " +
                    "INNER JOIN teacher_attached_students AS ts ON t.id = ts.teacher_id " +
                    "INNER JOIN students AS s ON s.id = ts.student_id " +
                    "WHERE t.email = ?;", cs.listOfTeachers, (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return err;
            }
            
            if (res.length > 0) {
                let output = []
                for (i=0;i<res.length;i++) {
                    output.push(res[i].email);
                }
                result(null, { students: output });
                return;
            }

            result(null, null);
            return;
        });
    } else {
        sql.query(  "SELECT s.email " +
                    "FROM teachers AS t " +
                    "INNER JOIN teacher_attached_students AS ts ON t.id = ts.teacher_id " +
                    "INNER JOIN students AS s ON s.id = ts.student_id " +
                    "WHERE t.email IN (?) " +
                    "GROUP BY s.email " +
                    "HAVING COUNT(s.email) > 1;" , [cs.listOfTeachers], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return err;
            }
            
            if (res.length > 0) {
                // console.log("here");
                let output = []
                for (i=0;i<res.length;i++) {
                    output.push(res[i].email);
                }
                result(null, { students: output });
                return;
            }

            result(null, null);
            return;
        });
    }
    return;
};

// Suspend Student for all teachers
Processes.suspend = (student, result) => {
    findStudentIds([student.email], (err, data) => {
        let studentIds = data;

        // if err
        if (err) {
            result(err, null);
            return;
        }

        // if no students with specified email is found
        if (studentIds === null) {
            result(null, null) 
            return;
        }

        // there will only be one id
        studentId = studentIds[0]

        sql.query(  "UPDATE teacher_attached_students AS ts " +
                    "SET ts.suspended = TRUE " + 
                    "WHERE ts.student_id = ? ", studentId, (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return err;
            }

            result(null, { success: true });
            return;
        });

    });
};

// Suspend Student for all teachers
Processes.unsuspend = (student, result) => {
    findStudentIds([student.email], (err, data) => {
        let studentIds = data;

        // if err
        if (err) {
            result(err, null);
            return;
        }

        // if no students with specified email is found
        if (studentIds === null) {
            result(null, null) 
            return;
        }

        // there will only be one id
        studentId = studentIds[0]

        sql.query(  "UPDATE teacher_attached_students AS ts " +
                    "SET ts.suspended = FALSE " + 
                    "WHERE ts.student_id = ? ", studentId, (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return err;
            }

            result(null, { success: true });
            return;
        });

    });
};

// Retrieve for notifications
Processes.retrievefornotifications = (teacher, notification, result) => {
    // extract emails from notification
    let emails = notification.match(/@([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);

    // remove @ from email array
    let emailsProcessed = []
    if (emails) {
        for (i=0; i<emails.length; i++) {
            emailsProcessed.push(emails[i].substring(1, emails[i].length))
        }
    }
    
    findTeacherId(teacher.email, (err, data) => {
        let teacherId = data;
        
        // if err
        if (err) {
            result(err, null);
            return;
        }

        // if no teacher with specified email is found
        if (teacherId === null) {
            result(null, null)
            return;
        }

        sql.query(  "SELECT s.email " +
                    "FROM teacher_attached_students AS ts " +
                    "INNER JOIN students AS s ON s.id = ts.student_id " +
                    "WHERE ts.teacher_id = ?;", teacherId, (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return err;
            }

            if (res.length > 0) {
                for(i=0; i<res.length; i++) {
                    emailsProcessed.push(res[i].email);
                }
            } 

            // remove same emails if any
            let deduplicate = new Set(emailsProcessed);
                
            result(null, { recipents: [...deduplicate]})

            return;
        });

    });
};

module.exports = Processes;