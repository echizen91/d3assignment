const superTest = require('supertest');
const chai = require('chai');
const expect = chai.expect;

const baseUrl = 'http://localhost:3000';
const base = superTest(baseUrl);

preprocess = async () => {
    // Pre-processes (Create Teacher and Student)
    await base.post('/api/addteacher').send({
        email: "teachertest@gmail.com"
    });

    await base.post('/api/addstudent').send({
        email: "studenttest@gmail.com"
    });

    await base.post('/api/register').send({
        teacher: "teachertest@gmail.com",
        students: ["studenttest@gmail.com"]
    });
};

postprocess = async () => {
     // Post-processes (Delete Teacher and Student)
     await base.post('/api/deleteteacher').send({
         email: "teachertest@gmail.com"
     });
     

     await base.post('/api/deletestudent').send({
         email: "studenttest@gmail.com"
     });
};

describe('Suspending Student', () => {
    it('Request Body Empty',  async () => {
        await preprocess();

        // Suspend a student
        let response = await base
                            .post('/api/suspend')
                            .then(response => {
                                return response;
                            });
        expect(response.status, 'Bad Request').to.equal(400);
                            
        await postprocess();
    });

    it('Student in database',  async () => {
        await preprocess();

        // Suspend a student
        let response = await base
                            .post('/api/suspend')
                            .send({
                                student: "studenttest@gmail.com"
                            })
                            .then(response => {
                                return response;
                            });
        expect(response.status, 'Success Status with No Content').to.equal(204);
                            
        await postprocess();
    });

    it('Student not in database',  async () => {
        // Suspend a student
        let response = await base
                            .post('/api/suspend')
                            .send({
                                student: "studenttest@gmail.com"
                            })
                            .then(response => {
                                return response;
                            });
        expect(response.status, 'Not Found').to.equal(404);
        expect(response.body.message, "Error Message").to.equal("Student email not found.");
    });
});