import { API } from "../deps.ts";
import { hello } from "./routers/hello.ts";
// import { platforms } from "./routers/platforms.ts";
import config from "./config.ts";

const api = new API({ name: "platforms" });

api.addRouter(hello);
// api.addRouter(platforms);

api.setDBUrl({ url: config.PROXY_DB });

export { api };
