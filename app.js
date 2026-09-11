/* =====================================================
   BLOOM MUSIC
   VERSION 2
===================================================== */


/* ================= ELEMENTS ================= */

const audio = document.getElementById("audioPlayer");

const fileInput = document.getElementById("fileInput");
const importBtn = document.getElementById("importBtn");

const songList = document.getElementById("songList");
const recentList = document.getElementById("recentList");

const playlistList =
    document.getElementById("playlistList");

const songCount =
    document.getElementById("songCount");

const playlistCount =
    document.getElementById("playlistCount");

const searchInput =
    document.getElementById("searchInput");

const pageTitle =
    document.getElementById("pageTitle");

const listTitle =
    document.getElementById("listTitle");

const recentSection =
    document.getElementById("recentSection");

const playlistSection =
    document.getElementById("playlistSection");


/* PLAYER */

const playerScreen =
    document.getElementById("playerScreen");

const closePlayer =
    document.getElementById("closePlayer");

const playBtn =
    document.getElementById("playBtn");

const miniPlayBtn =
    document.getElementById("miniPlayBtn");

const previousBtn =
    document.getElementById("previousBtn");

const nextBtn =
    document.getElementById("nextBtn");

const back5Btn =
    document.getElementById("back5Btn");

const forward5Btn =
    document.getElementById("forward5Btn");

const shuffleBtn =
    document.getElementById("shuffleBtn");

const repeatBtn =
    document.getElementById("repeatBtn");

const progressBar =
    document.getElementById("progressBar");

const currentTime =
    document.getElementById("currentTime");

const duration =
    document.getElementById("duration");

const miniTitle =
    document.getElementById("miniTitle");

const miniArtist =
    document.getElementById("miniArtist");

const playerTitle =
    document.getElementById("playerTitle");

const playerArtist =
    document.getElementById("playerArtist");

const miniCover =
    document.getElementById("miniCover");

const bigCover =
    document.getElementById("bigCover");

const favoriteBtn =
    document.getElementById("favoriteBtn");

const editBtn =
    document.getElementById("editBtn");

const addPlaylistFromPlayer =
    document.getElementById(
        "addPlaylistFromPlayer"
    );


/* EDIT */

const editModal =
    document.getElementById("editModal");

const closeEdit =
    document.getElementById("closeEdit");

const editTitle =
    document.getElementById("editTitle");

const editArtist =
    document.getElementById("editArtist");

const editAlbum =
    document.getElementById("editAlbum");

const editCover =
    document.getElementById("editCover");

const saveEdit =
    document.getElementById("saveEdit");


/* PLAYLIST CREATE */

const playlistBtn =
    document.getElementById("playlistBtn");

const playlistModal =
    document.getElementById("playlistModal");

const closePlaylist =
    document.getElementById("closePlaylist");

const playlistName =
    document.getElementById("playlistName");

const createPlaylist =
    document.getElementById("createPlaylist");


/* PLAYLIST SELECTOR */

const playlistSelector =
    document.getElementById(
        "playlistSelector"
    );

const selectorList =
    document.getElementById(
        "selectorList"
    );

const closeSelector =
    document.getElementById(
        "closeSelector"
    );

const createPlaylistFromSelector =
    document.getElementById(
        "createPlaylistFromSelector"
    );


/* PLAYLIST SCREEN */

const playlistScreen =
    document.getElementById(
        "playlistScreen"
    );

const closePlaylistScreen =
    document.getElementById(
        "closePlaylistScreen"
    );

const playlistViewTitle =
    document.getElementById(
        "playlistViewTitle"
    );

const playlistViewContent =
    document.getElementById(
        "playlistViewContent"
    );


/* SONG MENU */

const songMenu =
    document.getElementById("songMenu");

const menuSongTitle =
    document.getElementById(
        "menuSongTitle"
    );

const menuEdit =
    document.getElementById("menuEdit");

const menuFavorite =
    document.getElementById(
        "menuFavorite"
    );

