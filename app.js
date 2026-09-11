/* =====================================================
   BLOOM MUSIC PLAYER
===================================================== */


/* ================= ELEMENTS ================= */

const audio = document.getElementById("audioPlayer");

const fileInput = document.getElementById("fileInput");
const importBtn = document.getElementById("importBtn");

const songList = document.getElementById("songList");
const recentList = document.getElementById("recentList");

const songCount = document.getElementById("songCount");

const searchInput = document.getElementById("searchInput");

const playerScreen = document.getElementById("playerScreen");

const closePlayer = document.getElementById("closePlayer");

const playBtn = document.getElementById("playBtn");
const miniPlayBtn = document.getElementById("miniPlayBtn");

const previousBtn = document.getElementById("previousBtn");
const nextBtn = document.getElementById("nextBtn");

const back5Btn = document.getElementById("back5Btn");
const forward5Btn = document.getElementById("forward5Btn");

const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");

const progressBar = document.getElementById("progressBar");

const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");

const miniTitle = document.getElementById("miniTitle");
const miniArtist = document.getElementById("miniArtist");

const playerTitle = document.getElementById("playerTitle");
const playerArtist = document.getElementById("playerArtist");

const miniCover = document.getElementById("miniCover");
const bigCover = document.getElementById("bigCover");

const favoriteBtn = document.getElementById("favoriteBtn");

const editBtn = document.getElementById("editBtn");

const editModal = document.getElementById("editModal");

const closeEdit = document.getElementById("closeEdit");

const editTitle = document.getElementById("editTitle");
const editArtist = document.getElementById("editArtist");
const editCover = document.getElementById("editCover");

const saveEdit = document.getElementById("saveEdit");

const playlistBtn = document.getElementById("playlistBtn");

const playlistModal = document.getElementById("playlistModal");

const closePlaylist = document.getElementById("closePlaylist");

const createPlaylist = document.getElementById("createPlaylist");

const playlistName = document.getElementById("playlistName");


/* ================= DATA ================= */

let songs = [];

let currentIndex = -1;

let shuffleMode = false;

let repeatMode = "all";

let currentObjectURL = null;


/* =====================================================
   INDEXED DB
===================================================== */

let db;

const DB_NAME = "BloomMusicDB";

const DB_VERSION = 1;

const STORE_NAME = "songs";


function openDatabase() {

    return new Promise((resolve, reject) => {

        const request =
            indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = function(event) {

            const database = event.target.result;

            if (!database.objectStoreNames.contains(STORE_NAME)) {

                database.createObjectStore(
                    STORE_NAME,
                    {
                        keyPath: "id"
                    }
                );

            }

        };

        request.onsuccess = function(event) {

            db = event.target.result;

            resolve(db);

        };

        request.onerror = function() {

            reject(request.error);

        };

    });

}


/* ================= SAVE SONG ================= */

function saveSong(song) {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                STORE_NAME,
                "readwrite"
            );

        const store =
            transaction.objectStore(
                STORE_NAME
            );

        const request =
            store.put(song);

        request.onsuccess = () => resolve();

        request.onerror = () =>
            reject(request.error);

    });

}


/* ================= GET SONGS ================= */

function getSongs() {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                STORE_NAME,
                "readonly"
            );

        const store =
            transaction.objectStore(
                STORE_NAME
            );

        const request =
            store.getAll();

        request.onsuccess = () => {

            resolve(request.result);

        };

        request.onerror = () =>
            reject(request.error);

    });

}


/* ================= DELETE SONG ================= */

function deleteSong(id) {

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                STORE_NAME,
                "readwrite"
            );

        const store =
            transaction.objectStore(
                STORE_NAME
            );

        const request =
            store.delete(id);

        request.onsuccess = () =>
            resolve();

        request.onerror = () =>
            reject(request.error);

    });

}


/* =====================================================
   INITIALIZE
===================================================== */

async function init() {

    try {

        await openDatabase();

        songs = await getSongs();

        renderSongs();

        renderRecent();

    } catch (error) {

        console.error(
            "Database error:",
            error
        );

    }

}


/* =====================================================
   IMPORT SONG
===================================================== */

importBtn.addEventListener(
    "click",
    () => fileInput.click()
);


