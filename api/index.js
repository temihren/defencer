import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

const players = [];

const R = () => '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');

app.get("/getPlayers", (req, res) => {
    console.log(players);
    res.json(players);
});

app.get("/login", (req, res) => {
    console.log(req.query.player);
    const newPlayer = R();
    players.push(newPlayer);

    res.json(newPlayer);
});

app.listen(3001, () => console.log("Server ready on port 3001."));

export default app;
