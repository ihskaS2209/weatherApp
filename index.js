const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAcessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const errorHandling = document.querySelector(".error-handling");


const API_key = "d075d57c744fa8e776500609735932d8";
let currentTab = userTab;
currentTab.classList.add("current-tab");
getFromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab !== currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAcessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getFromSessionStorage(); // local storage ko check krenge ki current location sav hogi uss hisaab se weather show krenge
        }
    }
}


userTab.addEventListener('click', ()=>{
    console.log("asdf");
    switchTab(userTab);
});

searchTab.addEventListener('click', ()=>{
    console.log("asdf2");
    switchTab(searchTab);
});


function getFromSessionStorage(){
    const localCoordinates = sessionStorage.getItem('user-coordinates');
    if(!localCoordinates){
        grantAcessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lattitude, longitude} = coordinates;
    //grant container hataao
    grantAcessContainer.classList.remove("active");
    //loading screen dikhaao
    loadingScreen.classList.add("active");

    // api call krdi

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lattitude}&lon=${longitude}&appid=${API_key}&units=metric`);

        const data = await response.json();

        // data aagya to loader to hta do
        loadingScreen.classList.remove("active");

        // user info wale container ko show krenge aur data ko dynamically render krenge jo bhi city search ki hai acc to that.
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

    }
    catch(err){
        loadingScreen.classList.remove("active");
    }
}

function renderWeatherInfo(weatherInfo){
    const cityName = document.querySelector('[data-cityName]');
    const countryIcon = document.querySelector('[data-countryIcon]');
    const desc = document.querySelector('[data-weatherDesc');
    const weatherIcon = document.querySelector('[data-weatherIcon]');
    const temp = document.querySelector('[data-temp]');
    const windspeed = document.querySelector('[data-windSpeed]');
    const humidity = document.querySelector('[data-humidity]');
    const cloudiness = document.querySelector('[data-cloudiness]');

    // fetch values form weather data and render it
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    console.log(countryIcon.src);
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp.toFixed(2)} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

    if(cityName.innerText === undefined){
        console.log("asdfgwerf");
        userInfoContainer.classList.remove("active");
        errorHandling.classList.add("active");
    }

}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //hw
        // show an alert for no geolocation support
    }
}

function showPosition(position){
    const userCoordinates = {
        lattitude :  position.coords.latitude,
        longitude :  position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));

    fetchUserWeatherInfo(userCoordinates);
}


const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener('click', getLocation);


const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    let cityName = searchInput.value;
    if(cityName==="") return;

    fetchSearchWeatherInfo(cityName);
    
});

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAcessContainer.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);

        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        console.log("error "+err);
        userInfoContainer.classList.remove("active");
        errorHandling.classList.add("active");
    }
}







// theory about the weather application


// console.log("This is Sakshi Saxena");
// function renderWeatherInfo(data){
//     let newPara = document.createElement('p');
//     newPara.textContent = data.main["temp"]+"°C";
//     // newPara.textContent = `${data?.main?.temp.toFixed(2)} °C`;

//     document.body.appendChild(newPara);
// }



// async function fetchWeatherDetails(){
//     // let latitude = 15.3333;
//     // let longitude = 74.0833;
//     let city = "ghaziabad";

//     try{
//         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);
    
//         const data = await response.json();
//         console.log("Weather data ", data);
    
//         renderWeatherInfo(data);
        
//     }
//     catch(e){
//         console.log(e);
//     }
// }


// async function getCustomWeatherDetails(){
//     // let lattitude = 28.6667;
//     // let longitude = 77.4333;

//     try{
//         let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lattitude}&lon=${longitude}&appid=${API_key}&units=metric`);
    
//         let data = await response.json();
//         console.log(data);
    
//         renderWeatherInfo(data);
//     }
//     catch(e){
//         console.log("Error " + e);
//     }
// }

// function switchTab(clickedTab){
//     apiErrorContainer.classList.remove("active");

//     if(clickedTab !== currentTab){
//         currentTab.classList.remove("current-tab");
//         currentTab = clickedTab;
//         currentTab.classList.add("current-tab");

//         if(!searchForm.classList.contains("active")){
//             userInfoContainer.classList.remove("active");
//             grantAcessContainer.classList.remove("active");
//             searchForm.classList.add("active");
//         }
//         else{
//             searchForm.classList.remove("active");
//             userInfoContainer.classList.remove("active");
//             getFromSessionStorage();
//         }
//     }
// }


// function getLocation() {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(showPosition);
//     } else {
//       console.log("No geolocation support");
//     }
// }
  
// function showPosition(position) {
    // let lattitude =  position.coords.latitude;
    // let longitude =  position.coords.longitude;
//     console.log(`Lattitude-${lattitude}, Longitude-${longitude}`);
// }

