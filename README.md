# CovidTimeWatch

A web server application that would help our office stay safe during a
global pandemic.

Implemented use cases:

 1. /employees/arrive - employee enters the office.
 2. /employees/leave - employee leaves the office.
 3. /employees/history - all past employee logs.
 4. /employees/positive - empolyee annouced positive for covid, output - all the employess that should go to quarantine.

## Run server

1. Clone this repo
2. Go to the newly created CovidTimeWatch directory
3. Run `npm install`
4. Make sure you have a postgres up and running, you may override the default values.
```
PGUSER=
PGHOST=
PGPASSWORD=
PGDATABASE=covid
PGPORT=
```
5. Run `./scripts/run-server.sh`

## Run client

1. Clone this repo
2. Go to the newly created CovidTimeWatch directory
3. Run `./scripts/client.sh`


Enjoy!
