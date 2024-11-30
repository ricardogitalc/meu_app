import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: "../api-nestjs/swagger.json",
    output: "./src/http/generated/api.ts",
  },
});
