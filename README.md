# NodeJS API Assessment

### Database Schema
```
CREATE DATABASE d3assignment;

/* Teachers Information */
CREATE TABLE teachers (
    id INT NOT NULL AUTO_INCREMENT,
    email NVARCHAR(320) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE(email)
);

/* Students Information */
CREATE TABLE students (
    id INT NOT NULL AUTO_INCREMENT,
    email NVARCHAR(320) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE(email)
);

/* Students Attached to Teacher Information */
CREATE TABLE teacher_attached_students (
    teacher_id INT NOT NULL,
    student_id INT NOT NULL,
    suspended BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    UNIQUE(teacher_id, student_id)
);

/* Sample Data Teachers */
INSERT INTO teachers (teacher_email) VALUES ('teacherken@gmail.com');
INSERT INTO teachers (teacher_email) VALUES ('teacherjoe@gmail.com');

INSERT INTO students (student_email) VALUES ('studentjon@gmail.com');
INSERT INTO students (student_email) VALUES ('studenthon@gmail.com');
INSERT INTO students (student_email) VALUES ('commonstudent1@gmail.com');
INSERT INTO students (student_email) VALUES ('commonstudent2@gmail.com');
INSERT INTO students (student_email) VALUES ('student_only_under_teacher_ken@gmail.com');
INSERT INTO students (student_email) VALUES ('studentmary@gmail.com');
INSERT INTO students (student_email) VALUES ('studentagnes@gmail.com');
INSERT INTO students (student_email) VALUES ('studentmiche@gmail.com');
INSERT INTO students (student_email) VALUES ('studentbob@gmail.com');
```

### API Functions
#### 1. As a teacher, I want to register one or more students to a specified teacher.
- POST /api/register
    - Headers: Content-Type: application/json
    - Success response status: HTTP 204
    - Request Body Sample:
        ```
        {
            "teacher": "teacherken@gmail.com"
            "students":
                [
                    "studentjon@gmail.com",
                    "studenthon@gmail.com"
                ]
        }
        ```
#### 2. As a teacher, I want to retrieve a list of students common to a given list of teachers (i.e. retrieve students who are registered to ALL of the given teachers).
- GET /api/commonstudents
    - Success response status: HTTP 200
    - Request example 1: GET /api/commonstudents?teacher=teacherken%40gmail.com
    - Success response body 1:
        ```
        {
            "students" :
            [
                "commonstudent1@gmail.com", 
                "commonstudent2@gmail.com",
                "student_only_under_teacher_ken@gmail.com"
            ]
        }
        ```
    - Request example 2: GET /api/commonstudents?teacher=teacherken%40gmail.com&teacher=teacherjoe%40gmail.com
    - Success response body 2:
        ```
        {
            "students" :
                [
                    "commonstudent1@gmail.com", 
                    "commonstudent2@gmail.com"
                ]
        }
        ```
#### 3. As a teacher, I want to suspend a specified student.
- POST /api/suspend
    - Headers: Content-Type: application/json
    - Success response status: HTTP 204
    - Request body example:
        ```
        {
            "student" : "studentmary@gmail.com"
        }
        ```
#### 4. As a teacher, I want to retrieve a list of students who can receive a given notification.
- POST /api/retrievefornotifications
    - Headers: Content-Type: application/json
    - Success response status: HTTP 200
    - Request body example 1:
        ```
        {
            "teacher":  "teacherken@gmail.com",
            "notification": "Hello students! @studentagnes@gmail.com @studentmiche@gmail.com"
        }
        ```
    - Success response body 1:
        ```
        {
        "recipients":
            [
                "studentbob@gmail.com",
                "studentagnes@gmail.com", 
                "studentmiche@gmail.com"
            ]   
        }
        ```
    - Request body example 2:
        ```
        {
            "teacher":  "teacherken@gmail.com",
            "notification": "Hey everybody"
        }
        ```
    - Success response body 2:
        ```
        {
        "recipients":
            [
                "studentbob@gmail.com"
            ]   
        }
        ```

