import express from "express";

const app = express();
const http = require("http").createServer(app);

const players: string[] = [];

const R = () => Math.floor(Math.random() + 10);

app.get("/getPlayers", (req, res) => {
    res.json(players);
});

app.get("/login", (req, res) => {
    const newPlayer = `#${R()}${R()}${R()}${R()}${R()}${R()}`;
    players.push(newPlayer);

    res.json(newPlayer);
});

app.get("/", (req, res) => res.send("Express on Vercel"));

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;
