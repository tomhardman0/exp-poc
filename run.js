const { redis } = require("./redis");

const EVENT_TTL_WARNING = 5;

process.on("message", async msg => {
  const { key } = msg;
  const exists = (await redis.get(key)) || 0;
  const value = exists ? Number(exists) + 1 : 0;

  redis
    .multi()
    .set(key, value)
    .set(`${key}/warning-key`, true, "EX", EVENT_TTL_WARNING)
    .exec();
});