fileInput.addEventListener(
    "change",
    async function() {

        const files =
            Array.from(
                fileInput.files
            );

        if (!files.length) return;


        for (const file of files) {

            if (!file.type.startsWith("audio/")) {

                continue;

            }


            const song = {

                id:
                    Date.now() +
                    Math.random(),

                title:
                    file.name.replace(
                        /\.[^/.]+$/,
                        ""
                    ),

                artist:
                    "Unknown Artist",

                album:
                    "My Music",

                favorite:
                    false,

                createdAt:
                    Date.now(),

                audioBlob:
                    file,

                cover:
                    null

            };


            await saveSong(song);

            songs.push(song);

        }


        fileInput.value = "";

        renderSongs();

        renderRecent();

        alert(
            "Music added successfully 🌸"
        );

    }
);


/* =====================================================
   RENDER SONGS
===================================================== */

function renderSongs(list = songs) {

    songList.innerHTML = "";

    songCount.textContent =
        `${list.length} song${list.length !== 1 ? "s" : ""}`;


    if (!list.length) {

        songList.innerHTML = `

            <div class="empty">

                <span>🌸</span>

                <p>
                    Your music library is empty.
                </p>

                <p>
                    Import your first song.
                </p>

            </div>

        `;

        return;

    }


    list.forEach(
        (song, index) => {

            const actualIndex =
                songs.findIndex(
                    item =>
                        item.id === song.id
                );


            const item =
                document.createElement("div");

            item.className =
                "song-item";


            const cover =
                document.createElement("div");

            cover.className =
                "song-cover";


            if (song.cover) {

                cover.innerHTML =
                    `<img src="${song.cover}">`;

            } else {

                cover.textContent =
                    "♪";

            }


            const info =
                document.createElement("div");

            info.className =
                "song-info";


            info.innerHTML = `

                <strong>
                    ${escapeHTML(song.title)}
                </strong>

                <span>
                    ${escapeHTML(song.artist)}
                </span>

            `;


            const favorite =
                document.createElement("button");

            favorite.className =
                "song-menu";


            favorite.innerHTML =
                song.favorite
                    ? "♥"
                    : "♡";


            if (song.favorite) {

                favorite.classList.add(
                    "favorite"
                );

            }


            favorite.addEventListener(
                "click",
                function(event) {

                    event.stopPropagation();

                    toggleFavorite(
                        actualIndex
                    );

                }
            );


            item.appendChild(cover);

            item.appendChild(info);

            item.appendChild(favorite);


            item.addEventListener(
                "click",
                () => {

                    playSong(
                        actualIndex
                    );

                }
            );


            songList.appendChild(item);

        }
    );

}


/* =====================================================
   RECENT
===================================================== */

function renderRecent() {

    recentList.innerHTML = "";


    const recent =
        [...songs]
        .sort(
            (a,b) =>
                b.createdAt -
                a.createdAt
        )
        .slice(0, 6);


    if (!recent.length) {

        recentList.innerHTML = `

            <div class="empty">

                <span>🎵</span>

                Add some music to see it here.

            </div>

        `;

        return;

    }


    recent.forEach(song => {

        const card =
            document.createElement("div");

        card.className =
            "recent-card";


        const cover =
            document.createElement("div");

        cover.className =
            "recent-cover";


        if (song.cover) {

            cover.innerHTML =
                `<img src="${song.cover}">`;

        } else {

            cover.textContent =
                "♪";

        }


        const title =
            document.createElement("strong");

        title.textContent =
            song.title;


        const artist =
            document.createElement("span");

        artist.textContent =
            song.artist;


        card.appendChild(cover);

        card.appendChild(title);

        card.appendChild(artist);


        card.addEventListener(
            "click",
            () => {

                const index =
                    songs.findIndex(
                        item =>
                            item.id === song.id
                    );

                playSong(index);

            }
        );


        recentList.appendChild(card);

    });

}


/* =====================================================
   PLAY SONG
===================================================== */

function playSong(index) {

    if (!songs[index]) return;


    currentIndex = index;


    const song =
        songs[currentIndex];


    if (currentObjectURL) {

        URL.revokeObjectURL(
            currentObjectURL
        );

    }


    currentObjectURL =
        URL.createObjectURL(
            song.audioBlob
        );


    audio.src =
        currentObjectURL;


    updatePlayerUI();


    audio.play()
        .then(() => {

            updatePlayButtons();

        })
        .catch(error => {

            console.error(error);

        });


    playerScreen.classList.add(
        "show"
    );

}


/* =====================================================
   PLAYER UI
===================================================== */

