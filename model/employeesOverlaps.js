var db = require('../db/db');

const QUARANTINE_TIME = 1000 * 60 * 60 * 24 * 7

class EmployeesOverlaps {
  constructor() {
    this.currentlyInTheOffice = new Set()
    this.overlaps = {}
  }
  
  async loadFromDB() {
    const now = Date.now()

    const arrivedResult = await db.execute("select arrived_time, employee_id from entries WHERE left_time = 0 OR left_time > $1 ORDER BY arrived_time", [now - QUARANTINE_TIME])
    const leftResult = await db.execute("select left_time, employee_id from entries WHERE left_time = 0 OR left_time > $1 ORDER BY left_time", [now - QUARANTINE_TIME])
    const arrivedRows = arrivedResult.rows
    const leftRows = leftResult.rows
    let arrivedIndex = 0
    let leftIndex = 0
    
    while (arrivedIndex < arrivedRows.length || leftIndex < leftRows.length) {
      const currentArrived = arrivedIndex < arrivedRows.length ? arrivedRows[arrivedIndex] : {arrived_time:now.toString()}
      const currentLeft = leftIndex < leftRows.length ? leftRows[leftIndex] : {left_time:now.toString()}
      
      if (parseInt(currentArrived.arrived_time) < parseInt(currentLeft.left_time)) {
        arrivedIndex++
        
        if (parseInt(currentArrived.arrived_time) == now) {
          continue
        }
        
        this.employeeArrived(currentArrived.employee_id)
      } else {
        leftIndex++
        
        if (parseInt(currentLeft.left_time) == 0 || parseInt(currentLeft.left_time) == now) {
          continue
        }
        
        this.employeeLeft(currentLeft.employee_id, parseInt(currentLeft.left_time))
      }
    }
  }
  
  employeeArrived(employeeId) {
    this.currentlyInTheOffice.add(employeeId)
  }
  
  employeeLeft(employeeId, currentDate = Date.now()) {
    this.currentlyInTheOffice.delete(employeeId)
    
    if (!this.overlaps[employeeId]) {
      this.overlaps[employeeId] = {}
    }
    
    const employeeOverlaps = this.overlaps[employeeId]
    
    this.currentlyInTheOffice.forEach(otherEmployee => {
      employeeOverlaps[otherEmployee] = currentDate
      
      if (!this.overlaps[otherEmployee]) {
        this.overlaps[otherEmployee] = {}
      }
      
      this.overlaps[otherEmployee][employeeId] = currentDate
    });
  }
  
  async getQuarantinedEmployees(employeeId) {
    if (!this.overlaps[employeeId]) {
      return []
    }
    
    const employeeOverlaps = this.overlaps[employeeId]
    const ids = []
    
    for (const otherEmployeeId in employeeOverlaps) {
      const lastMetTime = employeeOverlaps[otherEmployeeId]
      
      if (Date.now() - QUARANTINE_TIME < lastMetTime) {
        ids.push(otherEmployeeId)
      }
    }
    
    const result = await db.execute("SELECT name FROM employees WHERE id = ANY($1::int[])", [ids])
    
    if (!result || result.rowCount == 0) {
      return []
    }
    
    return result.rows.map(e => e.name)
  }
}

const overlaps = new EmployeesOverlaps()

module.exports = overlaps
