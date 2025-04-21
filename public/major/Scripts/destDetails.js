const destURL = "http://localhost:3000/package";

// Append div to main section
let mainSection = document.getElementById("destDetail");

//Destination Data
let destData = [];

fetchData();

function fetchData(){
    let urlParams = new URLSearchParams(window.location.search);
    let selectedState = urlParams.get('state');
    fetch(destURL)
    .then(function(res){
        return res.json();
    })
    .then(function(data){
        let filteredData = data.filter(item => item.destination === selectedState);
        appendData(filteredData);
        destData = filteredData;
    })
    .catch(function(error){
        console.log(error);
    })
}

function appendData(data){
    mainSection.innerHTML = "";
    for(let i = 0; i < data.length; i++) {
        let card = createDestCard(data[i]);
        mainSection.append(card);
    }
}

function createDestCard(data) {
    let card = document.createElement("div");
    card.className = "destcard";

    let h3 = document.createElement("h3");
    h3.className = "dest-card-title";
    h3.textContent = data.title;
    card.append(h3);

    let img = document.createElement("img");
    img.src = data.image[0];
    img.alt = data.title;
    card.append(img);

    let duration = document.createElement("p");
    duration.className = "dest-duration"
    duration.textContent = "Duration: " + data.duration;
    card.append(duration);

    let p = document.createElement("p");
    p.textContent = data.description[0];
    card.append(p);

    let price = document.createElement("span");
    price.className = "dest-card-price";
    price.textContent = "Price: " + data.price;
    card.append(price);

    let tourList = document.createElement("ul");
    tourList.className = "dest-card-tour-list";
    for(let i = 0; i < data.tour.length; i++) {
        let tourItem = document.createElement("li");
        tourItem.textContent = data.tour[i].title + ": " + data.tour[i].description;
        tourList.append(tourItem);
    }
    card.append(tourList);


    let viewDetailsBtn = document.createElement("button");
    viewDetailsBtn.textContent = "View Details";

    viewDetailsBtn.addEventListener("click", function() {
        localStorage.setItem("selectedCardData",JSON.stringify(data));
        window.location.href = "details.html";
    });
    card.append(viewDetailsBtn);


    return card;
}