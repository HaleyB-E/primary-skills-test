#!/usr/bin/env node
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

const rl = readline.createInterface({ input, output });

// format: {title: string, artist: string, hasBeenPlayed: bool}
const library = [];

// per provided specs, title and artist should be surrounded by quotation marks
// if I were making this production-ready, I'd probably make the quotation marks optional and maybe
// discuss with stakeholders whether there are other punctuation marks or similar that we should expect
// to have to strip out/ignore from our input stream
const verifyFormatting = (word) => {
    return (word.slice(0,1) === '"' && word.slice(-1) === '"');
}

const stripQuotationMarks = (word) => {
    return word.slice(1,-1);
}

// begin main REPL
console.log("Welcome to your music collection! \n");
rl.setPrompt("> ");
rl.prompt();
rl.on("line", answer => {
    const commandAndArgs = answer.split(" "); //first word is command; subsequent words are arguments
    switch (commandAndArgs[0]) {
        case "add": //add "$title" "$artist"
            let title = commandAndArgs[1];
            let artist = commandAndArgs[2];
            if (title && artist && verifyFormatting(title) && verifyFormatting(artist)) {
                title = stripQuotationMarks(title);
                artist = stripQuotationMarks(artist);
                library.push({
                    title: title, 
                    artist: artist, 
                    hasBeenPlayed: false});
                console.log(`Added "${title}" by ${artist}`)
                rl.prompt();
            } else {
                console.log("Invalid input - required format is 'add \"$title\" \"$artist\"");
            }
            //TO DO
        case "play": // play "$title"
            //TO DO - PLAY $TITLE
            break;
        case "show": // show all; show unplayed; show all by "$artist"; show unplayed by "$artist"
            //TO DO
            break;
        case "quit":
            console.log("Bye!");
            rl.close();
            break;
        default:
            console.log("I didn't recognize that input.");
    }
});
