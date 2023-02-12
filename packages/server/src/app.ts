import env from "./env"
import buildServer from "./server"

const server = buildServer()

async function main() {
  try {
    await server.listen({ port: env.PORT, host: env.HOST })

    console.log(`Server ready at http://${env.HOST}:${env.PORT}`)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

main()