const menuPlaylist =
    document.getElementById(
        "menuPlaylist"
    );

const menuDelete =
    document.getElementById("menuDelete");

const menuClose =
    document.getElementById("menuClose");


/* SORT */

const sortBtn =
    document.getElementById("sortBtn");

const sortMenu =
    document.getElementById("sortMenu");

const sortClose =
    document.getElementById("sortClose");


/* ================= DATABASE ================= */

const DB_NAME =
    "BloomMusicDB";

const DB_VERSION =
    2;

const SONG_STORE =
    "songs";

const PLAYLIST_STORE =
    "playlists";

let db;


/* ================= STATE ================= */

let songs = [];

let playlists = [];

let currentIndex = -1;

let menuSongIndex = -1;

let currentPlaylistId = null;

let selectedPlaylistSong = -1;

let currentObjectURL = null;

let shuffleMode = false;

let repeatMode = "all";

let sortMode = "recent";


/* =====================================================
   DATABASE
===================================================== */

function openDatabase() {

    return new Promise(
        (resolve, reject) => {

            const request =
                indexedDB.open(
                    DB_NAME,
                    DB_VERSION
                );


            request.onupgradeneeded =
                function(event) {

                    const database =
                        event.target.result;


                    if (
                        !database.objectStoreNames
                            .contains(SONG_STORE)
                    ) {

                        database.createObjectStore(
                            SONG_STORE,
                            {
                                keyPath: "id"
                            }
                        );

                    }


                    if (
                        !database.objectStoreNames
                            .contains(PLAYLIST_STORE)
                    ) {

                        database.createObjectStore(
                            PLAYLIST_STORE,
                            {
                                keyPath: "id"
                            }
                        );

                    }

                };


            request.onsuccess =
                function(event) {

                    db =
                        event.target.result;

                    resolve(db);

                };


            request.onerror =
                function() {

                    reject(
                        request.error
                    );

                };

        }
    );

}


/* ================= GENERIC DB SAVE ================= */

function dbPut(storeName, object) {

    return new Promise(
        (resolve, reject) => {

            const transaction =
                db.transaction(
                    storeName,
                    "readwrite"
                );

            const store =
                transaction.objectStore(
                    storeName
                );

            const request =
                store.put(object);


            request.onsuccess =
                () => resolve();

            request.onerror =
                () =>
                    reject(
                        request.error
                    );

        }
    );

}


/* ================= GET ALL ================= */

function dbGetAll(storeName) {

    return new Promise(
        (resolve, reject) => {

            const transaction =
                db.transaction(
                    storeName,
                    "readonly"
                );

            const store =
                transaction.objectStore(
                    storeName
                );

            const request =
                store.getAll();


            request.onsuccess =
                () =>
                    resolve(
                        request.result
                    );

            request.onerror =
                () =>
                    reject(
                        request.error
                    );

        }
    );

}


/* ================= DELETE ================= */

function dbDelete(
    storeName,
    id
) {

    return new Promise(
        (resolve, reject) => {

            const transaction =
                db.transaction(
                    storeName,
                    "readwrite"
                );

            const store =
                transaction.objectStore(
                    storeName
                );

            const request =
                store.delete(id);


            request.onsuccess =
                () => resolve();

            request.onerror =
                () =>
                    reject(
                        request.error
                    );

        }
    );

}


/* =====================================================
   INITIALIZE
===================================================== */

async function init() {

    try {

        await openDatabase();

        songs =
            await dbGetAll(
                SONG_STORE
            );

        playlists =
            await dbGetAll(
                PLAYLIST_STORE
            );


        renderAll();

    }

    catch(error) {

        console.error(
            "Database error:",
            error
        );

        alert(
            "Storage could not be initialized."
        );

    }

}


/* =====================================================
   RENDER EVERYTHING
===================================================== */

function renderAll() {

    renderSongs();

    renderRecent();

    renderPlaylists();

}


