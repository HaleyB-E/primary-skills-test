#!/usr/bin/env node
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const rl = readline.createInterface({ input, output });

rl.setPrompt("Welcome to your music collection! \n");
rl.prompt();
rl.on("line", answer => {
    if (answer === "quit") {
        console.log("Bye!");
        rl.close();
    }
    else (
        console.log(`you said: ${answer}`)
    )
});
