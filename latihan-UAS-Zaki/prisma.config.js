require('dotenv').config();

module.exports = {
  datasource: {
    url: process.env.DATABASE_URL || "file:./dev.db"
  }
};