import  express from "express";
const app = express();
import http from "http"

http.createServer(app);

const players = [];

const R = () => Math.floor(Math.random() + 10);

app.use(express.static('public'));

app.get("/getPlayers", (req, res) => {
    res.json(players);
});

app.get("/login", (req, res) => {
    const newPlayer = `#${R()}${R()}${R()}${R()}${R()}${R()}`;
    players.push(newPlayer);

    res.json(newPlayer);
});

app.get("/", (req, res) => res.send("Express on Vercel"));

app.listen(3001, () => console.log("Server ready on port 3000."));

export default app;
