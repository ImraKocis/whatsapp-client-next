import { z } from "zod";
import { parseEnv } from "@/lib/zod-config";

const configSchema = z.object({
  BASE_API_URL: z.url(),
  BASE_WS_URL: z.url(),
});

export default parseEnv({ schema: configSchema, prefix: "WEB_" });
