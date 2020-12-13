const superTest = require('supertest');
const chai = require('chai');
const expect = chai.expect;

const baseUrl = 'http://localhost:3000';
const base = superTest(baseUrl);

describe('Get All Teachers', () => {
    it('Verify Response',  async () => {
        let response = await base
                            .get('/api/getallteachers')
                            .then(response => {
                                return response;
                            });
        expect(response.status, 'Status Success').to.equal(200);
        expect(Array.isArray(response.body.teachers), 'Array of emails').to.equal(true);
    });
});

describe('Create/Delete Teacher', () => {
    // Ignore Insert
    it('Adding Duplicate Teacher',  async () => {
        let response = await base
                            .post('/api/addteacher')
                            .send({
                                email: "teachertest@gmail.com"
                            })
                            .then(response => {
                                return response;
                            });
        expect(response.status, 'Status Success with No Content').to.equal(204);

        response = await base
                        .post('/api/addteacher')
                        .send({
                            email: "teachertest@gmail.com"
                        })
                        .then(response => {
                            return response;
                        });
        expect(response.status, 'Status Success with No Content').to.equal(204);
    });

    it('Add then Delete Teachers',  async () => {
        let response = await base
                            .post('/api/addteacher')
                            .send({
                                email: "teachertest@gmail.com"
                            })
                            .then(response => {
                                return response;
                            });
        expect(response.status, 'Status Success with No Content').to.equal(204);

        response = await base
                        .post('/api/deleteteacher')
                        .send({
                            email: "teachertest@gmail.com"
                        })
                        .then(response => {
                            return response;
                        });
        expect(response.status, 'Status Success with No Content').to.equal(204);
    });

    // Ignore Delete
    it('Delete teacher that is not in database',  async () => {
        let response = await base
                            .post('/api/deleteteacher')
                            .send({
                                email: "teachertest@gmail.com"
                            })
                            .then(response => {
                                return response;
                            });
        expect(response.status, 'Status Success with No Content').to.equal(204);
    });
});