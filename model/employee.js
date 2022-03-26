var db = require('../db/db');

async function getEmployeeId(employeeName) {
	let result = await db.execute("SELECT id from employees WHERE name = $1", [employeeName])
	
	if (result && result.rowCount > 0) {
		return result.rows[0].id
	}
	
	result = await db.execute("INSERT INTO employees (name) VALUES ($1) RETURNING id", [employeeName])
	
	if (result && result.rowCount > 0) {
		return result.rows[0].id
	}
	
	return null
}

module.exports = getEmployeeId;
