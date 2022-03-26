const { Pool, Client } = require('pg')

class DB {
	constructor() {
		this.client = null
	}
	
	connect() {
		if (this.client != null) {
			console.log("Already connected to database")
			return false
		}
		
		this.client = new Client()
		this.client.connect()
		console.log("Successfully connected to DB")
	}
	
	execute(query, args) {
		return this.client.query(query, args)
	}
	
	createTables() {
		this.execute("CREATE TABLE IF NOT EXISTS employees (id SERIAL, name TEXT, last_entry INT)")
		this.execute("CREATE TABLE IF NOT EXISTS entries (id SERIAL, employee_id INT, arrived_time BIGINT, left_time BIGINT);")
	}
}

const db = new DB()

module.exports = db;
