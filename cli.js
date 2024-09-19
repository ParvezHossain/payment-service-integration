#! /usr/bin/env node
require("dotenv").config();
const cli = require("./src/cli/index");
cli.run(process.argv);