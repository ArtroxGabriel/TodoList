import express, { Express } from "express";
import { PORT, prismaClient } from "./config";
import router from "./routes";
import morgan from "morgan";

async function main() {
  const app: Express = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(morgan("tiny"));

  router(app);

  app.listen(PORT, () => {
    console.log(`Express running in ${PORT} port`);
  });
}

main()
  .catch((e: any) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
