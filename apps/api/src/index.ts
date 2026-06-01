import { app } from "./app";
import { env } from "./config/env";

app.listen(env.PORT, () => {
  console.log(`[api] Firefly API ready on http://localhost:${env.PORT}`);
  console.log(`[api] Allowed client origin: ${env.CLIENT_URL}`);
});
