const yargs = () => ({
  option: () => yargs(),
  demandOption: () => yargs(),
  parseSync: () => ({
    port: 3000,
    origin: 'https://dummyjson.com'
  }),
  argv: {
    port: 3000,
    origin: 'https://dummyjson.com'
  }
});

export default yargs;