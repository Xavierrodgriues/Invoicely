module.exports = {
  apps: [
    {
      name: "invoicely",
      script: "server.js",
      env: {
        PORT: 3000,
        MONGO_URI: "mongodb+srv://xavier:Xavier.00@invoicely.byeulwg.mongodb.net/invoicely",
        JWT_SECRET: "a567b92fd1cd35a6ce42695b1aad3ecc",
        EMAIL_USER: "xavierrodgriues123@gmail.com",
        EMAIL_PASS: "frldczkmcaolrvdj",
      },
    },
  ],
};
