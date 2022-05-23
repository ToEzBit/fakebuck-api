module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    phoneNumber: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    profilePic: {
      type: DataTypes.STRING,
    },
    coverPhoto: {
      type: DataTypes.STRING,
    },
  });
  return User;
};
