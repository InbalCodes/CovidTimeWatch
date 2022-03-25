
curl -X "POST" -H "Content-Type: application/json" -d '{"name":"david"}' localhost:3000/employees/arrive
curl -X "POST" -H "Content-Type: application/json" -d '{"name":"inbal"}' localhost:3000/employees/arrive
sleep 0.1
curl -X "POST" -H "Content-Type: application/json" -d '{"name":"david"}' localhost:3000/employees/leave
sleep 0.1
curl -X "POST" -H "Content-Type: application/json" -d '{"name":"barak"}' localhost:3000/employees/arrive
sleep 2

echo "positive"
curl -X "POST" -H "Content-Type: application/json" -d '{"name":"david"}' localhost:3000/employees/positive

# curl "localhost:3000/employees/history?name=$employee_name"
