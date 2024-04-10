#!/usr/bin/env node
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

const rl = readline.createInterface({ input, output });

//#region library management helpers
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

const getFilteredLibrary = (limitToUnplayed = false, artistFilter = null) => {
    return library.filter(song => {
        if (limitToUnplayed && song.hasBeenPlayed) {
            return false;
        }
        if (artistFilter && song.artist !== artistFilter) {
            return false;
        }
        return true;
    })
}
//#endregion

//#region main REPL
console.log("Welcome to your music collection! \n");
rl.setPrompt("> ");
rl.prompt();
rl.on("line", answer => {
    // first word of user input is a command
    const command = answer.split(" ")[0]; 
    // Note: in general we are not handling weird inputs optimally. We aren't crashing the app and aren't
    //  allowing data to be written to the library in a problematic way, but to make this code production-ready
    //  we'd want to think about more intelligent parsing of something like forgotten quotation marks or extra arguments
    //  That being said, I don't think that's a really important thing to prioritize in this tech challenge
    //  because you can do an essentially arbitrary amount of finessing on string processing to get perfect behavior
    //  and "doesn't do anything wrong, but could have more intuitive error messaging on weirder edge cases"
    //  feels like a fine cutoff for the scope of this challenge
    switch (command) {
        case "add": {
            // add "$title" "$artist" splits out into ["add ", "$title", " ", "$artist",""]
            const args = answer.split("\"");
            add(args[1], args[3]);
            break;
        }
        case "play": {
            // play "$title" splits out into ["play ", "$title",""]
            const args = answer.split("\"");
            play(args[1]);
            break;
        }
        case "show": { // show all; show unplayed; show all by "$artist"; show unplayed by "$artist"
            const commandAndArgs = answer.split(" ");
            const whatToShow = commandAndArgs[1];

            let artistFilter;
            if (commandAndArgs[2] && commandAndArgs[2] === "by") {
                // show X by "$artist" splits out into ["show X by ", "$artist", ""]
                const args = answer.split("\"");
                artistFilter = args[1];
            }
            show(whatToShow, artistFilter)
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
    if (title && artist) {
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
    if (title) {
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

const show = (whatToShow, artistFilter) => {
    const invalidFormatResponse = "Invalid input - allowed formats: 'show all', 'show unplayed', 'show all by \"$artist\", 'show unplayed by \"$artist\"";
    if (library.length === 0) {
        console.log('Library is empty!');
    }
    else if (!(whatToShow === "all" || whatToShow === "unplayed")) {
        console.log(invalidFormatResponse);
    } else {
        let songsToShow;
        switch (whatToShow) {
            case "all":
                songsToShow = getFilteredLibrary(false, artistFilter);
                songsToShow.forEach(song => {
                    console.log(`"${song.title}" by ${song.artist} (${song.hasBeenPlayed ? "played" : "unplayed"})`);
                })
                break;
            case "unplayed":
                songsToShow = getFilteredLibrary(true, artistFilter);
                songsToShow.forEach(song => {
                    console.log(`"${song.title}" by ${song.artist}`);
                })
                break;
            default:
                console.log(invalidFormatResponse);
        }
    }
    rl.prompt();
}

//#endregion