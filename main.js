let startBtn = document.querySelector(`.start`);
let userInput = document.querySelector(`.user`)
let userField = document.querySelector(`.name span`)
let gameContainer = document.querySelector(`.game-container`)
let gameBlock = document.querySelectorAll(`.game-container .game-block`)
let tries = document.querySelector(`.tries span`)
let failureContainer = document.querySelector(`.fail`)
let success = 0;
let interval;
let timer = 5;
let duration = 500;
// Make Focus On UserInput When Page Load
window.onload = _ => userInput.focus();

document.addEventListener("keydown", e => {
    if (e.key === 'Enter' && userInput === document.activeElement) {
        startGame()
    }
})


startBtn.onclick = () => {
    startGame()
}
function startGame() {
    if (userInput.value.match(/[a-z0-9]/ig || userInput.value.length > 0)) {
        userField.innerHTML = userInput.value
        document.querySelector(`.login-overlay`).style.display = `none`
        document.querySelector(`.login`).remove()
        let startMusic = document.getElementById(`start`)
        controlAudio(startMusic)
        countdown()
    } else {
        document.querySelector(`.valid`).style.display = `block`
    }
}

let blocksArray = Array.from(gameBlock);
let rangeArray = [...Array(blocksArray.length).keys()]
shuffle(rangeArray)
blocksArray.forEach((block, index) => {
    block.style.order = rangeArray[index]

    block.addEventListener(`click`, _ => {
        flipBlock(block)
    })

})

function shuffle(array) {

    let current = array.length,
        temp, random;
    while (current > 0) {
        random = Math.floor(Math.random() * current)
        current--;
        temp = array[current];
        array[random] = array[current]
        array[random] = temp
    }
    return array
}

function flipBlock(selected) {

    selected.classList.add(`is-flipped`);
    let filtering = blocksArray.filter((block) => block.classList.contains(`is-flipped`))

    if (filtering.length === 2) {

        // stop Click Function
        stopClick()
        // Check Two Blocks
        checkBlocks(filtering[0], filtering[1])
        // Cheeck If all Has Matches
    }

}
function stopClick() {
    gameContainer.classList.add(`event-none`)

    setTimeout(() => {
        gameContainer.classList.remove(`event-none`)
    }, duration);
}

function checkBlocks(blockOne, blockTwo) {
    if (blockOne.dataset.tech === blockTwo.dataset.tech) {

        blockOne.classList.remove(`is-flipped`)
        blockTwo.classList.remove(`is-flipped`)

        blockOne.classList.add(`is-match`)
        blockTwo.classList.add(`is-match`)
        success += 2;
        if (success === blocksArray.length) {
            clearInterval(interval)
            timer = 0;
            document.querySelector(`.congrat`).style.display = `unset`
            document.querySelector(`.login-overlay`).style.display = `block`
            let finshedSound = document.getElementById(`finshed`)
            finshedSound.volume = 0.2
            finshedSound.play()
        }
        let successSound = document.getElementById(`success`)
        controlAudio(successSound)
    } else {
        setTimeout(() => {
            blockOne.classList.remove(`is-flipped`)
            blockTwo.classList.remove(`is-flipped`)
        }, duration)
        let failSound = document.getElementById(`fail`)
        controlAudio(failSound)
        tries.innerHTML = parseInt(tries.innerHTML) + 1
    }
}

function countdown() {
    let minutes, seconds;
    interval = setInterval(() => {
        minutes = parseInt(timer / 60)
        seconds = parseInt(timer % 60)

        minutes = minutes < 10 ? `0${minutes}` : minutes;
        seconds = seconds < 10 ? `0${seconds}` : seconds;
        let countdown = document.querySelector(`.countdown span`);
        countdown.innerHTML = `${minutes}:${seconds}`;
        if (seconds <= 5 && minutes <= 0) {
            countdown.style.color = `red`
        }
        if (--timer < 0) {
            clearInterval(interval)
            gameContainer.classList.add(`event-none`)
            document.querySelector(`.login-overlay`).style.display = `block`
            failureContainer.style.display = `block`
            document.querySelector(`.fail span`).textContent = `You Can't Complete It`
            document.querySelector(`.try-again`).onclick = _ => window.location.reload()
            let finshedSound = document.getElementById(`failure`)
            controlAudio(finshedSound)
            document.addEventListener("keydown", e => {
                if (e.key === 'Enter') {
                    window.location.reload()
                }
            })
        }
    }, 1000)
}

function controlAudio(audio) {
    audio.volume = 0.1
    audio.play()
}