function updatePlayerUI() {

    if (currentIndex < 0) return;


    const song =
        songs[currentIndex];


    miniTitle.textContent =
        song.title;

    miniArtist.textContent =
        song.artist;

    playerTitle.textContent =
        song.title;

    playerArtist.textContent =
        song.artist;


    setCover(
        miniCover,
        song.cover
    );

    setCover(
        bigCover,
        song.cover
    );


    favoriteBtn.textContent =
        song.favorite
            ? "♥ Remove from favorites"
            : "♡ Add to favorites";

}


function setCover(element, cover) {

    if (cover) {

        element.innerHTML =
            `<img src="${cover}">`;

    } else {

        element.textContent =
            "♪";

    }

}


/* =====================================================
   PLAY / PAUSE
===================================================== */

function togglePlay() {

    if (!audio.src) {

        if (songs.length) {

            playSong(0);

        }

        return;

    }


    if (audio.paused) {

        audio.play();

    } else {

        audio.pause();

    }

}


playBtn.addEventListener(
    "click",
    togglePlay
);


miniPlayBtn.addEventListener(
    "click",
    togglePlay
);


audio.addEventListener(
    "play",
    updatePlayButtons
);


audio.addEventListener(
    "pause",
    updatePlayButtons
);


function updatePlayButtons() {

    const playing =
        !audio.paused;


    playBtn.textContent =
        playing
            ? "❚❚"
            : "▶";


    miniPlayBtn.textContent =
        playing
            ? "❚❚"
            : "▶";

}


/* =====================================================
   PREVIOUS
===================================================== */

previousBtn.addEventListener(
    "click",
    previousSong
);


function previousSong() {

    if (!songs.length) return;


    if (audio.currentTime > 5) {

        audio.currentTime = 0;

        return;

    }


    let index =
        currentIndex - 1;


    if (index < 0) {

        index =
            songs.length - 1;

    }


    playSong(index);

}


/* =====================================================
   NEXT
===================================================== */

nextBtn.addEventListener(
    "click",
    nextSong
);


function nextSong() {

    if (!songs.length) return;


    let nextIndex;


    if (shuffleMode) {

        nextIndex =
            Math.floor(
                Math.random() *
                songs.length
            );

    } else {

        nextIndex =
            currentIndex + 1;


        if (
            nextIndex >=
            songs.length
        ) {

            nextIndex = 0;

        }

    }


    playSong(nextIndex);

}


/* =====================================================
   5 SECOND SKIP
===================================================== */

back5Btn.addEventListener(
    "click",
    () => {

        audio.currentTime =
            Math.max(
                0,
                audio.currentTime - 5
            );

    }
);


forward5Btn.addEventListener(
    "click",
    () => {

        audio.currentTime =
            Math.min(
                audio.duration || 0,
                audio.currentTime + 5
            );

    }
);


/* =====================================================
   PROGRESS
===================================================== */

audio.addEventListener(
    "loadedmetadata",
    () => {

        duration.textContent =
            formatTime(
                audio.duration
            );

    }
);


audio.addEventListener(
    "timeupdate",
    () => {

        if (!audio.duration) return;


        progressBar.value =
            (
                audio.currentTime /
                audio.duration
            ) * 100;


        currentTime.textContent =
            formatTime(
                audio.currentTime
            );

    }
);


progressBar.addEventListener(
    "input",
    () => {

        if (!audio.duration) return;


        audio.currentTime =
            (
                progressBar.value /
                100
            ) *
            audio.duration;

    }
);


function formatTime(seconds) {

    if (!seconds || isNaN(seconds)) {

        return "0:00";

    }


    const minutes =
        Math.floor(
            seconds / 60
        );

    const secs =
        Math.floor(
            seconds % 60
        );


    return (
        minutes +
        ":" +
        String(secs).padStart(
            2,
            "0"
        )
    );

}


/* =====================================================
   AUTO NEXT
===================================================== */

audio.addEventListener(
    "ended",
    () => {

        if (repeatMode === "one") {

            audio.currentTime = 0;

            audio.play();

            return;

        }


        nextSong();

    }
);


/* =====================================================
   SHUFFLE
===================================================== */

shuffleBtn.addEventListener(
    "click",
    () => {

        shuffleMode =
            !shuffleMode;


        shuffleBtn.style.color =
            shuffleMode
                ? "var(--pink)"
                : "";

    }
);


/* =====================================================
   REPEAT
===================================================== */

