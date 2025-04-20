


const destURL = "https://vouge-pocket-hogf.onrender.com/packages";

// Append div to main section
let mainSection = document.getElementById("destinations");

//Destination Data
let destData = [];

fetchData();

function fetchData(){
    fetch(destURL)
    .then(function(res){
        return res.json();
    })
    .then(function(data){
        appendData(data);
        destData = data;
    })
    .catch(function(error){
        console.log(error);
    })
}



function appendData(data){
    mainSection.innerHTML = "";
    let states = {};
    data.forEach(item => {
        if (!states[item.destination]) {
            states[item.destination] = [];
        }
        states[item.destination].push(item);
    });
    for (let state in states) {
        let cardsList = document.createElement("div");
        cardsList.className = "dest-card-list";
        mainSection.append(cardsList);
        let card = stateCardCreate(state, states[state]);
        cardsList.append(card);
    }
}

function stateCardCreate(state, items, description){
    let card = document.createElement("div");
    card.className = "destcard";
    let h3 = document.createElement("h3");

    h3.className = "dest-card-title";
    h3.textContent = state;
    card.append(h3);


    let carouselDiv = document.createElement("div");
    carouselDiv.className = "dest-carousel";
    let indicatorsDiv = document.createElement("div");
    indicatorsDiv.className = "dest-indicators";
    let imagesDiv = document.createElement("div");
    imagesDiv.className = "dest-carousel-images";
    let index = 0;
    items.forEach(item => {
        let indicator = document.createElement("button");
        indicator.className = "dest-indicator";
        if (index == 0) {
        indicator.classList.add("active");
        }
        indicatorsDiv.append(indicator);
        let img = document.createElement("img");
        img.src = item.image[0];
        img.setAttribute("alt","state");
        imagesDiv.append(img);
        index++;
    });

    carouselDiv.append(indicatorsDiv, imagesDiv);
    card.append(carouselDiv);
    let readMoreBtn = document.createElement("button");
    readMoreBtn.className = "read-more-btn";
    readMoreBtn.textContent = "Explore";

    readMoreBtn.addEventListener("click", function(){
        let state = h3.textContent;
        window.location.href = "./destDetails.html?state=" + state;
    });
    card.append(readMoreBtn);

    // Carousel functionality
    let images = imagesDiv.getElementsByTagName('img');
    let indicators = indicatorsDiv.getElementsByTagName('button');
    let currentIndex = 0;
    let timeoutId;
    
    function showImage(index) {
        if (timeoutId) {
        clearTimeout(timeoutId);
        }
        for (let i = 0; i < images.length; i++) {
        images[i].style.display = "none";
        }
        images[index].style.display = "block";
        for (let i = 0; i < indicators.length; i++) {
        indicators[i].classList.remove("active");
        }
        indicators[index].classList.add("active");
        timeoutId = setTimeout(() => {
        showImage((index + 1) % images.length);
        }, 5000);
    }

    showImage(currentIndex);

    return card;
}