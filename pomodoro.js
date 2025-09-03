const fulScr_Btn=document.getElementById("fulscrBtn");

fulScr_Btn.addEventListener("click",()=>{
    if(!document.fullscreenElement){
        document.documentElement.requestFullscreen();
        fulScr_Btn.innerHTML=`<img src="icons/icons-normal-screen.png">`;
    } else {
        document.exitFullscreen();
        fulScr_Btn.innerHTML=`<img src="icons/icons-full-screen.png">`
    }
});

// If user exits fullscreen with Esc
document.addEventListener("fullscreenchange",()=>{
    if(!document.fullscreenElement){
        fulScr_Btn.innerHTML=`<img src="icons/icons-full-screen.png">`
    }
});

const backgroundImages=[
    {image:"images/background_1.jpg",title:"Background 1"},
    {image:"images/background_2.jpg",title:"Background 2"},
    {image:"images/background_3.jpg",title:"Background 3"},
    {image:"images/background_4.jpg",title:"Background 4"},
    {image:"images/background_5.jpg",title:"Background 5"},
    {image:"images/background_6.jpg",title:"Background 6"},
    {image:"images/background_7.jpg",title:"Background 7"},
    {image:"images/background_8.jpg",title:"Background 8"},
    {image:"images/background_9.jpg",title:"Background 9"}
]

const backgroundMusic=[
    {music:"music/background 1.mp3",title:"Background 1"},
    {music:"music/background 2.mp3",title:"Background 2"},
    {music:"music/background 3.mp3",title:"Background 3"},
    {music:"music/background 4.mp3",title:"Background 4"},
    {music:"music/background 5.mp3",title:"Background 5"},
    {music:"music/background 6.mp3",title:"Background 6"},
    {music:"music/background 7.mp3",title:"Background 7"},
    {music:"music/background 8.mp3",title:"Background 8"},
    {music:"music/background 9.mp3",title:"Background 9"}
]

// ---------- POPUP FUNCTIONS ----------
function openPopup(content){
    const popup=document.getElementById("popup");
    const popupContent=document.getElementById("popup-content");

    popupContent.innerHTML= content;   // replace content
    popup.style.display="flex";         // show popup
}

function closePopup(){
    document.getElementById("popup").style.display="none";
}

// ---------- Background button ----------
document.getElementById("bcgdBtn").addEventListener("click",()=>{
    let html = "<h3>Change background image</h3>";

    backgroundImages.forEach((bgd, index) => {
        html += `
            <span class="close-btn" onclick="closePopup()">&times;</span>
            <div class="bg-div" 
                onclick="setBackground('${bgd.image}')">
                <img src="${bgd.image}" alt="${bgd.title}" style="height:80px; border-radius:8px;"/>
                <span>${bgd.title}</span>
            </div>
        `;
    });
    openPopup(html);
});

// ---------- Global Audio Player ----------
let audioPlayer = new Audio();
audioPlayer.loop = true;  // repeat forever

