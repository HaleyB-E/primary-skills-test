#!/usr/bin/env node
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

const rl = readline.createInterface({ input, output });

//#region helpers - input parsing

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

//#endregion

//#region library management 
// format: {title: string, artist: string, hasBeenPlayed: bool}
const library = [];

const verifyTitleInLibrary = (title) => {
    return library.some(song => song.title === title);
}

const markAsPlayed = (title) => {
    if (verifyTitleInLibrary(title)) {
        const currentSong = library.filter(song => song.title === title)[0];
        currentSong.hasBeenPlayed = true;
    }
}
//#endregion

//#region main REPL
console.log("Welcome to your music collection! \n");
rl.setPrompt("> ");
rl.prompt();
rl.on("line", answer => {
    const commandAndArgs = answer.split(" "); //first word is command; subsequent words are arguments
    //TODO: HANDLE TOO MANY INPUTS
    switch (commandAndArgs[0]) {
        case "add": { //add "$title" "$artist"
            add(commandAndArgs[1], commandAndArgs[2]);
            break;
        }
        case "play": { // play "$title"
            play(commandAndArgs[1]);
            break;
        }
        case "show": { // show all; show unplayed; show all by "$artist"; show unplayed by "$artist"
            //TO DO
            break;
        }
        case "quit": {
            console.log("Bye!");
            rl.close();
            break;
        }
        default: {
            console.log("I didn't recognize that input.");
            rl.prompt();
        }
    }
});

const add = (title, artist) => {
    if (title && artist && verifyFormatting(title) && verifyFormatting(artist)) {
        title = stripQuotationMarks(title);
        artist = stripQuotationMarks(artist);
        library.push({
            title: title, 
            artist: artist, 
            hasBeenPlayed: false});
        console.log(`Added "${title}" by ${artist}`)
    } else {
        console.log("Invalid input - required format is 'add \"$title\" \"$artist\"");
    }
    rl.prompt();
}

const play = (title) => {
    if (title && verifyFormatting(title)) {
        title = stripQuotationMarks(title);
        if (verifyTitleInLibrary(title)) {
            console.log(`You're listening to "${title}"`);
            markAsPlayed(title);
        } else {
            console.log(`Could not find "${title}" in library`)
        }
    } else {
        console.log("Invalid input - required format is 'play \"$title\"");
    }
    rl.prompt();
}

//#endregion