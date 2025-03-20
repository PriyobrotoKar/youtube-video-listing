const url = "https://api.freeapi.app/api/v1/public/youtube/videos?limit=50";

const videoListContainer = document.querySelector(".video-list-container");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-btn");

let videos = [];

async function fetchVideos() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }

    return data.data.data;
  } catch (error) {
    console.error("Error while fetching videos: ", error);
  }
}

function renderVideos() {
  console.log(videos);
  videos.forEach((element) => {
    const { snippet, id, statistics, contentDetails } = element.items;

    const videoContainer = document.createElement("div");
    videoContainer.innerHTML = `
    <div class="video-card">
      <a href="https://www.youtube.com/watch?v=${id}" target="_blank">
	<div class="video-thumbnail">
	  <img
	    src=${snippet.thumbnails.high.url}
	    alt="Video Thumbnail"
	    width="800"
	    height="500"
	  />
	  <div class="video-duration">
	    ${formatDuration(contentDetails.duration)}
	  </div>
	</div>
	<div class="video-details">
	  <div class="channel-image">
	    <img
	      src="https://yt3.ggpht.com/ytc/AOPolaTLK52bUQ_YHxgb7RK8GMt_bksIMavy-aEZ9fUOvg=s240-c-k-c0x00ffffff-no-rj"
	      alt="Channel Image"
	      width="40"
	      height="40"
	    />
	  </div>
	  <div>
	    <div class="video-title">
	      ${snippet.title}
	    </div>
	    <div class="video-info">
	      <div>${snippet.channelTitle}</div>
	      <div>${formatViews(statistics.viewCount)} · ${formatTime(snippet.publishedAt)} ago</div>
	    </div>
	  </div>
	</div>
	</a>
    </div>
    `;

    videoListContainer.appendChild(videoContainer);
  });
}

searchButton.addEventListener("click", async () => {
  const searchQuery = searchInput.value.trim().toLowerCase();
  if (!searchQuery) {
    return;
  }

  const results = videos.filter(({ items }) =>
    items.snippet.title.toLowerCase().includes(searchQuery),
  );

  videoListContainer.innerHTML = "";
  videos = results;
  renderVideos();
});

fetchVideos()
  .then((data) => {
    videos = data;
    renderVideos();
  })
  .catch(console.error);

function formatTime(time) {
  const diff = new Date() - new Date(time);

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const years = Math.floor(days / 365);

  return (
    (years && `${years} years`) ||
    (days && `${days} days`) ||
    (hours && `${hours}`) ||
    (minutes && `${minutes} mins`) ||
    (seconds && `${seconds} seconds`)
  );
}

function formatDuration(duration) {
  let hours = "0",
    minutes = "00",
    seconds = "00";

  const hasHour = duration.indexOf("H");
  const hasMinutes = duration.indexOf("M");
  const hasSeconds = duration.indexOf("S");

  if (hasHour > -1) {
    hours = duration.substring(2, hasHour);
  }

  if (hasMinutes > -1) {
    if (hasHour > -1) {
      minutes = duration.substring(hasHour + 1, hasMinutes);
    } else {
      minutes = duration.substring(2, hasMinutes);
    }
    minutes = minutes.padStart(2, "0");
  } else if (hasHour > -1) {
    minutes = "00";
  }

  if (hasSeconds > -1) {
    if (hasMinutes > -1) {
      seconds = duration.substring(hasMinutes + 1, hasSeconds);
    } else if (hasHour > -1) {
      seconds = duration.substring(hasHour + 1, hasSeconds);
    } else {
      seconds = duration.substring(2, hasSeconds);
    }
    seconds = seconds.padStart(2, "0");
  }

  if (hours !== "0") {
    return `${hours}:${minutes}:${seconds}`;
  } else {
    return `${minutes}:${seconds}`;
  }
}

function formatViews(views) {
  const length = views.length;
  if (length <= 3) {
    return views;
  }

  if (length <= 6) {
    return `${views.slice(0, length - 3)}K`;
  }

  if (length <= 9) {
    return `${views.slice(0, length - 6)}M`;
  }

  return `${views.slice(0, length - 9)}B`;
}
