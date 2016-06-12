'use strict'

const join = require('path').join
const Chai = require('chai')
const reload = require('require-reload')(require)

const PROJECT_ROOT = join(__dirname, '..', '..')

Chai.should()

describe('Database-Adapter', () => {
  const PROJECT_NAME = require(join(PROJECT_ROOT, 'package')).name
  const TESTED_MODULE = join(PROJECT_ROOT, 'src', 'api', 'db')
  process.env.NODE_ENV = 'test'
  let Adapter = reload(TESTED_MODULE)

  describe('When the database was not created', function () {
    beforeEach(function (done) {
      Adapter.instance.dbDrop(PROJECT_NAME + '_test')
      .run()
      .then(() => done() )
    })
    it('have eventually created test-db', (done) => {
      process.env.NODE_ENV = 'test'
      Adapter = reload(TESTED_MODULE)
      Adapter.instance.dbList()
      .contains(PROJECT_NAME + '_test')
      .run()
      .then((dbExists) => {
        dbExists.should.be.true
        done()
      })
    })
    it('have eventually created development-db', (done) => {
      process.env.NODE_ENV = 'development'
      Adapter = reload(TESTED_MODULE)
      Adapter.instance.dbList()
      .contains(PROJECT_NAME + '_development')
      .run()
      .then((dbExists) => {
        dbExists.should.be.true
        done()
      })
    })
  })

  describe('db', () => {
    it('should be test-db when in test-environment', (done) => {
      process.env.NODE_ENV = 'test'
      Adapter = reload(TESTED_MODULE)
      Adapter.db
      .tableCreate('testTable')
      .run()
      .then(() => {
        return Adapter.instance
        .db(PROJECT_NAME + '_test')
        .tableList()
        .run()
      })
      .then((result) => {
        result.indexOf('testTable').should.not.equal(-1)
        done()
      })
    })
  })
  after((done) => {
    Adapter.instance
    .dbDrop(PROJECT_NAME + '_test')
    .run()
    .then(() => {
      return Adapter.instance.getPoolMaster()
      .drain()
    })
    .then(() => done())
  })
})
