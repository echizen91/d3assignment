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

describe('Retrieve For Notification', () => {
    it('Request Body Empty',  async () => {
        // Retrieve For Notification
        let response = await base
                            .post('/api/retrievefornotifications')
                            .then(response => {
                                return response;
                            });
        expect(response.status, 'Bad Request').to.equal(400);
        expect(response.body.message, 'Error Message').to.equal("Please input both teacher email and notification.");

    });

    it('Request Body with only teacher email',  async () => {
        // Retrieve For Notification
        let response = await base
                            .post('/api/retrievefornotifications')
                            .send({
                                teacher: "teachertest@gmail.com"
                            })
                            .then(response => {
                                return response;
                            });
        expect(response.status, 'Bad Request').to.equal(400);
        expect(response.body.message, 'Error Message').to.equal("Please input both teacher email and notification.");
                            
    });

    it('Request Body with only notification',  async () => {
        // Retrieve For Notification
        let response = await base
                            .post('/api/retrievefornotifications')
                            .send({
                                notification: "Hello World! @student1@gmail.com"
                            })
                            .then(response => {
                                return response;
                            });
        expect(response.status, 'Bad Request').to.equal(400);
        expect(response.body.message, 'Error Message').to.equal("Please input both teacher email and notification.");
                            
    });

    it('Notification with no @mentions',  async () => {
        await preprocess();

        // Retrieve For Notification
        let response = await base
                            .post('/api/retrievefornotifications')
                            .send({
                                teacher: "teachertest@gmail.com",
                                notification: "Hello World!"
                            })
                            .then(response => {
                                return response;
                            });
        expect(response.status, 'Success Status').to.equal(200);
        expect(Array.isArray(response.body.recipents), 'Array of recipent').to.equal(true);
        expect(response.body.recipents[0], 'Correct Email').to.equal("studenttest@gmail.com");   
        
        await postprocess();
    });

    it('Notification with one @mentions',  async () => {
        await preprocess();

        // Retrieve For Notification
        let response = await base
                            .post('/api/retrievefornotifications')
                            .send({
                                teacher: "teachertest@gmail.com",
                                notification: "Hello World! @notif@gmail.com"
                            })
                            .then(response => {
                                return response;
                            });
        expect(response.status, 'Success Status').to.equal(200);
        expect(Array.isArray(response.body.recipents), 'Array of recipent').to.equal(true);
        expect((response.body.recipents).length, 'Length of 2').to.equal(2);
        
        await postprocess();
    });
});
