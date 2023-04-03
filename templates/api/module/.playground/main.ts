import { API } from "../src/api.ts";
import { helloRouter } from "./routers/validation.ts";

const api = new API({ name: "test" });

api.addRouter(helloRouter);

await api.listen();
