import { DataTypes } from "sequelize"

export const herosSchema = {
  name: "heros",
  schema: {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    poder: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  options: {
    tableName: 'TB_HEROS',
    freezeTableName: false,
    timestamps: false
  }
}
