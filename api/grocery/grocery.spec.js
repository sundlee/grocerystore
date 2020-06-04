const request = require('supertest');
const should = require('should');
const app = require('../../');
const models = require('../../models');

describe('GET /groceries는', () => {
  const groceries = [{ name: 'tomato', price: 1 }, { name: 'onion', price: 2 }, { name: 'potato', price: 3 }];
  before(() => models.sequelize.sync({ force: true }));
  before(() => models.Grocery.bulkCreate(groceries));

  describe('성공시', () => {
    it('유저 객체를 담은 배열로 응답한다 ', (done) => {
      request(app)
          .get('/groceries')
          .end((err, res) => {
            res.body.should.be.instanceOf(Array);
            done();
          });
    });
    
    it('최대 limit 갯수만큼 응답한다 ', (done) => {
      request(app)
          .get('/groceries?limit=2')
          .end((err, res) => {
            res.body.should.have.lengthOf(2)
            done();
          });
    });
  });
  describe('실패시', () => {
    it('limit이 숫자형이 아니면 400을 응답한다', (done) => {
      request(app)
          .get('/groceries?limit=two')
          .expect(400)
          .end(done);
    })
  });
});

describe('GET /groceries/:id는', () => {
  const groceries = [{ name: 'tomato', price: 1 }, { name: 'onion', price: 2 }, { name: 'potato', price: 3 }];
  before(() => models.sequelize.sync({ force: true }));
  before(() => models.Grocery.bulkCreate(groceries));

  describe('성공시', () => {
    it('id가 1인 유저 객체를 반환한다', (done) => {
      request(app)
          .get('/groceries/1')
          .end((err, res) => {
            res.body.should.have.property('id', 1);
            done();
          });
    });
  });
  describe('실패시', () => {
    it('id가 숫자가 아닐경우 400으로 응답한다', (done) => {
      request(app)
          .get('/groceries/one')
          .expect(400)
          .end(done);
    });
    it('id로 유저를 찾을수 없을 경우 404로 응답한다', (done) => {
      request(app)
          .get('/groceries/999')
          .expect(404)
          .end(done);
    });
  })
});

describe('DELETE /groceries/:id', () => {
  const groceries = [{ name: 'tomato', price: 1 }, { name: 'onion', price: 2 }, { name: 'potato', price: 3 }];
  before(() => models.sequelize.sync({ force: true }));
  before(() => models.Grocery.bulkCreate(groceries));

  describe('성공시', () => {
    it('204를 응답한다', (done) => {
      request(app)
          .delete('/groceries/1')
          .expect(204)
          .end(done);
    })
  });
  describe('실패시', () => {
    it('id가 숫자가 아닐경우 400으로 응답한다', (done) => {
      request(app)
          .delete('/groceries/one')
          .expect(400)
          .end(done);
    });
  });
});

describe('POST /groceries', () => {
  const groceries = [{ name: 'tomato', price: 1 }, { name: 'onion', price: 2 }, { name: 'potato', price: 3 }];
  before(() => models.sequelize.sync({ force: true }));
  before(() => models.Grocery.bulkCreate(groceries));

  describe('성공시', () => {
    let name = 'garlic', price = 2,
        body;
    before(done => {
      request(app)
          .post('/groceries')
          .send({ name, price })
          .expect(201)
          .end((err, res) => {
            body = res.body;
            done();
          });
    });
    it('생성된 유저 객체를 반환한다', () => {
      body.should.have.property('id');
    });
    it('입력한 name을 반환한다', () => {
      body.should.have.property('name', name);
    });
    it('입력한 price를 반환한다', () => {
      body.should.have.property('price', price);
    })
  });
  describe('실패시', ()=> {
    it('price 파라미터 누락시 400을 반환한다', (done) => {
      request(app)
          .post('/groceries')
          .send({ name: 'cassava' })
          .expect(400)
          .end(done);
    });
    it('name 파라미터 누락시 400을 반환한다', (done) => {
      request(app)
          .post('/groceries')
          .send({ price: 5 })
          .expect(400)
          .end(done);
    });
    it("name이 중복일 경우 409를 반환한다", (done) => {
      request(app)
          .post('/groceries')
          .send({ name: 'garlic', price: 2 })
          .expect(409)
          .end(done);
    })
  })
});

describe('PUT /groceries/:id', () => {
  const groceries = [{ name: 'tomato', price: 1 }, { name: 'onion', price: 2 }, { name: 'potato', price: 3 }];
  before(() => models.sequelize.sync({ force: true }));
  before(() => models.Grocery.bulkCreate(groceries));
  
  describe('성공시', () => {
    it('변경된 name과 price를 응답한다', (done) => {
      const name = 'carrot';
      const price = 1;
      request(app)
          .put('/groceries/3')
          .send({ name, price })
          .end((err, res) => {
            res.body.should.have.property('name', name);
            res.body.should.have.property('price', price);
            done();
          });
    })
  });
  describe('실패시', () => {
    it('정수가 아닌 id일 경우 400을 응답한다', (done) => {
      request(app)
          .put('/groceries/one')
          .expect(400)
          .end(done);
    });
    it('name이 없을 경우 400을 응답한다', (done) => {
      request(app)
          .put('/groceries/1')
          .send({ price: 5 })
          .expect(400)
          .end(done);
    });
    it('price가 없을 경우 400을 응답한다', (done) => {
      request(app)
          .put('/groceries/1')
          .send({ name: 'cassava' })
          .expect(400)
          .end(done);
    });
    it('없는 제품의 id인 경우 404을 응답한다', (done) => {
      request(app)
          .put('/groceries/999')
          .send({ name: 'yam', price: 2 })
          .expect(404)
          .end(done);
    });
    it('이름이 중복일 경우 409을 응답한다', (done) => {
      request(app)
          .put('/groceries/3')
          .send({ name: 'tomato', price: 1 })
          .expect(409)
          .end(done);
    })
  })
})
