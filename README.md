# nodejs-simple-bowling-calculator

This is a simple Node.js app which implements an HttpServer / API that calculates scores during a game of ten pin bowling. Also this app uses a JSON file as a permanent storage.

## Quick start

- Make sure that you have Node.js and npm installed.
- Clone this repo using git clone --depth=1 https://github.com/maximsaltanov/nodejs-simple-bowling-calculator.git <YOUR_PROJECT_NAME>
- Move to the appropriate directory: cd <YOUR_PROJECT_NAME>.
- Run 'npm install' in order to install dependencies
- Create a '* .json' file to store the game results and specify a path to it in the config.json ({"storagePath": "<path_to_game.json file>"})
- At this point you can run 'npm start' or 'npm run dev' to see the example app at http://localhost:8000.
- Use 'npm test' to run the test suite

## Tech

- Node.js
- Nodemon
- Mocha
- Chai

## API Contract

It implements three methods:

```
POST /game
Clears all previous results and starts a new game 
Code: 204 OK
Body: no content
```

```
PUT /scores
Adds frame with rolls results in it. Method accepts JSON object. 
Code: 200 OK
Body: 
{
  "first": 3, // required
  "second": 4, // required
  "third": 0 // optional
}
```

```
GET /scores	
Returns results of all frames so far and the total score as a JSON object:
Code: 200 OK
Body:
{
  "frames": [
    {"first": 3, "second": 4},
    {"first": 10, "second": 0},
    ... 
  ],
  "total": 17
}
```

## Examples

```
PUT /scores HTTP/1.1
Host: localhost:8000
Connection: close
Accept: */*
User-Agent: Mozilla/4.0 (compatible; esp8266 Lua; Windows NT 5.1)
Content-Type: application/json
Content-Length: 26

{"first":"1","second":"8"}
```

```
GET http://localhost:8000/scores HTTP/1.1
Host: localhost:8000
Connection: close
Accept: */*
User-Agent: Mozilla/4.0 (compatible; esp8266 Lua; Windows NT 5.1)
```

```
POST /game HTTP/1.1
Host: localhost:8000
Connection: close
Accept: */*
User-Agent: Mozilla/4.0 (compatible; esp8266 Lua; Windows NT 5.1)
```

## Rules of bowling

A game consists of ten frames. Frame 1-9 are composed of two rolls. Frame 10 can be composed of up to three rolls depending on if the first rolls in the frame is a strike or a spare.

Each frame can have one of three marks:
- Strike: all 10 pins where knocked down with the first roll.
- Spare: all 10 pins where knocked down using two rolls.
- Open: some pins were left standing after the frame was completed.

When calculating the total score, the sum of the score for each frame is used:

- For an open frame the score is the total number of pins knocked down.
- For a strike, the score is 10 + the sum of the two rolls in the following frame.
- For a spare, the score is 10 + the number of pins knocked down in the first roll of the following frame.

The tenth frame may be composed of up to three rolls: the bonus roll(s) following a strike or spare in the tenth (sometimes referred to as the eleventh and twelfth frames) are fill ball(s) used only to calculate the score of the mark rolled in the tenth.
