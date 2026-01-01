import yargs from "yargs"
import { hideBin } from "yargs/helpers"

export const argv = yargs(hideBin(process.argv))
  .option("port", {
    type: "number",
    default: 3000,
  })
  .option('origin', {
    type: "string",
    demandOption: "true"
  })
  .parseSync()
