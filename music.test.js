const music = require ("./music");

const albumsAreTheSame = (album1, album2) => {
    return album1.title === album2.title && album1.artist === album2.artist;
}

afterEach(() => {
    // NOTE: there's an error, "Jest did not exit one second after the test run has completed."
    //      which happens only if I run more than one test. investigate more once tests are written
    music.quit();
    jest.clearAllMocks();
});

const logSpy = jest.spyOn(global.console, "log");

describe("Make sure Add works", () => {
    test.each([{title: "Title", artist: "Artist"},
               {title: "Multi Word Title", artist: "Multi Word Artist"},
               {title: "Title With 'apostrophe'", artist: "Artist's Apostrophe"}])(
      "should add single album to library",
      (newAlbum) => {
        music.add(newAlbum.title, newAlbum.artist);
        expect(music.library.length).toBe(1);
        expect(albumsAreTheSame(music.library[0], newAlbum));
        expect(logSpy).toHaveBeenCalledWith(`Added "${newAlbum.title}" by ${newAlbum.artist}`)
      }
    );

    test("should add several albums to library", () => {
        const albumList = [{title: "First Album", artist: "Artist"},
                          {title: "Second Album", artist: "Artist"},
                          {title: "Joe's Album", artist: "Joe's Band"}];
        albumList.forEach(album => music.add(album.title, album.artist));
        expect(music.library.length).toBe(albumList.length);
        music.library.forEach(album1 => {
            expect(albumList.some(album2 => albumsAreTheSame(album1, album2))).toBe(true);
        })
    });

    test.each([{title: "Duplicate Album", artist: "Artist A"},
               {title: "Duplicate Album", artist: "Artist B"}])(
                "duplicate album titles should not get added a second time",
            (newAlbum) => {
                music.add("Duplicate Album", "Artist A");
                music.add(newAlbum.title, newAlbum.artist);
                expect(music.library.length).toBe(1);
                expect(logSpy).toHaveBeenCalledWith(`Cannot add to library - album called "${newAlbum.title}" already exists`);
            })
  });

describe("Make sure Play works", () => {
    test("should play single album and mark it as played", () => {
        const albumName = "This Is An Album";
        music.add(albumName, "This Is An Artist");
        music.play(albumName);
        expect(music.library[0].hasBeenPlayed).toBe(true);
        expect(logSpy).toHaveBeenCalledWith(`You're listening to "${albumName}"`);
    });

    test("when there are two albums and one is played, only mark that one as played", () => {
        const albumToPlay = "First Album";
        const otherAlbum = "Second Album";
        const albumList = [{title: albumToPlay, artist: "Artist Uno"},
            {title: otherAlbum, artist: "Artist Dos"}];
        albumList.forEach(album => music.add(album.title, album.artist));
        music.play(albumToPlay);

        expect(music.library.filter(album => album.title === albumToPlay)[0].hasBeenPlayed).toBe(true);
        expect(music.library.filter(album => album.title === otherAlbum)[0].hasBeenPlayed).toBe(false);
    });

    test("should notify user if album is not found in library", () => {
        const albumTitle = "Missing Album";
        music.add("Album In Library", "Steve The Musician");
        music.play(albumTitle);
        expect(logSpy).toHaveBeenCalledWith(`Could not find "${albumTitle}" in library`)
    });
});

describe("Make sure Show works", () => {
    const albumList = [{title: "First Album", artist: "Artist"},
                       {title: "Second Album", artist: "Artist"},
                       {title: "Joe's Album", artist: "Joe's Band"}];
    beforeEach(() => {
        albumList.forEach(album => music.add(album.title, album.artist));
        return albumList;
    })
    test("show all albums", () => {
        music.show("all");
        albumList.forEach(album => {
            expect(logSpy).toHaveBeenCalledWith(`"${album.title}" by ${album.artist} (unplayed)`);
        });
    });
    test("show albums filtered by artist", () => {
        const artistFilter = "Artist";
        music.show("all", artistFilter);

        albumList.filter(album => album.artist === artistFilter).forEach(album => {
            expect(logSpy).toHaveBeenCalledWith(`"${album.title}" by ${album.artist} (unplayed)`);
        });
        albumList.filter(album => album.artist !== artistFilter).forEach(album => {
            expect(logSpy).not.toHaveBeenCalledWith(`"${album.title}" by ${album.artist} (unplayed)`);
        });
    });
    test("show albums filtered by unplayed", () => {
        const playedAlbum = "First Album";
        music.play(playedAlbum);
        music.show("unplayed");

        music.library.filter(album => album.hasBeenPlayed === false).forEach(album => {
            expect(logSpy).toHaveBeenCalledWith(`"${album.title}" by ${album.artist}`);
        });
        music.library.filter(album => album.hasBeenPlayed === true).forEach(album => {
            expect(logSpy).not.toHaveBeenCalledWith(`"${album.title}" by ${album.artist}`);
        });
    });
    test("show albums filtered by artist and unplayed", () => {
        const playedAlbum = {title: "This Has Been Played", artist: "Joe's Band"};
        music.add(playedAlbum.title, playedAlbum.artist);
        music.play(playedAlbum);
        music.show("unplayed", playedAlbum.artist);

        music.library.filter(album => album.hasBeenPlayed === false && album.artist === playedAlbum.artist)
            .forEach(album => {
                expect(logSpy).toHaveBeenCalledWith(`"${album.title}" by ${album.artist}`);
            });
        music.library.filter(album => (album.hasBeenPlayed === true || album.artist !== playedAlbum.artist))
            .forEach(album => {
                expect(logSpy).not.toHaveBeenCalledWith(`"${album.title}" by ${album.artist}`);
            });
    })
});

// NOTE: there's something significant missing here, which is tests handling inputs and verifying 
//  that we're doing error handling correctly. I don't like leaving this missing, but it seems like 
//  the established way to handle the interaction between jest and stdin is the use of the npm package 
//  `mock-stdin`. I spent about an hour trying to get it working, but could not get it set up properly 
//  (the mock stdin was initializing but I couldn't get it to send anything)
//  Documentation on the package is pretty sparse, and if I were working on this in a real job context
//  I'd be at the point where I'd turn to a coworker to talk through my approach since I think either
//  this is much harder than I'd expect for a tech challenge or else I'm missing something important in
//  my assessment of the issue.