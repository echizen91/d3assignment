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

    await base.post('/api/addteacher').send({
        email: "teachertest2@gmail.com"
    });

    await base.post('/api/addstudent').send({
        email: "studenttest@gmail.com"
    });

    await base.post('/api/addstudent').send({
        email: "studenttest2@gmail.com"
    });

    await base.post('/api/addstudent').send({
        email: "notsupposedtoappear@gmail.com"
    });

    await base.post('/api/register').send({
        teacher: "teachertest@gmail.com",
        students: ["studenttest@gmail.com", "studenttest2@gmail.com"]
    });

    await base.post('/api/register').send({
        teacher: "teachertest2@gmail.com",
        students: ["studenttest@gmail.com", "studenttest2@gmail.com", "notsupposedtoappear@gmail.com"]
    });
};

postprocess = async () => {
    // Post-processes (Delete Teacher and Student)
    await base.post('/api/deleteteacher').send({
        email: "teachertest@gmail.com"
    });

    await base.post('/api/deleteteacher').send({
        email: "teachertest2@gmail.com"
    });

    await base.post('/api/deletestudent').send({
        email: "studenttest@gmail.com"
    });

    await base.post('/api/deletestudent').send({
        email: "studenttest2@gmail.com"
    });

    await base.post('/api/deletestudent').send({
        email: "notsupposedtoappear@gmail.com"
    });
};

describe('Common Students', () => {
    it('Request Params Empty',  async () => {
        let response = await base
                            .get('/api/commonstudents')
                            .then(response => {
                                return response;
                            });
        expect(response.status, 'Bad Request').to.equal(400);
        expect(response.body.message, "Error Message").to.equal("Please input at least one teacher email.");
    });

    it('One - Two Teachers in Params',  async () => {
        await preprocess();

        // Test one teacher
        let response = await base
                            .get('/api/commonstudents?teacher=teachertest@gmail.com')
                            .then(response => {
                                return response;
                            });

        // console.log(response.body.students);
        expect(response.status, 'Success Status').to.equal(200);
        expect(Array.isArray(response.body.students), "Array of Students").to.equal(true);            
        expect(response.body.students[0], 'Correct Email').to.equal("studenttest@gmail.com");

        // Test two teacher
        response = await base
                            .get('/api/commonstudents?teacher=teachertest@gmail.com&teacher=teachertest2@gmail.com')
                            .then(response => {
                                return response;
                            });
                        
        expect(response.status, 'Success Status').to.equal(200);
        expect(Array.isArray(response.body.students), "Array of students").to.equal(true);
        expect((response.body.students).length, "Length should be 2").to.equal(2);

        await postprocess();
    });

    it('One Teacher in Params but not in Database',  async () => {
        // Test one teacher
        let response = await base
                            .get('/api/commonstudents?teacher=teachertest@gmail.com')
                            .then(response => {
                                return response;
                            });
                        
        expect(response.status, 'Not Found').to.equal(404);
        expect(response.body.message, "Error Message").to.equal("Teacher email not found / No common students.");
    });

    it('Two Teacher in Params but one is not in database',  async () => {
        await preprocess();

        // Test two teacher
        let response = await base
                            .get('/api/commonstudents?teacher=teachertest@gmail.com&teacher=teachertest3@gmail.com')
                            .then(response => {
                                return response;
                            });
                        
        expect(response.status, 'Not Found').to.equal(404);
        expect(response.body.message, "Error Message").to.equal("Teacher email not found / No common students.");

        await postprocess();
    });

});