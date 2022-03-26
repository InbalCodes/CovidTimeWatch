
CREATE DATABASE covid;
CREATE TABLE IF NOT EXISTS employees (id SERIAL, name TEXT, lastEntry INT);
CREATE TABLE IF NOT EXISTS entries (id SERIAL, employeeId INT, arrivedTime BIGINT, leftTime BIGINT);
