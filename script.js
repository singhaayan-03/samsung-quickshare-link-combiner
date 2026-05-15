    const input = document.getElementById("codeInput");
    const notification = document.getElementById("notification");
    const historyContainer = document.getElementById("historyContainer");
    const themeToggle = document.getElementById("themeToggle");
    const liveLink = document.getElementById("liveLink");

    const baseURL = "https://quickshare.samsungcloud.com/";

    // DEFAULT DARK MODE

    if(localStorage.getItem("theme") === "light"){

      document.body.classList.add("light");
      themeToggle.innerHTML = "🌙";

    }

    // THEME TOGGLE

    themeToggle.addEventListener("click",()=>{

      document.body.classList.toggle("light");

      if(document.body.classList.contains("light")){

        localStorage.setItem("theme","light");
        themeToggle.innerHTML = "🌙";

      }
      else{

        localStorage.setItem("theme","dark");
        themeToggle.innerHTML = "☀️";

      }

    });

    // LIVE LINK UPDATE

    input.addEventListener("input",()=>{

      liveLink.textContent =
      baseURL + encodeURIComponent(input.value);

    });

    // NOTIFICATION

    function showNotification(message){

      notification.style.display = "block";

      notification.innerHTML = message;

      clearTimeout(notification.timeout);

      notification.timeout = setTimeout(()=>{

        notification.style.display = "none";

      },2000);

    }

    // GET FULL LINK

    function getLink(){

      return baseURL + encodeURIComponent(input.value.trim());

    }

    // SAVE HISTORY

    function saveHistory(link){

      let history =
      JSON.parse(localStorage.getItem("qs_history")) || [];

      history.unshift(link);

      history = [...new Set(history)];

      // KEEP ONLY LAST 3

      if(history.length > 3){

        history = history.slice(0,3);

      }

      localStorage.setItem(
        "qs_history",
        JSON.stringify(history)
      );

      renderHistory();

    }

    // RENDER HISTORY

    function renderHistory(){

      let history =
      JSON.parse(localStorage.getItem("qs_history")) || [];

      historyContainer.innerHTML = "";

      history.forEach(link=>{

        const div = document.createElement("div");

        div.className = "history-item";

        div.textContent = link;

        div.onclick = ()=>{

          window.open(link,"_blank");

        };

        historyContainer.appendChild(div);

      });

    }

    // CLEAR HISTORY

    function clearHistory(){

      localStorage.removeItem("qs_history");

      renderHistory();

      showNotification("History cleared.");

    }

    // OPEN LINK

    function openLink(){

      const code = input.value.trim();

      if(!code){

        showNotification("Please enter a code first.");

        return;

      }

      const fullLink = getLink();

      saveHistory(fullLink);

      showNotification("Redirecting...");

      window.open(fullLink,"_blank");

    }

    // COPY LINK

    async function copyLink(){

      const code = input.value.trim();

      if(!code){

        showNotification("Please enter a code first.");

        return;

      }

      const fullLink = getLink();

      saveHistory(fullLink);

      try{

        await navigator.clipboard.writeText(fullLink);

        showNotification("Link copied.");

      }
      catch{

        showNotification("Clipboard permission denied.");

      }

    }

    // ENTER KEY

    input.addEventListener("keypress",(e)=>{

      if(e.key === "Enter"){

        openLink();

      }

    });

    // INITIAL HISTORY

    renderHistory();