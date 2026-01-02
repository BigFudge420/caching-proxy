import yargs from "yargs";
import { hideBin } from "yargs/helpers";

// Check if running in test mode (when the main file contains '.test.')
const isTestMode = process.argv[1]?.includes(".test.");

export const argv = isTestMode
  ? { port: 3000, origin: "https://dummyjson.com" } // Default values for testing
  : yargs(hideBin(process.argv))
      .option("port", {
        type: "number",
        default: 3000,
      })
      .option("origin", {
        type: "string",
        demandOption: "true",
      })
      .parseSync();
