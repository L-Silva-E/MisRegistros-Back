import express from "express";
import bodyParser from "body-parser";

const cors = require("cors");

class App {
  public app: express.Application;
  public port: number;

  constructor(routers: any, port: number) {
    this.app = express();
    this.app.use(cors());
    this.port = port;
    this.initializeMiddlewares();
    this.initializeRouters(routers);
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());
    this.app.use((err: any, _req: any, res: any, next: any) => {
      if (err) {
        const apiError = {
          code: 400,
          message: "Bad request",
          data: {},
        };
        return res.status(apiError.code).json(apiError);
      }
      next();
    });
  }

  private initializeRouters(routers: any) {
    routers.forEach((router: any) => {
      this.app.use("", router.router);
    });
  }

  public async listen() {
    this.app.listen(this.port, () => {});
  }
}

export default App;
