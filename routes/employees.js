const express = require('express');
const getEmployeeId = require('../model/employee');
const EmployeeLog = require('../model/employeeLog');
const overlaps = require('../model/employeesOverlaps');
const router = express.Router();

router.post('/arrive', async function(req, res, next) {
  if (!req.body || !req.body.name) {
    res.status(500).send('missing employee name')
    return
  }
  
  const employeeName = req.body.name
  const id = await getEmployeeId(employeeName)
  
  if (id == null) {
    res.status(500).send('error getting employee id')
  }
  
  const employeeLog = new EmployeeLog(id)
  
  if (!employeeLog.arrive()) {
    return res.status(500).send('arrive failed');
  }
  
  overlaps.employeeArrived(id)
  
  res.status(200).send('ok');
});

router.post('/leave', async function(req, res, next) {
  if (!req.body || !req.body.name) {
    res.status(500).send('missing employee name')
    return
  }
  
  const employeeName = req.body.name
  const id = await getEmployeeId(employeeName)
  
  if (id == null) {
    res.status(500).send('error getting employee id')
  }
  
  const employeeLog = new EmployeeLog(id)
  
  if (!employeeLog.leave()) {
    return res.status(500).send('leave failed');
  }
  
  overlaps.employeeLeft(id)
  
  res.status(200).send('ok');
});

router.post('/positive', async function(req, res, next) {
  if (!req.body || !req.body.name) {
    res.status(500).send('missing employee name')
    return
  }
  
  const employeeName = req.body.name
  const id = await getEmployeeId(employeeName)
  
  if (id == null) {
    res.status(500).send('error getting employee id')
  }
  
  const quarantinedEmployees = await overlaps.getQuarantinedEmployees(id)
  
  for (otherEmployee of quarantinedEmployees) {
      console.log(otherEmployee + " should go to quarantine")
  }
  
  res.status(200).send('ok');
});

router.get('/history', async function(req, res, next) {
  if (!req.query || !req.query.name) {
    res.status(500).send('missing employee name')
    return
  }
  
  const employeeName = req.query.name
  const id = await getEmployeeId(employeeName)
  
  if (id == null) {
    res.status(500).send('error getting employee id')
  }
  
  const employeeLog = new EmployeeLog(id)
  return res.status(200).send(JSON.stringify(await employeeLog.toPrettyLogJson()))
});

module.exports = router;
