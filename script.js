var grantloc = document.querySelector(".grantlocation")
var userweather = document.querySelector(".user-weather-deatails")
var loadingTab = document.querySelector(".loading")
var searchweather = document.querySelector(".searching-weather")
var searchTabData = document.querySelector(".search-weather-deatails")
var  userTab= document.querySelector("[user-weather]")
var searchTab = document.querySelector("[search-weather]")
var currentTab = userTab;
var errpage = document.querySelector(".err404page");
var textinput = document.querySelector(".searchcity");
var search = document.querySelector(".submit");




currentTab.classList.add("currentTab");
const APIkey = "37ca13613154fceee1e29d607c35e3b7";
getfromSessionStorage();

userTab.addEventListener("click",()=>{
    switchTabs(userTab);
});
searchTab.addEventListener("click",()=>{
    switchTabs(searchTab);
});
function switchTabs(clickedTab){
    if(currentTab!=clickedTab){
        currentTab.classList.remove("currentTab");
        currentTab = clickedTab;
        currentTab.classList.add("currentTab");


        if(!searchweather.classList.contains("active")){
            searchweather.classList.add("active");
            grantloc.classList.remove("active");
            userweather.classList.remove("active");
        }
        else{
            searchweather.classList.remove("active");
            userweather.classList.remove("active");
            grantloc.classList.add("active");    
            getfromSessionStorage();
        }
    }
}
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        //agar local coordinates nahi mile
        grantloc.classList.add("active");
    }
    else {
        grantloc.classList.remove("active");
        const coordinates = JSON.parse(localCoordinates);
        fetchuserweather(coordinates);
    }

}

async function fetchuserweather(usercoordinates){
    const {lat,lon} = usercoordinates;
    console.log(lon);
    loadingTab.classList.add("active");
    try{
        let response =await  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}`);
        let output   = await response.json();
        loadingTab.classList.remove("active");
        grantloc.classList.remove("active");
        userweather.classList.add("active");
        renderUserWeather(output);
        console.log(output);
    }
    catch(e){
        loadingTab.classList.remove("active");
    }
}

function renderUserWeather(data){
    var city = document.querySelectorAll(".city");
    var flag = document.querySelectorAll(".countryflag");
    var weatherdesc = document.querySelectorAll(".weather-description");
    var weatherimg = document.querySelectorAll(".weather-img");
    var temp = document.querySelectorAll(".temp");
    var cloudsval = document.querySelectorAll(".cloudsvalue");
    var windsoeedval = document.querySelectorAll(".windspeedvalue");
    var humidityval = document.querySelectorAll(".Humidityvalue");

    city.forEach((e)=>{
        e.textContent = data?.name;
    });
    flag.forEach((e)=>{
        e.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    })
    weatherdesc.forEach((e=>{
        e.textContent = data?.weather?.[0]?.main;
    }))
    
    weatherimg.forEach((e=>{
        e.src = `https://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    }))
    
    temp.forEach((e=>{
        e.innerHTML =  `${((data?.main?.temp)-273).toFixed(1)}`+"<sup>o</sup>C";
    }))
    
    cloudsval.forEach((e=>{
        e.innerHTML = `${data?.clouds?.all}`+"%";
    }))
    
    windsoeedval.forEach((e=>{
        e.textContent = `${data?.wind?.speed}` + "m/s";
    }))
    
    humidityval.forEach((e=>{
        e.textContent = `${data?.main?.humidity}`+"%";
    }))
    
}

var grantbutton = document.querySelector(".grantbutton");
    grantbutton.addEventListener("click",()=>{
        getLocation();
        grantloc.classList.remove("active");
        getfromSessionStorage();  
    }
)



function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        //HW - show an alert for no gelolocation support available
    }
}

function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchuserweather(userCoordinates);

}
textinput.addEventListener("keypress", function(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      event.preventDefault();
      var cityname = textinput.value;
      getweatherdetailswithcity(cityname);
    }
  });

search.addEventListener("click",()=>{
    var cityname = textinput.value;
    getweatherdetailswithcity(cityname);
})

async function getweatherdetailswithcity(city){
    try{
        let response =await  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}`);
        let output   = await response.json();
       
        
        if(output?.cod == 404){
            searchTabData.classList.remove("active");
            errpage.classList.add("active");
            textinput.value="";
        }
        else{
            errpage.classList.remove("active");
            searchTabData.classList.add("active");
            renderUserWeather(output);
            console.log(output);
            
            
        }
       
        
    }
    catch(e){
        console.log(e);
    }
}