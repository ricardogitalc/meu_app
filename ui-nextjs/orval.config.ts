import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: "../api-nestjs/swagger.json",
    output: {
      clean: true,
      target: "./src/auth/api/api.ts",
      mode: "tags-split",
      httpClient: "fetch",
      client: "react-query",
      baseUrl: "http://localhost:3003",
    },
  },
});
