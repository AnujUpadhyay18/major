// Get selected card data from localStorage
let selectedCardData = JSON.parse(localStorage.getItem("selectedCardData"));

// Set price
let priceShow = document.getElementById("priceshow");
priceShow.textContent = selectedCardData.price;

// Image Slideshow
let imgSliderContainer = document.getElementById("img-slider");
let contentContainer = imgSliderContainer.querySelector(".w3-content");

selectedCardData.image.forEach((imageUrl, index) => {
  let slide = document.createElement("div");
  slide.className = "mySlides";

  let image = document.createElement("img");
  image.src = imageUrl;

  slide.appendChild(image);
  contentContainer.appendChild(slide);

  if (index === 0) {
    slide.style.display = "block";
  }
});

let slideIndex = 0;
let slides = imgSliderContainer.getElementsByClassName("mySlides");
let totalSlides = slides.length;

setInterval(() => {
  slides[slideIndex].style.display = "none";
  slideIndex = (slideIndex + 1) % totalSlides;
  slides[slideIndex].style.display = "block";
}, 3000);

// *********************************************************************

let main_section = document.getElementById("card-description");
let staticDescrElement = document.getElementById("staticdescr");

let Api = "http://localhost:3000/package/details";
let package_id = selectedCardData.id;

// Fetch package details
function fetchData(url) {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log("Fetched data:", data);

      // Check if data is valid
      if (!data) {
        throw new Error("No data received");
      }

      displayData(data);
    })
    .catch(err => {
      console.error("Fetch error:", err.message);
      main_section.innerHTML = `<p style="color:red;">Failed to load package details. Please try again later.</p>`;
    });
}
fetchData(`${Api}/${package_id}`);

// Create the tour details card
function createCard(item) {
  let card = document.createElement("div");
  card.className = "details-card";
  card.id = item.id;

  let h1 = document.createElement("h1");
  h1.className = "details-card-name";
  h1.textContent = item.title;

  let p1 = document.createElement("p");
  p1.className = "details-card-duration";
  p1.innerHTML = `<span><i class="fa-solid fa-clock fa-spin"></i></span> ${item.duration}`;

  let p2 = document.createElement("p");
  p2.className = "details-card-location";
  p2.innerHTML = `<span><i class="fa-solid fa-location-dot fa-flip"></i></span> ${item.location}`;

  let p3 = document.createElement("p");
  p3.className = "details-card-destination";
  p3.innerHTML = `<span><i class="fa-solid fa-map-location"></i></span> ${item.destination}`;

  let h2 = document.createElement("h2");
  h2.className = "details-card-tour";
  h2.textContent = "Tour Itinerary";

  let detailsDiv = document.createElement("div");
  detailsDiv.className = "details-div";

  let CardDetails = document.createElement("details");
  CardDetails.className = "details-card-details";

  let summary = document.createElement("summary");
  summary.innerHTML = `Description <i class="fa-sharp fa-solid fa-angle-down"></i>`;
  summary.addEventListener("click", function () {
    toggleArrow(this.querySelector("i"));
  });

  let ul = document.createElement("ul");
  if (Array.isArray(item.description)) {
    item.description.forEach((liText) => {
      let li = document.createElement("li");
      li.textContent = liText;
      ul.appendChild(li);
    });
  } else {
    let li = document.createElement("li");
    li.textContent = item.description;
    ul.appendChild(li);
  }

  CardDetails.append(summary, ul);
  detailsDiv.appendChild(CardDetails);
  card.append(h1, p1, p2, p3, h2, detailsDiv);

  return card;
}

// Render data into DOM
function displayData(data) {
  main_section.innerHTML = "";

  let cardList = document.createElement("div");
  cardList.className = "details-card-list";

  if (Array.isArray(data)) {
    data.forEach(item => {
      let detailCard = createCard(item);
      cardList.appendChild(detailCard);
    });
  } else {
    let detailCard = createCard(data);
    cardList.appendChild(detailCard);
  }

  main_section.append(cardList, staticDescrElement);
}

// Arrow toggle in description
function toggleArrow(icon) {
  icon.classList.toggle("fa-angle-down");
  icon.classList.toggle("fa-angle-up");
}

// Book Now Button Click
let BookNowBtn = document.getElementById("booknow");

BookNowBtn.addEventListener("click", () => {
  let user = JSON.parse(localStorage.getItem('user')) || null;

  if (!user) {
    alert("Please login first");
    window.location.href = "login.html";
  } else {
    window.location.href = "checkout_tour.html";
  }
});

// Additional book button logic
let book = document.getElementById("booknow");
book.addEventListener("click", () => {
  console.log("hello");
  window.location.href = 'booking.html';
});
