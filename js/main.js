var nextPage = ""
var previousPage = ""
var searchTerm = ""

$("#submitButton").on("click", event=>{
	event.preventDefault();
    searchTerm = $("#searchTerm").val();
    if (searchTerm != "") {
        buildFetch(searchTerm, displayVideos);
    }
});

$("#previousButton").on("click", event=>{
	event.preventDefault();
    changePage(previousPage, searchTerm, displayVideos);
});

$("#nextButton").on("click", event=>{
	event.preventDefault();
    changePage(nextPage, searchTerm, displayVideos);
});

function buildFetch(searchTerm, callback) {
    let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchTerm}&type=video&maxResults=10&order=relevance&key=AIzaSyDctvtTXM2bKn0oWVsvR0N9C_Ig-Jfgbqs`;
    fetch(url)
    .then (response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Something went wrong");
        }
    })
    .then(responseJson => callback(responseJson))
    .catch(err => console.log(err));
}

function changePage(page, searchTerm, callback) {
    let url = `https://www.googleapis.com/youtube/v3/search?pageToken=${page}&q=${searchTerm}&type=video&part=snippet&maxResults=10&order=relevance&key=AIzaSyDctvtTXM2bKn0oWVsvR0N9C_Ig-Jfgbqs`;
    fetch(url)
    .then (response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Something went wrong");
        }
    })
    .then(responseJson => callback(responseJson))
    .catch(err => console.log(err));
}

function displayVideos(data) {
    console.log(data);
    if (data.hasOwnProperty('nextPageToken')) {
        nextPage = data.nextPageToken;
        console.log(nextPage);
        $("#nextButton").prop("disabled", false);
    } else {
        $("#nextButton").prop("disabled", true);
    }
    if (data.hasOwnProperty('prevPageToken')) {
        previousPage = data.prevPageToken;
        console.log(previousPage);
        $("#previousButton").prop("disabled", false);
    } else {
        $("#previousButton").prop("disabled", true);
    }
    $(".results").html('');
    data.items.forEach((item,index) => {
        let videoURL = "https://www.youtube.com/watch?v=" + item.id.videoId;
        $('.results').append(`
        <div class="wrapper">
            <div class="imgWrapper">
                <a href="${videoURL}" target="_blank">
                <img src="${item.snippet.thumbnails.default.url}">
                </a>
            </div>
            <div class="textWrapper">
                <a href="${videoURL}" target="_blank">
                <p>${item.snippet.title}</p>
                </a>
            </div>
        </div>`
        );
    })
}

$("#nextButton").prop("disabled", true);
$("#previousButton").prop("disabled", true);