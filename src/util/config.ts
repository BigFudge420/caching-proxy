import dotenv from "dotenv";

dotenv.config();

interface Config {
  signature: string;
}

const config: Config = {
  signature:
    process.env.SECRET ||
    (() => {
      throw new Error("SECRET not initialized");
    })(),
};

export default config;
