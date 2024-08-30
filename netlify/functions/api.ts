import express, {Router} from 'express';
import serverless from 'serverless-http';

const app = express();
const router = Router();

app.use(express.static('public'));

app.use("/api/", router);

app.ws('/ws', function(ws, req) {
  ws.on('message', msg => {
    console.log(msg);
  });
  console.log('socket', req.testing);
});

router.get("*", (req, res) => res.send('./index.html'));

export const handler = serverless(app);