repeatBtn.addEventListener(
    "click",
    () => {

        if (repeatMode === "all") {

            repeatMode = "one";

            repeatBtn.textContent =
                "🔂";

        }

        else if (
            repeatMode === "one"
        ) {

            repeatMode = "off";

            repeatBtn.textContent =
                "↪";

        }

        else {

            repeatMode = "all";

            repeatBtn.textContent =
                "🔁";

        }

    }
);


/* =====================================================
   CLOSE PLAYER
===================================================== */

closePlayer.addEventListener(
    "click",
    () => {

        playerScreen.classList.remove(
            "show"
        );

    }
);


/* =====================================================
   FAVORITE
===================================================== */

favoriteBtn.addEventListener(
    "click",
    () => {

        if (currentIndex < 0) return;


        toggleFavorite(
            currentIndex
        );

        updatePlayerUI();

    }
);


async function toggleFavorite(index) {

    if (!songs[index]) return;


    songs[index].favorite =
        !songs[index].favorite;


    await saveSong(
        songs[index]
    );


    renderSongs();

}


/* =====================================================
   EDIT SONG
===================================================== */

editBtn.addEventListener(
    "click",
    () => {

        if (currentIndex < 0) return;


        const song =
            songs[currentIndex];


        editTitle.value =
            song.title;

        editArtist.value =
            song.artist;


        editModal.classList.add(
            "show"
        );

    }
);


closeEdit.addEventListener(
    "click",
    () => {

        editModal.classList.remove(
            "show"
        );

    }
);


saveEdit.addEventListener(
    "click",
    async () => {

        if (currentIndex < 0) return;


        const song =
            songs[currentIndex];


        song.title =
            editTitle.value.trim()
            || "Untitled";


        song.artist =
            editArtist.value.trim()
            || "Unknown Artist";


        const imageFile =
            editCover.files[0];


        if (imageFile) {

            song.cover =
                await fileToDataURL(
                    imageFile
                );

        }


        await saveSong(song);


        updatePlayerUI();

        renderSongs();

        renderRecent();


        editCover.value = "";


        editModal.classList.remove(
            "show"
        );

    }
);


/* =====================================================
   FILE TO DATA URL
===================================================== */

function fileToDataURL(file) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();


            reader.onload =
                () =>
                    resolve(
                        reader.result
                    );


            reader.onerror =
                reject;


            reader.readAsDataURL(
                file
            );

        }
    );

}


/* =====================================================
   PLAYLIST BASIC
===================================================== */

playlistBtn.addEventListener(
    "click",
    () => {

        playlistModal.classList.add(
            "show"
        );

    }
);


closePlaylist.addEventListener(
    "click",
    () => {

        playlistModal.classList.remove(
            "show"
        );

    }
);


createPlaylist.addEventListener(
    "click",
    () => {

        const name =
            playlistName.value.trim();


        if (!name) {

            alert(
                "Please enter a playlist name."
            );

            return;

        }


        /*
            Full playlist database
            will be added in the
            next development step.
        */


        alert(
            `"${name}" playlist created 🌸`
        );


        playlistName.value = "";

        playlistModal.classList.remove(
            "show"
        );

    }
);


/* =====================================================
   SEARCH
===================================================== */

searchInput.addEventListener(
    "input",
    () => {

        const query =
            searchInput.value
                .toLowerCase()
                .trim();


        if (!query) {

            renderSongs();

            return;

        }


        const filtered =
            songs.filter(song =>

                song.title
                    .toLowerCase()
                    .includes(query)

                ||

                song.artist
                    .toLowerCase()
                    .includes(query)

            );


        renderSongs(filtered);

    }
);


/* =====================================================
   NAVIGATION
===================================================== */

document
    .querySelectorAll(".nav-item")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".nav-item"
                    )
                    .forEach(item =>
                        item.classList.remove(
                            "active"
                        )
                    );


                button.classList.add(
                    "active"
                );


                const page =
                    button.dataset.page;


                if (page === "songs") {

                    renderSongs(
                        songs
                    );

                }


                if (
                    page ===
                    "favorites"
                ) {

                    renderSongs(
                        songs.filter(
                            song =>
                                song.favorite
                        )
                    );

                }


                if (
                    page ===
                    "home"
                ) {

                    renderSongs(
                        songs
                    );

                }


                if (
                    page ===
                    "playlists"
                ) {

                    alert(
                        "Playlist section is coming next 🌸"
                    );

                }

            }
        );

    });


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text;

    return div.innerHTML;

}


/* =====================================================
   START APP
===================================================== */

init();
