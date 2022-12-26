import { DataTypes } from "sequelize"

export const UserSchema = {
  name: "users",
  schema: {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  options: {
    tableName: 'TB_USERS',
    freezeTableName: false,
    timestamps: false
  }
}
