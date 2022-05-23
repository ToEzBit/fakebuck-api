module.exports = (sequelize, DataTypes) => {
  const Friend = sequelize.define(
    "Friend",
    {
      status: {
        type: DataTypes.ENUM("ACCEPTED", "PENDING"),
        allowNull: false,
        defaultValue: "PENDING",
      },
    },
    {
      underscored: true,
    }
  );
  return Friend;
};
