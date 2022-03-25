const express = require('express');
const EmployeeLog = require('../model/employeeLog');
const EmployeesOverlaps = require('../model/EmployeesOverlaps');
const router = express.Router();

const employees = {}
const overlaps = new EmployeesOverlaps()

router.post('/arrive', function(req, res, next) {
  if (!req.body || !req.body.name) {
    res.status(500).send('missing employee name')
    return
  }
  
  const employeeName = req.body.name
  let employeeLog = employees[employeeName]
  
  if (!employeeLog) {
    employees[employeeName] = new EmployeeLog(employeeName)
    employeeLog = employees[employeeName]
  }
  
  if (!employeeLog.arrive()) {
    return res.status(500).send('arrive failed');
  }
  
  overlaps.employeeArrived(employeeName)
  
  res.status(200).send('ok');
});

router.post('/leave', function(req, res, next) {
  if (!req.body || !req.body.name) {
    res.status(500).send('missing employee name')
    return
  }
  
  const employeeName = req.body.name
  const employeeLog = employees[employeeName]
  
  if (!employeeLog) {
    return res.status(500).send('not in the office');
  }
  
  if (!employeeLog.leave()) {
    return res.status(500).send('leave failed');
  }
  
  overlaps.employeeLeft(employeeName)
  
  res.status(200).send('ok');
});

router.post('/positive', function(req, res, next) {
  if (!req.body || !req.body.name) {
    res.status(500).send('missing employee name')
    return
  }
  
  const employeeName = req.body.name
  const employeeLog = employees[employeeName]
  
  if (!employeeLog) {
    return res.status(200).send('wasnt in the office');
  }
  
  const quarantinedEmployees = overlaps.getQuarantinedEmployees(employeeName)
  
  for (otherEmployee in quarantinedEmployees) {
      console.log(otherEmployee + " should go to quarantine")
  }
  
  res.status(200).send('ok');
});

router.get('/history', function(req, res, next) {
  if (!req.query || !req.query.name) {
    res.status(500).send('missing employee name')
    return
  }
  
  const employeeName = req.query.name
  const employeeLog = employees[employeeName]
  
  if (!employeeLog) {
    return res.status(200).send('no log');
  }
  
  return res.status(200).send(JSON.stringify(employeeLog.toPrettyLogJson()))
});

module.exports = router;
