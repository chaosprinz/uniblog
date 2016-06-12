'use strict'

const join = require('path').join
const PROJECT_NAME = require(join(process.cwd(), 'package')).name

let dbName = PROJECT_NAME
switch (process.env.NODE_ENV) {
case 'test':
  dbName += '_test'
  break
case 'production':
  dbName += '_production'
  break
case 'staging':
  dbName += '_staging'
  break
default:
  dbName += '_development'
}

const Adapter = {}

Adapter.instance = require('rethinkdbdash')({silent: true})

 // Check if the database for the actual environment exist
 // and create it, if not
Adapter.instance.dbList()
.contains(dbName)
.do((dbExists) => {
  return Adapter.instance.branch(
    dbExists,
    { dbs_created: 0},
    Adapter.instance.dbCreate(dbName)
  )
})
.run()

Adapter.db = Adapter.instance.db(dbName)
module.exports = Adapter
