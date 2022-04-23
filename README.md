# WebTerm
The Terminal that runs in your browser and on a local server  
## Usage
To use it, we need a backend and a frontend. First, we start the server.
### Direct run with Node.js
```shell
cd server
npm start
```
### Run client with Parcel
```shell
cd client
npm start
```
## *Or* we can use `pkg` to compile
`pkg` is a JavaScript packaging software, i.e. compiling
```shell
cd server
pkg .
```
Then, we start the executable in .
Finally, start a server in client/dist to run the frontend.