/* =====================================================
   IMPORT
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


        let added = 0;


        for (
            const file of files
        ) {

            if (
                !file.type.startsWith(
                    "audio/"
                )
            ) {

                continue;

            }


            const song = {

                id:
                    crypto.randomUUID(),

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


            await dbPut(
                SONG_STORE,
                song
            );


            songs.push(song);

            added++;

        }


        fileInput.value = "";

        renderAll();


        if (added) {

            alert(
                `${added} song${added > 1 ? "s" : ""} added 🌸`
            );

        }

    }
);


/* =====================================================
   SONG SORT
===================================================== */

function getSortedSongs(list) {

    const result =
        [...list];


    if (sortMode === "title") {

        result.sort(
            (a,b) =>
                a.title.localeCompare(
                    b.title
                )
        );

    }


    else if (
        sortMode === "artist"
    ) {

        result.sort(
            (a,b) =>
                a.artist.localeCompare(
                    b.artist
                )
        );

    }


    else if (
        sortMode === "favorite"
    ) {

        result.sort(
            (a,b) =>
                Number(b.favorite) -
                Number(a.favorite)
        );

    }


    else {

        result.sort(
            (a,b) =>
                b.createdAt -
                a.createdAt
        );

    }


    return result;

}


/* =====================================================
   RENDER SONGS
===================================================== */

