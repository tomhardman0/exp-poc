const Redis = require("ioredis");
const host = "localhost";
const port = 6379;
const db = 0;

const redisSubscriber = (() => new Redis({ port, host, db }))();

const redis = (() => {
  const redis = new Redis({ port, host, db });
  redis.on("ready", () => {
    redis.config("SET", "notify-keyspace-events", "Ex");
  });
  return redis;
})();

const subscribeToRedisExpireNotifications = () => {
  redisSubscriber.subscribe(`__keyevent@${db}__:expired`);
  redisSubscriber.on("message", async (channel, message) => {
    const warning = message.match("/warning-key");
    if (warning) {
      const actualKey = message.replace("/warning-key", "");
      const val = await redis.get(actualKey);
      console.log(`Expired key: ${actualKey}, saved event to dispatch: ${val}`);
      redis.del(actualKey);
    }
  });
};

module.exports = {
  subscribeToRedisExpireNotifications,
  redis
};
