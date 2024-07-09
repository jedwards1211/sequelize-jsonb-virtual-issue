import { DataTypes, Model } from "sequelize";
import { createSequelize6Instance } from "../dev/create-sequelize-instance";
import { expect } from "chai";
import sinon from "sinon";

// if your issue is dialect specific, remove the dialects you don't need to test on.
export const testingOnDialects = new Set(["postgres"]);

// You can delete this file if you don't want your SSCCE to be tested against Sequelize 6

// Your SSCCE goes inside this function.
export async function run() {
  // This function should be used instead of `new Sequelize()`.
  // It applies the config for your SSCCE to work on CI.
  const sequelize = createSequelize6Instance({
    logQueryParameters: true,
    benchmark: true,
    define: {
      // For less clutter in the SSCCE
      timestamps: false,
    },
  });

  class Foo extends Model {
    declare _value: any;
    declare value: any;
  }

  Foo.init(
    {
      _value: {
        type: DataTypes.JSONB,
        allowNull: false,
        field: "value",
      },
      value: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.getDataValue("_value");
        },
        set(value: any) {
          return this.setDataValue("_value", value);
        },
      },
    },
    {
      sequelize,
      modelName: "Foo",
    }
  );

  // You can use sinon and chai assertions directly in your SSCCE.
  const spy = sinon.spy();
  sequelize.afterBulkSync(() => spy());
  await sequelize.sync({ force: true });
  expect(spy).to.have.been.called;

  await Foo.create({ value: [{ a: 1 }, { b: 2 }] });
}
