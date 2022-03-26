var db = require('../db/db');

class EmployeeLog {
  constructor(id) {
    this.id = id
  }
  
  async isInTheOffice() {
    const result = await db.execute("SELECT r.left_time from employees e, entries r WHERE e.id = r.employee_id AND e.id = $1 AND e.last_entry = r.id", [this.id])
    
    if (!result || result.rowCount === 0) {
      return false
    }
    
    return result.rows[0].left_time == 0
  }
  
  async arrive() {
    if (await this.isInTheOffice()) {
      console.log("Can't arrive if already in the office " + this.id)
      return false
    }
    
    const result = await db.execute("INSERT INTO entries (employee_id, arrived_time, left_time) VALUES ($1, $2, $3) RETURNING id", [this.id, Date.now(), 0])
    
    if (!result || result.rowCount !== 1) {
      return false
    }
    
    const updateResult = await db.execute("UPDATE employees SET last_entry = $1 WHERE id = $2", [result.rows[0].id, this.id])
    return updateResult && updateResult.rowCount > 0
  }
  
  async leave() {
    if (!await this.isInTheOffice()) {
      console.log("Can't leave the office if hasn't arrived " + this.id)
      return false
    }
    
    const result = await db.execute("UPDATE entries SET left_time = $1 WHERE id IN (SELECT last_entry FROM employees WHERE id = $2)", [Date.now(), this.id])
    return result && result.rowCount > 0
  }
  
  async toPrettyLogJson() {
    var prettyLog = []
    
    const result = await db.execute("SELECT arrived_time, left_time FROM entries WHERE employee_id = $1", [this.id])
    
    if (!result) {
      return prettyLog
    }
    
    for (const row of result.rows) {
      prettyLog.push({
        arriving: new Date(parseInt(row.arrived_time)).toLocaleString(),
        leaving: row.left_time == '0' ? "Still in the office" : new Date(parseInt(row.left_time)).toLocaleString()
      })
    }
    
    return prettyLog
  }
}

module.exports = EmployeeLog;
