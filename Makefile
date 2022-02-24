run-server:
	cd server; npm start

run-client:
	cd client; npm start

run: ;  make run-server & make run-client