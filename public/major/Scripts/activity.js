const slides = document.querySelectorAll('.slide')
const slides2 = document.querySelectorAll('.slide2')
const slides3 = document.querySelectorAll('.slide3')
const slides4 = document.querySelectorAll('.slide4')
const slides5 = document.querySelectorAll('.slide5')
const slides6 = document.querySelectorAll('.slide6')
let i=0
let choice = " "
let action = " "
function plus(value) {
    switch (value) {
        case 1: choice = Array.from(slides);
            action = "slide"            
            break;
        case 2: choice = Array.from(slides2);
            action = "slide2"            
            break;

        case 3: choice = Array.from(slides3);
            action = "slide3"            
            break;
        case 4: choice = Array.from(slides4);
            action = "slide4"            
            break;
        case 5: choice = Array.from(slides5);
            action = "slide5"            
            break;
        case 6: choice = Array.from(slides6);
            action = "slide6"            
            break;
    }//switch case end here
    
    choice.forEach(
        (action, index) => {
            action.style.left = `${index * 100}%`
        }
    )

    if (i === 2) {
        i = 0
        on()
    }
    else {
        i++
        on()
    }

}//function end here

//minus function start here
function minus(value) {

    switch (value) {
        case 1: choice = Array.from(slides);
            action = "slide"
            break;
        case 2: choice = Array.from(slides2);
            action = "slide2"            
            break;

        case 3: choice = Array.from(slides3);
            action = "slide3"            
            break;
        case 4: choice = Array.from(slides4);
            action = "slide4"  
            break;
        case 5: choice = Array.from(slides5);
            action = "slide5"            
            break;
        case 6: choice = Array.from(slides6);
            action = "slide6"            
            break;
    }//switch end here

    choice.forEach(
        (action, index) => {
            action.style.left = `${index * 100}%`
        }
    )


    console.log("Received value:", value);
    if (i === 0) {
        i = 2
        on()
    }
    else {
        i--
        on()
    }
}//function end here




function on() {
    choice.forEach((action, index) => {
        action.style.transform = `translateX(-${i * 100}%)`
    });

}


