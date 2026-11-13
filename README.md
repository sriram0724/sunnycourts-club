SunnyCourts Club API (NU-AIAGAI2C-G07)

Backend court-booking system built with Node.js, Express, and SQLite for BDF Group Assignment (Theme 7 of 30).

Folder Structure

sunnycourts-club/
├── db/
│   └── database.js
├── middleware/
│   └── validate.js
├── routes/
│   ├── courts.js
│   ├── players.js
│   └── reservations.js
├── utils/
│   └── smartSearch.js
├── package.json
├── server.js
└── SunnyCourts_Club.postman_collection.json


How to Run

Install dependencies:

npm install


Start the server:

npm start


Server runs at http://localhost:3000.

API Endpoints

Method

Endpoint

Description

GET

/courts

Get all courts

GET

/courts/:id

Get one court by ID

POST

/courts

Add a court (name, sport)

PUT

/courts/:id

Update a court (name, sport)

DELETE

/courts/:id

Delete a court

GET

/courts?sport=Tennis

Filter courts by sport

GET

/courts?q=word

Smart search (case-insensitive substring match on name or sport)

GET

/players

Get all players

POST

/players

Add a player

GET

/reservations

Join endpoint: reservations with player_name and court_name

POST

/reservations

Book a court slot (prevents double-booking)

DELETE

/reservations/:id

Cancel a reservation

Smart Search Twist Tests

GET /courts?q=court -> 200, matching courts

GET /courts?q=COURT -> 200, same matching courts

GET /courts?q=zzz -> 200, { "message": "Nothing found", "results": [] }