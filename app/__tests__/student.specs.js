const superTest = require('supertest');
const chai = require('chai');
const expect = chai.expect;

const baseUrl = 'http://localhost:3000';
const base = superTest(baseUrl);

describe('Get All Students', () => {
    it('Verify Response',  async () => {
        let response = await base
                            .get('/api/getallstudents')
                            .then(response => {
                                return response;
                            });
        expect(response.status, 'Status Success').to.equal(200);
        expect(Array.isArray(response.body.students), 'Array of emails').to.equal(true);
    });
});

describe('Create/Delete Student', () => {
    // Ignore Insert
    it('Adding Duplicate Student',  async () => {
        let response = await base
                            .post('/api/addstudent')
                            .send({
                                email: "studenttest@gmail.com"
                            })
                            .then(response => {
                                return response;
                            });
        expect(response.status, 'Status Success with No Content').to.equal(204);

        response = await base
                        .post('/api/addstudent')
                        .send({
                            email: "studenttest@gmail.com"
                        })
                        .then(response => {
                            return response;
                        });
        expect(response.status, 'Status Success with No Content').to.equal(204);
    });

    it('Add then Delete Students',  async () => {
        let response = await base
                            .post('/api/addstudent')
                            .send({
                                email: "studenttest@gmail.com"
                            })
                            .then(response => {
                                return response;
                            });
        expect(response.status, 'Status Success with No Content').to.equal(204);

        response = await base
                        .post('/api/deletestudent')
                        .send({
                            email: "studenttest@gmail.com"
                        })
                        .then(response => {
                            return response;
                        });
        expect(response.status, 'Status Success with No Content').to.equal(204);
    });

    // Ignore Delete
    it('Delete student that is not in database',  async () => {
        let response = await base
                            .post('/api/deletestudent')
                            .send({
                                email: "studenttest@gmail.com"
                            })
                            .then(response => {
                                return response;
                            });
        expect(response.status, 'Status Success with No Content').to.equal(204);
    });
});