function renderSongs(
    customList = null
) {

    let list =
        customList
        || songs;


    list =
        getSortedSongs(
            list
        );


    songList.innerHTML = "";


    songCount.textContent =
        `${list.length} song${list.length !== 1 ? "s" : ""}`;


    if (!list.length) {

        songList.innerHTML = `

            <div class="empty">

                <span>🌸</span>

                <p>
                    No music found.
                </p>

            </div>

        `;

        return;

    }


    list.forEach(
        song => {

            const actualIndex =
                songs.findIndex(
                    item =>
                        item.id === song.id
                );


            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "song-item";


            const cover =
                document.createElement(
                    "div"
                );

            cover.className =
                "song-cover";


            if (song.cover) {

                cover.innerHTML =
                    `<img src="${song.cover}" alt="">`;

            }

            else {

                cover.textContent =
                    "♪";

            }


            const info =
                document.createElement(
                    "div"
                );

            info.className =
                "song-info";


            info.innerHTML = `

                <strong>
                    ${escapeHTML(
                        song.title
                    )}
                </strong>

                <span>
                    ${escapeHTML(
                        song.artist
                    )}
                    ${song.album ? " • " + escapeHTML(song.album) : ""}
                </span>

            `;


            const menu =
                document.createElement(
                    "button"
                );

            menu.className =
                "song-menu";


            menu.innerHTML =
                song.favorite
                    ? "♥"
                    : "⋮";


            if (song.favorite) {

                menu.classList.add(
                    "favorite"
                );

            }


            menu.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    if (song.favorite) {

                        toggleFavorite(
                            actualIndex
                        );

                    }

                    else {

                        openSongMenu(
                            actualIndex
                        );

                    }

                }
            );


            item.appendChild(
                cover
            );

            item.appendChild(
                info
            );

            item.appendChild(
                menu
            );


            item.addEventListener(
                "click",
                () =>
                    playSong(
                        actualIndex
                    )
            );


            songList.appendChild(
                item
            );

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
            .slice(0,6);


    if (!recent.length) {

        recentList.innerHTML = `

            <div class="empty">
                <span>🎵</span>
                Add your first song.
            </div>

        `;

        return;

    }


    recent.forEach(
        song => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "recent-card";


            const cover =
                document.createElement(
                    "div"
                );

            cover.className =
                "recent-cover";


            if (song.cover) {

                cover.innerHTML =
                    `<img src="${song.cover}" alt="">`;

            }

            else {

                cover.textContent =
                    "♪";

            }


            const title =
                document.createElement(
                    "strong"
                );

            title.textContent =
                song.title;


            const artist =
                document.createElement(
                    "span"
                );

            artist.textContent =
                song.artist;


            card.appendChild(
                cover
            );

            card.appendChild(
                title
            );

            card.appendChild(
                artist
            );


            card.addEventListener(
                "click",
                () => {

                    const index =
                        songs.findIndex(
                            item =>
                                item.id ===
                                song.id
                        );

                    playSong(index);

                }
            );


            recentList.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   PLAYLIST RENDER
===================================================== */

function renderPlaylists() {

    playlistList.innerHTML = "";


    playlistCount.textContent =
        playlists.length;


    if (!playlists.length) {

        playlistList.innerHTML = `

            <div class="empty">
                <span>♡</span>
                Create your first playlist.
            </div>

        `;

        return;

    }


    playlists.forEach(
        playlist => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "playlist-card";


            const icon =
                document.createElement(
                    "div"
                );

            icon.className =
                "playlist-icon";

            icon.textContent =
                "♫";


            const title =
                document.createElement(
                    "strong"
                );

            title.textContent =
                playlist.name;


            const count =
                document.createElement(
                    "span"
                );

            count.textContent =
                `${playlist.songIds.length} songs`;


            card.appendChild(
                icon
            );

            card.appendChild(
                title
            );

            card.appendChild(
                count
            );


            card.addEventListener(
                "click",
                () =>
                    openPlaylist(
                        playlist.id
                    )
            );


            playlistList.appendChild(
                card
            );

        }
    );

}


/* =====================================================
   PLAY SONG
===================================================== */

function playSong(index) {

    if (!songs[index]) return;


    currentIndex =
        index;


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


    playerScreen.classList.add(
        "show"
    );


    audio.play()
        .then(
            updatePlayButtons
        )
        .catch(
            console.error
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
            ? "♥ Remove favorite"
            : "♡ Favorite";

}


function setCover(
    element,
    cover
) {

    if (cover) {

        element.innerHTML =
            `<img src="${cover}" alt="">`;

    }

    else {

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

    }

    else {

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
    () => {

        if (!songs.length) return;


        if (
            audio.currentTime > 5
        ) {

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
);


/* =====================================================
   NEXT
===================================================== */

nextBtn.addEventListener(
    "click",
    nextSong
);


function nextSong() {

    if (!songs.length) return;


    let index;


    if (shuffleMode) {

        do {

            index =
                Math.floor(
                    Math.random() *
                    songs.length
                );

        }
        while (
            songs.length > 1 &&
            index === currentIndex
        );

    }

    else {

        index =
            currentIndex + 1;


        if (
            index >=
            songs.length
        ) {

            index = 0;

        }

    }


    playSong(index);

}


/* =====================================================
   5 SECOND
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

        if (!audio.duration)
            return;


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

        if (!audio.duration)
            return;


        audio.currentTime =
            (
                progressBar.value /
                100
            ) *
            audio.duration;

    }
);


function formatTime(seconds) {

    if (
        !seconds ||
        isNaN(seconds)
    ) {

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
   END OF SONG
===================================================== */

audio.addEventListener(
    "ended",
    () => {

        if (
            repeatMode ===
            "one"
        ) {

            audio.currentTime =
                0;

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

        if (
            repeatMode ===
            "all"
        ) {

            repeatMode =
                "one";

            repeatBtn.textContent =
                "🔂";

        }

        else if (
            repeatMode ===
            "one"
        ) {

            repeatMode =
                "off";

            repeatBtn.textContent =
                "↪";

        }

        else {

            repeatMode =
                "all";

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
    async () => {

        if (currentIndex < 0)
            return;


        await toggleFavorite(
            currentIndex
        );


        updatePlayerUI();

    }
);


async function toggleFavorite(index) {

    if (!songs[index])
        return;


    songs[index].favorite =
        !songs[index].favorite;


    await dbPut(
        SONG_STORE,
        songs[index]
    );


    renderSongs();

}


/* =====================================================
   SONG MENU
===================================================== */

function openSongMenu(index) {

    menuSongIndex =
        index;


    const song =
        songs[index];


    if (!song) return;


    menuSongTitle.textContent =
        song.title;


    menuFavorite.textContent =
        song.favorite
            ? "♥ Remove from favorites"
            : "♡ Add to favorites";


    songMenu.classList.add(
        "show"
    );

}


menuClose.addEventListener(
    "click",
    closeSongMenu
);


function closeSongMenu() {

    songMenu.classList.remove(
        "show"
    );

}


menuEdit.addEventListener(
    "click",
    () => {

        if (
            menuSongIndex < 0
        )
            return;


        openEdit(
            menuSongIndex
        );

        closeSongMenu();

    }
);


menuFavorite.addEventListener(
    "click",
    async () => {

        if (
            menuSongIndex < 0
        )
            return;


        await toggleFavorite(
            menuSongIndex
        );

        closeSongMenu();

    }
);


menuPlaylist.addEventListener(
    "click",
    () => {

        if (
            menuSongIndex < 0
        )
            return;


        selectedPlaylistSong =
            menuSongIndex;


        closeSongMenu();

        openPlaylistSelector();

    }
);


/* =====================================================
   DELETE SONG
===================================================== */

menuDelete.addEventListener(
    "click",
    async () => {

        if (
            menuSongIndex < 0
        )
            return;


        const song =
            songs[menuSongIndex];


        const confirmed =
            confirm(
                `Delete "${song.title}" from your library?`
            );


        if (!confirmed)
            return;


        await dbDelete(
            SONG_STORE,
            song.id
        );


        playlists.forEach(
            playlist => {

                playlist.songIds =
                    playlist.songIds.filter(
                        id =>
                            id !==
                            song.id
                    );

            }
        );


        for (
            const playlist of playlists
        ) {

            await dbPut(
                PLAYLIST_STORE,
                playlist
            );

        }


        if (
            currentIndex ===
            menuSongIndex
        ) {

            audio.pause();

            audio.src = "";

            currentIndex = -1;

            miniTitle.textContent =
                "No song selected";

            miniArtist.textContent =
                "Choose a song";

            miniCover.textContent =
                "♪";

            bigCover.textContent =
                "♪";

        }


        songs.splice(
            menuSongIndex,
            1
        );


        renderAll();

        closeSongMenu();

    }
);


/* =====================================================
   EDIT
===================================================== */

function openEdit(index) {

    const song =
        songs[index];


    if (!song) return;


    menuSongIndex =
        index;


    editTitle.value =
        song.title;

    editArtist.value =
        song.artist;

    editAlbum.value =
        song.album || "";


    editModal.classList.add(
        "show"
    );

}


editBtn.addEventListener(
    "click",
    () => {

        if (
            currentIndex < 0
        )
            return;


        openEdit(
            currentIndex
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

        if (
            menuSongIndex < 0
        )
            return;


        const song =
            songs[menuSongIndex];


        song.title =
            editTitle.value.trim()
            || "Untitled";


        song.artist =
            editArtist.value.trim()
            || "Unknown Artist";


        song.album =
            editAlbum.value.trim()
            || "My Music";


        const imageFile =
            editCover.files[0];


        if (imageFile) {

            song.cover =
                await fileToDataURL(
                    imageFile
                );

        }


        await dbPut(
            SONG_STORE,
            song
        );


        renderAll();


        if (
            currentIndex ===
            menuSongIndex
        ) {

            updatePlayerUI();

        }


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
   CREATE PLAYLIST
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
    createNewPlaylist
);


async function createNewPlaylist() {

    const name =
        playlistName.value.trim();


    if (!name) {

        alert(
            "Please enter a playlist name."
        );

        return;

    }


    const playlist = {

        id:
            crypto.randomUUID(),

        name:

            name,

        songIds: [],

        createdAt:
            Date.now()

    };


    await dbPut(
        PLAYLIST_STORE,
        playlist
    );


    playlists.push(
        playlist
    );


    playlistName.value = "";

    playlistModal.classList.remove(
        "show"
    );


    renderPlaylists();

}


/* =====================================================
   PLAYLIST SELECTOR
===================================================== */

function openPlaylistSelector() {

    selectorList.innerHTML = "";


    if (!playlists.length) {

        selectorList.innerHTML = `

            <div class="empty">

                <span>♡</span>

                No playlists yet.

            </div>

        `;

    }


    playlists.forEach(
        playlist => {

            const item =
                document.createElement(
                    "button"
                );

            item.className =
                "selector-item";


            const exists =
                selectedPlaylistSong >= 0 &&
                playlist.songIds.includes(
                    songs[
                        selectedPlaylistSong
                    ].id
                );


            if (exists) {

                item.classList.add(
                    "active"
                );

            }


            item.innerHTML = `

                <span>
                    ${escapeHTML(
                        playlist.name
                    )}
                </span>

                <small>
                    ${playlist.songIds.length} songs
                </small>

            `;


            item.addEventListener(
                "click",
                async () => {

                    await toggleSongInPlaylist(
                        playlist.id
                    );

                }
            );


            selectorList.appendChild(
                item
            );

        }
    );


    playlistSelector.classList.add(
        "show"
    );

}


closeSelector.addEventListener(
    "click",
    () => {

        playlistSelector.classList.remove(
            "show"
        );

    }
);


async function toggleSongInPlaylist(
    playlistId
) {

    if (
        selectedPlaylistSong < 0
    )
        return;


    const song =
        songs[
            selectedPlaylistSong
        ];


    const playlist =
        playlists.find(
            item =>
                item.id ===
                playlistId
        );


    if (!playlist)
        return;


    const position =
        playlist.songIds.indexOf(
            song.id
        );


    if (position >= 0) {

        playlist.songIds.splice(
            position,
            1
        );

    }

    else {

        playlist.songIds.push(
            song.id
        );

    }


    await dbPut(
        PLAYLIST_STORE,
        playlist
    );


    renderPlaylists();

    openPlaylistSelector();

}


/* =====================================================
   PLAYER PLAYLIST
===================================================== */

addPlaylistFromPlayer.addEventListener(
    "click",
    () => {

        if (
            currentIndex < 0
        )
            return;


        selectedPlaylistSong =
            currentIndex;


        openPlaylistSelector();

    }
);


/* =====================================================
   OPEN PLAYLIST
===================================================== */

function openPlaylist(id) {

    const playlist =
        playlists.find(
            item =>
                item.id === id
        );


    if (!playlist)
        return;


    currentPlaylistId =
        id;


    playlistViewTitle.textContent =
        playlist.name;


    playlistViewContent.innerHTML = "";


    const hero =
        document.createElement(
            "div"
        );

    hero.className =
        "playlist-hero";


    hero.innerHTML = `

        <div class="playlist-big-icon">
            ♫
        </div>

        <div class="playlist-meta">

            <strong>
                ${escapeHTML(
                    playlist.name
                )}
            </strong>

            <span>
                ${playlist.songIds.length} songs
            </span>

        </div>

    `;


    playlistViewContent.appendChild(
        hero
    );


    const list =
        document.createElement(
            "div"
        );

    list.className =
        "song-list";


    playlist.songIds.forEach(
        songId => {

            const index =
                songs.findIndex(
                    song =>
                        song.id ===
                        songId
                );


            if (index < 0)
                return;


            const song =
                songs[index];


            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "song-item";


            const cover =
                document.createElement(
                    "div"
                );

            cover.className =
                "song-cover";


            if (song.cover) {

                cover.innerHTML =
                    `<img src="${song.cover}" alt="">`;

            }

            else {

                cover.textContent =
                    "♪";

            }


            const info =
                document.createElement(
                    "div"
                );

            info.className =
                "song-info";


            info.innerHTML = `

                <strong>
                    ${escapeHTML(
                        song.title
                    )}
                </strong>

                <span>
                    ${escapeHTML(
                        song.artist
                    )}
                </span>

            `;


            const remove =
                document.createElement(
                    "button"
                );

            remove.className =
                "song-menu";

            remove.textContent =
                "−";


            remove.addEventListener(
                "click",
                async event => {

                    event.stopPropagation();

                    const position =
                        playlist.songIds.indexOf(
                            song.id
                        );


                    if (
                        position >= 0
                    ) {

                        playlist.songIds.splice(
                            position,
                            1
                        );

                    }


                    await dbPut(
                        PLAYLIST_STORE,
                        playlist
                    );


                    openPlaylist(
                        playlist.id
                    );

                    renderPlaylists();

                }
            );


            item.appendChild(
                cover
            );

            item.appendChild(
                info
            );

            item.appendChild(
                remove
            );


            item.addEventListener(
                "click",
                () =>
                    playSong(index)
            );


            list.appendChild(
                item
            );

        }
    );


    if (
        !playlist.songIds.length
    ) {

        list.innerHTML = `

            <div class="empty">

                <span>🎵</span>

                This playlist is empty.

            </div>

        `;

    }


    playlistViewContent.appendChild(
        list
    );


    playlistScreen.classList.add(
        "show"
    );

}


closePlaylistScreen.addEventListener(
    "click",
    () => {

        playlistScreen.classList.remove(
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
            songs.filter(
                song =>

                    song.title
                        .toLowerCase()
                        .includes(query)

                    ||

                    song.artist
                        .toLowerCase()
                        .includes(query)

                    ||

                    (
                        song.album || ""
                    )
                    .toLowerCase()
                    .includes(query)
            );


        renderSongs(
            filtered
        );

    }
);


/* =====================================================
   SORT MENU
===================================================== */

sortBtn.addEventListener(
    "click",
    () => {

        sortMenu.classList.add(
            "show"
        );

    }
);


sortClose.addEventListener(
    "click",
    () => {

        sortMenu.classList.remove(
            "show"
        );

    }
);


sortMenu
    .querySelectorAll(
        "[data-sort]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    sortMode =
                        button.dataset.sort;


                    renderSongs();


                    sortMenu.classList.remove(
                        "show"
                    );

                }
            );

        }
    );


/* =====================================================
   NAVIGATION
===================================================== */

document
    .querySelectorAll(".nav-item")
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".nav-item"
                        )
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "active"
                                )
                        );


                    button.classList.add(
                        "active"
                    );


                    const page =
                        button.dataset.page;


                    if (
                        page === "home"
                    ) {

                        pageTitle.textContent =
                            "My Music 🌸";

                        listTitle.textContent =
                            "All Songs";

                        recentSection.style.display =
                            "";

                        playlistSection.style.display =
                            "";

                        renderSongs();

                    }


                    if (
                        page === "songs"
                    ) {

                        pageTitle.textContent =
                            "All Songs";

                        listTitle.textContent =
                            "All Songs";

                        recentSection.style.display =
                            "none";

                        playlistSection.style.display =
                            "none";

                        renderSongs();

                    }


                    if (
                        page === "favorites"
                    ) {

                        pageTitle.textContent =
                            "Favorites ♡";

                        listTitle.textContent =
                            "Favorite Songs";

                        recentSection.style.display =
                            "none";

                        playlistSection.style.display =
                            "none";


                        renderSongs(
                            songs.filter(
                                song =>
                                    song.favorite
                            )
                        );

                    }


                    if (
                        page === "playlists"
                    ) {

                        pageTitle.textContent =
                            "Playlists ♡";

                        listTitle.textContent =
                            "All Songs";

                        recentSection.style.display =
                            "none";

                        playlistSection.style.display =
                            "";

                        renderPlaylists();

                        renderSongs();

                    }

                }
            );

        }
    );


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text || "";

    return div.innerHTML;

}


/* =====================================================
   START
===================================================== */

init();
