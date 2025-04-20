

let sorting = document.querySelector("#sorting");
let priceFilter = document.querySelector("#pricefilter");
let destinationContainer = document.getElementById("destination-content");
let durationFilter = document.querySelector("#durationfilter");
let paginationButtonsContainer = document.getElementById("pagination-buttons");
let searchInput = document.getElementById("search");

let currentPage = 1;
let cardsPerPage = 4;
let Api = "https://vouge-pocket-hogf.onrender.com/packages";

function fetchData(url) {
    fetch(url)
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            console.log(data);
            fetchedData = data;
            displayCard(data);
            displayPaginationButtons(data);
        })
        .catch(function(err) {
            console.log(err);
        });
}
fetchData(Api);

// ***************************************
// soting

sorting.addEventListener('change', () => {
    if (sorting.value !== "") {
        if (sorting.value == "asc") {
            fetchData(`${Api}?_sort=price&_order=asc`);
        } else if (sorting.value == "desc") {
            fetchData(`${Api}?_sort=price&_order=desc`);
        }
    } else {
        fetchData(Api);
    }
})

 // ***************************************
// Filter

priceFilter.addEventListener('change', () => {
let selectedPrice = document.querySelector('input[name="price_radio"]:checked').value;
let url;

if (selectedPrice) {
    if (selectedPrice === "3000,5000") {
        url = `${Api}?price_gte=3000&price_lte=5000`;
    } else if (selectedPrice === "5000,10000") {
        url = `${Api}?price_gte=5000&price_lte=10000`;
    } else if (selectedPrice === "10000,20000") {
        url = `${Api}?price_gte=10000&price_lte=20000`;
    } else if (selectedPrice === "20000,Above") {
        url = `${Api}?price_gte=20000`;
    }
    fetchData(url);
} else {
    fetchData(Api);
}
});

// ***************************************
// Duration Filter

durationFilter.addEventListener('change', () => {
let selectedDuration = document.querySelector('input[name="duration_radio"]:checked').value;
let url;

if (selectedDuration) {
    url = `${Api}?duration=${selectedDuration}`;
    fetchData(url);
} else {
    fetchData(Api);
}
});

// ***************************************
    // Search

    let fetchedData;

searchInput.addEventListener('input', () => {
const searchTerm = searchInput.value.toLowerCase();
const filteredData = fetchedData.filter(item => item.destination.toLowerCase().includes(searchTerm));
displayCard(filteredData);
displayPaginationButtons(filteredData);
});

// ********************************************

function createCard(item) {
    let card = document.createElement("div");
    card.className = "destination-card";
    // card.setAttribute("data-id",item.id);
    card.id=item.id;

    let cardImg = document.createElement("div");
    cardImg.className = "destination-img-card";

    // *******************************************
    let img = document.createElement("img");
    img.className = "destination-img";
    img.src = item.image[0];
    img.setAttribute("alt", "Pic");

    cardImg.append(img);

    // ************************************************

    let cardBody = document.createElement("div");
    cardBody.className = "destination-card-body";

    let cardDesBody = document.createElement("div");
    cardDesBody.className = "destination-duration-price";
    cardDesBody.style = "display:flex; justify-content:space-between; align-item:center";

    let p1 = document.createElement("p");
    p1.className = "destination-plan";
    p1.textContent = item.duration;

    let p2 = document.createElement("p");
    p2.className = "destination-price";
    p2.textContent = "₹" + item.price;

    cardDesBody.append(p1, p2);

    let h3 = document.createElement("h2");
    h3.className = "destination-title";
    h3.textContent = item.title;

    let p3 = document.createElement("p");
    p3.className = "destination-name";
    p3.textContent = item.destination;

    let p4 = document.createElement("p");
    p4.className = "destination-location";
    p4.textContent = item.location;
    
    let cardBtn = document.createElement("div");
    cardBtn.className = "destination-card-button";

    cardBtn.style = "display: flex; margin-top:10px; justify-content: space-between";

    let Btn1 = document.createElement("button");
    Btn1.className = "destination-button";
    Btn1.textContent = "Add To Card";

    Btn1.addEventListener("click", function(){
        setLocalStorageData(item);
        redirectToDetailsPage();
    });


    let Btn2 = document.createElement("button");
    Btn2.className = "destination-button";
    Btn2.textContent = "View Details";

    Btn2.addEventListener("click", function(){
        setLocalStorageData(item);
        redirectToDetailsPage();
    });

    cardBtn.append(Btn1, Btn2);

    cardBody.append(cardDesBody, h3, p3, p4, cardBtn);

    // ******************************************************

    card.append(cardImg, cardBody);

    return card;
}

function displayCard(data) {
    destinationContainer.innerHTML = "";
    let cardList = document.createElement("div");
    cardList.className = "destination-card-list";

    let startIndex = (currentPage - 1) * cardsPerPage;
    let endIndex = startIndex + cardsPerPage;
    let paginatedData = data.slice(startIndex, endIndex);

    paginatedData.forEach(item => {
        let Card = createCard(item);
        cardList.append(Card);
    });

    destinationContainer.append(cardList);
}

function displayPaginationButtons(data) {
    let totalPages = Math.ceil(data.length / cardsPerPage);
    paginationButtonsContainer.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        let button = document.createElement("button");
        button.textContent = i;
        button.addEventListener("click", function() {
            currentPage = i;
            displayCard(data);
        });
        paginationButtonsContainer.append(button);
    }
}

function ClearFilter() {
    window.location.reload();
}

function setLocalStorageData(item) {
    localStorage.setItem("selectedCardData", JSON.stringify(item));
}

function redirectToDetailsPage() {
    window.location.href = "details.html";
}

let selectedCardData = JSON.parse(localStorage.getItem("selectedCardData"));
localStorage.removeItem("selectedCardData");