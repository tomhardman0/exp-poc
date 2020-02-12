const express = require("express");
const { subscribeToRedisExpireNotifications } = require("./redis");
const app = express();
const { fork } = require("child_process");
const forked = fork("run.js");

subscribeToRedisExpireNotifications();

app.get("/", async (_, res) => {
  res.sendStatus(200);

  const rand = Math.floor(Math.random() * 20000);
  forked.send({ key: rand });
});

app.listen(3000, () => console.log("Successfully started server"));
