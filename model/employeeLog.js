class EmployeeLog {
  constructor(name) {
    this.name = name
    this.entries = []
  }
  
  isInTheOffice() {
    if (this.entries.length <= 0) {
      return false
    }
    
    return this.entries[this.entries.length - 1].leaving == 0
  }
  
  arrive() {
    if (this.isInTheOffice()) {
      console.log("Can't arrive if already in the office " + this.name)
      return false
    }
    
    this.entries.push({
      arriving: Date.now(),
      leaving: 0
    })
    
    return true
  }
  
  leave() {
    if (!this.isInTheOffice()) {
      console.log("Can't leave the office if hasn't arrived " + this.name)
      return false
    }
    
    this.entries[this.entries.length - 1].leaving = Date.now()
    return true
  }
  
  toPrettyLogJson() {
    var prettyLog = []
    
    for (var i = 0; i < this.entries.length; i++) {
      var entry = this.entries[i]
      
      prettyLog.push({
        arriving: new Date(entry.arriving).toLocaleString(),
        leaving: new Date(entry.leaving).toLocaleString()
      })
    }
    
    return prettyLog
  }
}

module.exports = EmployeeLog;
