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

describe('Register students to teacher', () => {
    it('Empty Request Body',  async () => {
        let response = await base
                            .post('/api/register')
                            .then(response => {
                                return response;
                            });
        expect(response.status, 'Bad Request').to.equal(400);
        expect(response.body.message, "Error Message").to.equal("Please input both teacher and students email.");
    });

    it('No teacher email input',  async () => {
        let response = await base
                            .post('/api/register')
                            .send({
                                students: ["common@gmail.com"]
                            })
                            .then(response => {
                                return response;
                            });
        expect(response.status, 'Bad Request').to.equal(400);
        expect(response.body.message, "Error Message").to.equal("Please input both teacher and students email.");
    });

    it('No student email input',  async () => {
        let response = await base
                            .post('/api/register')
                            .send({
                                teacher: "common@gmail.com"
                            })
                            .then(response => {
                                return response;
                            });
        expect(response.status, 'Bad Request').to.equal(400);
        expect(response.body.message, "Error Message").to.equal("Please input both teacher and students email.");
    });

    it('Teacher or student email not found in database',  async () => {
        let response = await base
                            .post('/api/register')
                            .send({
                                teacher: "common@gmail.com",
                                students: ["commonstudent1@gmail.com"]
                            })
                            .then(response => {
                                return response;
                            });
        expect(response.status, 'Not Found').to.equal(404);
        expect(response.body.message, "Error Message").to.equal("Teacher/student email not found.");
    });

    it('Successful Registering',  async () => {
        await preprocess();

        // Test registering
        let response = await base
                            .post('/api/register')
                            .send({
                                teacher: "teachertest@gmail.com",
                                students: ["studenttest@gmail.com"]
                            })
                            .then(response => {
                                return response;
                            });
        expect(response.status, 'Success Status With No Content').to.equal(204);

        await postprocess();
    });
});