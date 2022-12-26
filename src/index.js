import Hapi from "@hapi/hapi";
import Inert from "@hapi/inert";
import Vision from "@hapi/vision";
import HapiSwagger from "hapi-swagger";
import HapiJwt from "hapi-auth-jwt2"

import { dotenv } from "./helpers/dotenv.js";
import { swaggerOptions } from "./config/swagger.js";

import { ContextStrategy } from "./db/strategies/base/contextStrategy.js"
import { MongoDB } from "./db/strategies/mongodb/mongodb.js"
import { Postgres } from "./db/strategies/postgres/postgres.js"
import { herosSchema } from "./db/strategies/mongodb/schemas/herosSchema.js"
import { UserSchema } from "./db/strategies/postgres/schemas/userSchema.js"

import { HeroRoutes } from "./routes/hero.routes.js"
import { AuthRoutes } from "./routes/auth.routes.js"

dotenv()

const JWT_SECRET = process.env.JWT_KEY

const app = new Hapi.server({
  port: process.env.PORT
});

function mapRoutes(instance, methods) {
  return methods.map(method => instance[method]())
}

async function main() {
  const connection = MongoDB.connect()
  const context = new ContextStrategy(new MongoDB(connection, herosSchema))

  const connectionPostgres = await Postgres.connect()
  const userSchema = await Postgres.defineModel(connectionPostgres, UserSchema)
  const contextPostgres = new ContextStrategy(new Postgres(connectionPostgres, userSchema))

  await app.register([
    HapiJwt,
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions
    }
  ]);

  app.auth.strategy('jwt', 'jwt', {
    key: JWT_SECRET,
    // options: {
    //   expiresIn: 20
    // },
    validate: async (dado, request) => {
      const [result] = await contextPostgres.read({
        username: dado.username
      })

      if (!result) {
        return {
          isValid: false
        }
      }
      // verifica no banco se o usuário continua ativo
      // continua pagando

      return {
        isValid: true
      }
    }
  })

  app.auth.default('jwt')

  try {
    await app.start();
    console.log("Server running at:", app.info.uri);
  } catch (err) {
    console.log(err);
  }

  app.route([
    ...mapRoutes(new HeroRoutes(context), HeroRoutes.methods()),
    ...mapRoutes(new AuthRoutes(JWT_SECRET, contextPostgres), AuthRoutes.methods())
  ]);

  return app
}

export default main();