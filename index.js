const { sequelize } = require("./models");

sequelize.sync({ force: true });
