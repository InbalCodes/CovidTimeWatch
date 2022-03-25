const A_WEEK_IN_MILLIS = 1000 * 60 * 60 * 24 * 7

class EmployeesOverlaps {
  constructor() {
    this.currentlyInTheOffice = new Set()
    this.overlaps = {}
  }
  
  employeeArrived(employeeName) {
    this.currentlyInTheOffice.add(employeeName)
  }
  
  employeeLeft(employeeName) {
    this.currentlyInTheOffice.delete(employeeName)
    
    if (!this.overlaps[employeeName]) {
      this.overlaps[employeeName] = {}
    }
    
    const employeeOverlaps = this.overlaps[employeeName]
    const currentDate = Date.now()
    
    currentlyInTheOffice.forEach(otherEmployee => {
      employeeOverlaps[otherEmployee] = currentDate
      
      if (!overlaps[otherEmployee]) {
        this.overlaps[otherEmployee] = {}
      }
      
      this.overlaps[otherEmployee][employeeName] = currentDate
    });
  }
  
  getQuarantinedEmployees(employeeName) {
    if (!this.overlaps[employeeName]) {
      return []
    }
    
    const employeeOverlaps = this.overlaps[employeeName]
    const result = []
    
    for (otherEmployee in employeeOverlaps) {
      const lastMetTime = employeeOverlaps[otherEmployee]
      
      if (Date.now() - A_WEEK_IN_MILLIS < lastMetTime) {
        result.push(otherEmployee)
      }
    }
    
    return result
  }
}

module.exports = EmployeesOverlaps;
