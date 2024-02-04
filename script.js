const ip = document.getElementById("ip");
const btn = document.getElementById("start");

document.addEventListener("DOMContentLoaded", (e) => {
  btn.addEventListener("click", getLocation);
  //get the ip address of user
  const getUserIP = async () => {
    try {
      // Use an API to get the user's IP address
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();

      // Update the HTML with the obtained IP address
      ip.textContent = data.ip;
    } catch (error) {
      console.error("Error getting IP address:", error);
    }
  };

  getUserIP();

  async function getLocation() {
    const mainBody = document.getElementById("main-body");
    const container = document.querySelector(".container");

    togglePage(mainBody, container);

    try {
      // below api will give the object that has latitude and longitude
      const response = await fetch(`https://ipapi.co/${ip.textContent}/json/`);
      const data = await response.json();

      console.log(data);

      //load the details
      loadDetail(data);

      //load the user location on map
      loadMap(data);

      //get the current time and update the details
      updateDetail(data);

      //get all the post offices
      showAllPostOffices(data);

      document.querySelector(".search input").addEventListener("change", filterPostOffices);

      function filterPostOffices() {
        const searchTerm = document
          .querySelector(".search input")
          .value.toLowerCase();
        const cardContainer = document.querySelector(".card-container");
        const cardBodies = cardContainer.querySelectorAll(".card-body");
    
        if (searchTerm.trim() === "") {
          console.log(data);
          showAllPostOffices(data);
        }
    
        cardBodies.forEach((cardBody) => {
          const name = cardBody.querySelector(".value").textContent.toLowerCase();
          if (name.includes(searchTerm)) {
            cardBody.style.display = "block";
          } else {
            cardBody.style.display = "none";
          }
        });
      }


    } catch (error) {
      console.log("Error in getting the location: ", error);
    }
  }

  function loadDetail(data) {
    const ip = document.querySelector(".ip");
    const lat = document.querySelector(".lat");
    const long = document.querySelector(".long");
    const city = document.querySelector(".city");
    const region = document.querySelector(".region");
    const organisation = document.querySelector(".organisation");

    ip.textContent = data.ip;
    lat.textContent = data.latitude;
    long.textContent = data.longitude;
    organisation.textContent = data.org;
    city.textContent = data.city;
    region.textContent = data.region;
  }

  function loadMap(data) {
    const map = document.querySelector(".map");
    map.innerHTML += `
        <iframe src="https://maps.google.com/maps?q=${data.latitude}, ${data.longitude}&output=embed"
            width="1000"
            height="600"
            frameborder="0"
            style="border:0">
        </iframe>
        `;
  }

  function getCurrentTime(data) {
    let zone = data.timezone;

    let timezone_str = new Date().toLocaleString("en-US", {
      timeZone: zone,
    });

    // create new Date object
    let date_obj = new Date(timezone_str);

    // year as (YYYY) format
    let year = date_obj.getFullYear();

    // month as (MM) format
    let month = ("0" + (date_obj.getMonth() + 1)).slice(-2);

    // date as (DD) format
    let date = ("0" + date_obj.getDate()).slice(-2);

    // hours as (HH) format
    let hours = ("0" + date_obj.getHours()).slice(-2);

    // minutes as (mm) format
    let minutes = ("0" + date_obj.getMinutes()).slice(-2);

    // seconds as (ss) format
    let seconds = ("0" + date_obj.getSeconds()).slice(-2);

    // date time in YYYY-MM-DD HH:MM:SS format
    let date_time = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;

    // "2021-03-22 12:30:45"
    return date_time;
  }

  function updateDetail(data) {
    const timezone = document.querySelector(".timezone");
    const date = document.querySelector(".date");
    const pincode = document.querySelector(".pincode");

    let currTime = getCurrentTime(data);

    timezone.textContent = data.timezone;
    date.textContent = currTime;
    pincode.textContent = data.postal;
  }

  function showAllPostOffices(data) {
    let pincode = data.postal;
    const getOffices = async () => {
      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${pincode}`
        );
        const offices = await response.json();

        document.querySelector(".message").textContent = offices[0].Message;
        const cardContainer = document.querySelector(".card-container");

        cardContainer.innerHTML = ""; // Clear previous content

        offices.forEach((office) => {
          let postOffices = office.PostOffice;
          postOffices.forEach((item) => {
            cardContainer.innerHTML += `
              <div class="card-body">
                <div>Name: <span class="value">${item.Name}</span></div>
                <div>Branch Type: <span class="value">${item.BranchType}</span></div>
                <div>Delivery Status: <span class="value">${item.DeliveryStatus}</span></div>
                <div>District: <span class="value">${item.District}</span></div>
                <div>Division: <span class="value">${item.Division}</span></div>
              </div>
            `;
          });
        });
      } catch (error) {
        console.error("Error fetching post offices:", error);
      }
    };
    getOffices();
  }

  

  //   function showAllPostOffices(data){
  //     let pincode = data.postal;
  //     const getOffices = async () => {
  //         const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
  //         const offices = await response.json();

  //         document.querySelector(".message").textContent = offices[0].Message;
  //         const cardContainer = document.querySelector(".card-container");
  //         offices.forEach((office) => {
  //             let postOffices = office.PostOffice;
  //             postOffices.forEach((item) => {

  //                 cardContainer.innerHTML +=
  //                     `
  //                     <div class="card-body">
  //                         <div>Name: <span class="value">${item.Name}</span></div>
  //                         <div>Branch Type: <span class="value">${item.BranchType}</span></div>
  //                         <div>Delivery Status: <span class="value">${item.DeliveryStatus}</span></div>
  //                         <div>District: <span class="value"></span>${item.District}</div>
  //                         <div>Division: <span class="value"></span>${item.Division}</div>
  //                     </div>
  //                     `;
  //             })
  //         })
  //     }
  //     getOffices();
  //   }

  function togglePage(mainBody, container) {
    if (mainBody.style.display === "none") {
      mainBody.style.display = "flex";
      container.style.display = "none";
    } else {
      mainBody.style.display = "none";
      container.style.display = "flex";
    }
  }
});
