module.exports = {
  apps : [{
    name        : "server",
    script      : "./eerolsite/server.js",
    env : {
       "NODE_ENV": "production"
    }
  }]
}