// ---------- Music buttons ----------
document.getElementById("musicBtn").addEventListener("click",()=>{
    let html = "<h3>Change background music</h3>";

    html += `
        <button class="stopMusic" onclick="stopMusic()" style="padding:5px 10px;"><img src="icons/icons-pause.png"></button>
    `;

    backgroundMusic.forEach((musc, index) => {
        html += `
            <span class="close-btn" onclick="closePopup()">&times;</span>
            <div class="bgmusic-div" 
                onclick="setMusic('${musc.music}')">
                🎵 ${musc.title}
            </div>
        `;
    });

    openPopup(html);
});
// ---------- pomodoro buttons ----------
document.getElementById("timmer").addEventListener("click", () => {
    let html = `
    <span class="close-btn" onclick="closePopup()">&times;</span>
    <div class="pomodoro">
        <h3>Lets focus using pomodoro</h3>
        <div class="pomodoroMode">
            <button id="focusMode">Focus</button>
            <button id="breakMode">Break</button>
            <button id="longBreakMode">Long break</button>
        </div>

        <input type="text" placeholder="Enter your pomodoro title">

        <p id="timer">25:00</p>

        <div class="pomodoroControl">
            <button id="pause" style="padding:5px 10px;">
                <img src="icons/icons-pause.png">
            </button>
            <button id="play" style="padding:5px 10px;">
                <img src="icons/icons-play.png">
            </button>
            <button id="repeat" style="padding:5px 10px;">
                <img src="icons/icons-repeat.png">
            </button>
        </div>
    </div>
    `;

    openPopup(html);

    // --------- query elements after popup is added ---------
    const focus = document.getElementById("focusMode");
    const brk = document.getElementById("breakMode");
    const longbreak = document.getElementById("longBreakMode");

    const pause = document.getElementById("pause");
    const play = document.getElementById("play");
    const repeat = document.getElementById("repeat");
    const timer = document.getElementById("timer");
    const inputTitle = document.querySelector(".pomodoro input");

    let interval = null;
    let defaultTime = 25 * 60;   // default = 25 min
    let timeLeft = defaultTime;
    let endTime = null;          // for accurate countdown

    // --------- helper functions ---------
    const updateTimer = () => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timer.innerHTML =
            `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    const playTimer = () => {
        if (interval) return; // prevent multiple intervals
        endTime = Date.now() + timeLeft * 1000;

        interval = setInterval(() => {
            const diff = Math.round((endTime - Date.now()) / 1000);
            timeLeft = diff >= 0 ? diff : 0;
            updateTimer();

            if (timeLeft <= 0) {
                const alarm = new Audio("music/alarm.mp3"); 
                alarm.play();
                clearInterval(interval);
                interval = null;
                alert("Time Up!");
            }
        }, 1000);
    };

    const pauseTimer = () => {
        if (!interval) return;
        clearInterval(interval);
        interval = null;
        // keep remaining time
        timeLeft = Math.max(0, Math.round((endTime - Date.now()) / 1000));
    };

    const resetTimer = () => {
        clearInterval(interval);
        interval = null;
        timeLeft = defaultTime; 
        updateTimer();
        inputTitle.value = ""; // clear title on reset
    };

    // --------- mode switching ---------
    focus.addEventListener("click", () => {
        clearInterval(interval);
        interval = null;
        defaultTime = 25 * 60;
        timeLeft = defaultTime;
        inputTitle.value = "";
        updateTimer();
    });

    brk.addEventListener("click", () => {
        clearInterval(interval);
        interval = null;
        defaultTime = 5 * 60;
        timeLeft = defaultTime;
        inputTitle.value = "";
        updateTimer();
    });

    longbreak.addEventListener("click", () => {
        clearInterval(interval);
        interval = null;
        defaultTime = 10 * 60;
        timeLeft = defaultTime;
        inputTitle.value = "";
        updateTimer();
    });

    // --------- attach controls ---------
    play.addEventListener("click", playTimer);
    pause.addEventListener("click", pauseTimer);
    repeat.addEventListener("click", resetTimer);

    // show initial 25:00
    updateTimer();
});


document.getElementById("to-do").addEventListener("click", () => {
    let html = `
    <span class="close-btn" onclick="closePopup()">&times;</span>
    <div class="container">
        <div class="to-do">
            <h1>My to-do list</h1>
            <form class="input-area">
                <input type="text" id="task" placeholder="Add a new task...">
                <button type="submit" id="add-task">
                    <i class="fa-solid fa-plus"></i>
                </button> 
            </form>
            <div class="to-do-container">
                <ul id="task-list"></ul>
            </div>
        </div>
    </div>
    `;

    openPopup(html);

    const taskInput = document.getElementById('task');
    const taskList = document.getElementById('task-list');
    const form = document.querySelector('.input-area');

    // ---------- Save to localStorage ----------
    const saveTaskToLocalStorage = () => {
        const tasks = Array.from(taskList.querySelectorAll('li')).map(li => ({
            text: li.querySelector('span').textContent,
            completed: li.querySelector('.checkbox').checked
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // ---------- Add a task ----------
    const addTask = (text, completed = false) => {
        const taskText = text || taskInput.value.trim();
        if (!taskText) return;

        const li = document.createElement('li');
        li.innerHTML = `
        <input type="checkbox" class="checkbox" ${completed ? 'checked' : ''}>
        <span>${taskText}</span>
        <div class="task-button">
            <button type="button" class="edit-button">
                <i class="fa-solid fa-pen"></i>
            </button>
            <button type="button" class="delete-button">
               <i class="fa-solid fa-trash"></i>
            </button>
        </div>
        `;

        const checkbox = li.querySelector('.checkbox');
        const editBtn = li.querySelector('.edit-button');

        // delete task
        li.querySelector('.delete-button').addEventListener('click', () => {
            li.remove();
            saveTaskToLocalStorage();
        });

        // completed styling
        if (completed) {
            li.classList.add('completed');
            editBtn.disabled = true;
            editBtn.style.opacity = '0.5';
            editBtn.style.pointerEvents = 'none';
        }

        checkbox.addEventListener('change', () => {
            const isChecked = checkbox.checked;
            li.classList.toggle('completed', isChecked);
            editBtn.disabled = isChecked;
            editBtn.style.opacity = isChecked ? '0.5' : '1';
            editBtn.style.pointerEvents = isChecked ? 'none' : 'auto';
            saveTaskToLocalStorage();
        });

        // edit task
        editBtn.addEventListener('click', () => {
            if (!checkbox.checked) {
                taskInput.value = li.querySelector('span').textContent;
                li.remove();
                saveTaskToLocalStorage();
            }
        });

        taskList.appendChild(li);
        taskInput.value = '';
        saveTaskToLocalStorage(); // save on add
    };

    // ---------- Load tasks from localStorage ----------
    const loadTasksFromLocalStorage = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => addTask(task.text, task.completed));
    };

    // handle form submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        addTask();
    });

    // load saved tasks when popup opens
    loadTasksFromLocalStorage();
});


// ---------- Helper to set background ----------
function setBackground(image) {
    document.body.style.backgroundImage = `url(${image})`;
}

// ---------- Helper to set and stop music ----------
function setMusic(audio) {
    audioPlayer.src = audio;
    audioPlayer.play();
}

function stopMusic() {
    audioPlayer.pause();
    audioPlayer.currentTime = 0; // reset to start
}
