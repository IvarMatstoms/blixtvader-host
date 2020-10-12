var searchResult = ""
var favorites = []


function toggleFavorite(name) {
    loadFavorites()
    var index = favorites.indexOf(name);
    var value
    if (index > -1) {
        favorites.splice(index, 1);
        value = false
    } else {
        favorites.push(name)
        value = true
    }
    saveFavorites()
    return value
}

function isFavorite(name) {
    return favorites.includes(name)
}

function addFavorite(name) {
    loadFavorites()
    if (favorites.includes(name)) {
        return
    }
    favorites.push(name)
    saveFavorites()
}

function removeFavorite(name) {
    loadFavorites()

    var index = favorites.indexOf(name);
    if (index > -1) {
        favorites.splice(index, 1);
        saveFavorites()
    }
}


function getDefaultName() {
    var value = localStorage.getItem('defaultName')
    if (!value) {
        return ""
    }
    return value
}

function setDefault(newName, newLat, newLon) {
    localStorage.setItem("defaultName", newName)
    localStorage.setItem("defaultLat", newLat)
    localStorage.setItem("defaultLon", newLon)
}

function saveFavorites() {
    localStorage.setItem("favorites", JSON.stringify(favorites))
}

function loadFavorites() {
    if (!localStorage.getItem('favorites')) {
        favorites = [];
        return;
    }
    favorites = JSON.parse(localStorage.getItem('favorites'))
}


function setLocation(name) {
    for (i = 0; i < geonames.length; i++) {
        if (geonames[i][0].toLowerCase() === name.toLowerCase()) {
            //$.txt($.id.searchResultText, geonames[i][0] + "?")
            lat = geonames[i][1]
            lon = geonames[i][2]
            //$.id.locationSearchBar.unfocus()
            document.activeElement.blur();
            $.txt($.id.searchResultText, "")
            loadWeather()
            currentLocation = geonames[i][0]
            updateSearchUi()
            console.log("Location set")
            break
        }
    }
}

function updateSearchUi() {
    setFavStar(isFavorite(currentLocation))
    updateFavButtons()
    updateDefaultButton()
    $.id.locationSearchBar.value = currentLocation
}


function setFavStar(state) {
    if (state) {
        $.attr($.id.searchFavIcon, "src", "res/fav_filled.svg")
    } else {
        $.attr($.id.searchFavIcon, "src", "res/fav.svg")

    }
}

function setShowFavorites(state) {
    if (state) {
        $.id.searchFavorites.classList.add("active")
        $.id.searchResult.classList.remove("active")
    } else {
        $.id.searchFavorites.classList.remove("active")
        $.id.searchResult.classList.add("active")
    }
}

function toggleFav() {
    value = toggleFavorite(currentLocation)
    setFavStar(value)
    updateFavButtons()
}

function setDefaultCurrent() {
    setDefault(currentLocation, lat, lon)
    updateDefaultButton()
}

function updateDefaultButton() {
    setDefaultButton(getDefaultName() === currentLocation)

}

function setDefaultButton(state) {
    if (state) {
        $.attr($.id.searchHeartIcon, "src", "res/heart_filled.svg")
    } else {
        $.attr($.id.searchHeartIcon, "src", "res/heart.svg")

    }
}

function updateFavButtons() {
    var parent = $.id.searchFavorites
    $.empty(parent)

    var i;
    var cls;
    for (i = 0; i < favorites.length; i++) {
        if (favorites[i] === currentLocation) {
            cls = "s-favorite current"
        } else {
            cls = "s-favorite"
        }
        node = $.tc(
            "div", {"class": cls},
            [
                $.create("span", {"class": "s-favorite-name"}, favorites[i])
            ]
        )
        parent.appendChild(node)
        $.click(node, function (n) {
            setLocation(this)
        }.bind(favorites[i]))
    }
    /*
    *                     <div class="s-favorite">
                        <span class="s-favorite-name">Linköping</span>
                    </div>*/
}

function initSearch() {
    setShowFavorites(true)
    $.keyup($.id.locationSearchBar, onSearchKey)
    $.click($.id.searchFavIcon, (toggleFav))
    $.click($.id.searchHeartIcon, setDefaultCurrent)
    $.focusout($.id.locationSearchBar, function () {
        setShowFavorites(true)
        $.id.locationSearchBar.value = currentLocation
    })
}

function onSearchKey(ev) {
    if (ev.key === "Enter") {
        setLocation(searchResult)
        setShowFavorites(true)
        return
    }
    updateSearch()
}

function updateSearch() {
    var search = $.id.locationSearchBar.value
    //var results = geonames.filter(function(name){return name[0].toLowerCase().startsWith(search.toLowerCase())})
    var i;
    for (i = 0; i < geonames.length; i++) {
        if (geonames[i][0].toLowerCase().startsWith(search.toLowerCase())) {
            $.txt($.id.searchResultText, geonames[i][0] + "?")
            searchResult = geonames[i][0]
            setShowFavorites(false)
            break
        }
    }

}

function defaultWeather() {
    loadFavorites()

    lat = "59.63607"
    lon = "17.07768"
    currentLocation = "Enköping"

    //$.id.locationSearchBar.unfocus()
    document.activeElement.blur();
    $.txt($.id.searchResultText, "")
    loadWeather()

    console.log("Location set")
    updateSearchUi()
}

onInit(initSearch)
//onInit(defaultWeather)