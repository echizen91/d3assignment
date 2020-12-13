module.exports = app => {
    const teacher = require("../controllers/teacher.controller.js")
    const student = require("../controllers/student.controller.js")

    const processes = require("../controllers/processes.controller.js")

    /******************* 
    * Helper API calls *
    ********************/

    // Add new teacher
    app.post("/api/addteacher", teacher.create);
    app.get("/api/getallteachers", teacher.getAll);
    app.post("/api/deleteteacher", teacher.delete);

    // Add new student
    app.post("/api/addstudent", student.create);
    app.get("/api/getallstudents", student.getAll);
    app.post("/api/deletestudent", student.delete);


    /******************************* 
    * Assignment related API calls *
    ********************************/
    // API [1] - Register
    app.post("/api/register", processes.register);

    // API [2] - Common Students
    app.get("/api/commonstudents", processes.commonstudents);

    // API [3] - Suspend Student
    app.post("/api/suspend", processes.suspend);
    app.post("/api/unsuspend", processes.unsuspend);

    // API [4] - Notification
    app.post("/api/retrievefornotifications", processes.retrievefornotifications);
}