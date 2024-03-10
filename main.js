let countSpan = document.querySelector('.count span')

let questionsArea = document.querySelector('.quiz-area')

let answersArea = document.querySelector('.quiz-answers .inputs')

let bulletsContainer = document.getElementById('bullets')

let allBullets;

let currentIndex = 0;

let theRightAnswer;

let submitBtn = document.getElementById('submit')

let rightAnswers = 0;

let allAnswers;

let results = document.querySelector('.cont')

let time = document.getElementById('time')


let timeInterval;


function preparingData() {
    let myRequest = new XMLHttpRequest()
    let quizBtns = document.querySelectorAll('.quiz-btns button')

    console.log(quizBtns)




    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let response = JSON.parse(this.response)
            let qCount = response.length
            console.log(response)
            countSpan.innerHTML = qCount
            preparingQuestion(response[currentIndex], qCount)
            preparingBullets(qCount)
            timerFunc(60, qCount)

            submitBtn.onclick = function () {
                questionsArea.innerHTML = ``
                answersArea.innerHTML = ``
                currentIndex++
                checkAnswers(theRightAnswer, allAnswers)

                preparingQuestion(response[currentIndex], qCount)
                handleBullets()
                showResult(qCount)
                clearInterval(timeInterval)
                timerFunc(60, qCount)
            }
        }

    }

    quizBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            console.log(btn.innerHTML)
            myRequest.open('GET', `./${btn.innerHTML}.json`, true)

            myRequest.send()
            quizBtns.forEach(btn => btn.remove())
        })
    })
    // myRequest.open('GET', './questions.json', true)
}

function preparingQuestion(obj, count) {


    if (currentIndex < count) {
        theRightAnswer = obj.right
        let headEl = document.createElement('h2')
        let headText = document.createTextNode(obj.title)
        headEl.append(headText)
        questionsArea.append(headEl)
        console.log(obj)
        for (let i = 0; i < 4; i++) {
            let answerDiv = document.createElement('div')
            let radioInput = document.createElement('input')
            radioInput.type = 'radio'
            radioInput.id = `answer${i + 1}`;
            radioInput.name = 'question'
            radioInput.dataset.answer = obj[`answer${i + 1}`]
            let answerLabel = document.createElement('label')
            let answerText = document.createTextNode(obj[`answer${i + 1}`])
            answerLabel.htmlFor = `answer${i + 1}`
            answerDiv.className = `answer`
            answerLabel.append(answerText)
            answerDiv.append(radioInput)
            answerDiv.append(answerLabel)
            answersArea.append(answerDiv)

            if (i === 0) {
                radioInput.checked = true
            }
        }
        allAnswers = Array.from(document.getElementsByName('question'))


    }
}

function preparingBullets(count) {
    let bulletsDiv = document.createElement('div')
    let cont = document.createElement('div')
    cont.className = 'cont'
    bulletsDiv.className = 'bullets'
    for (let i = 0; i < count; i++) {
        let bullet = document.createElement('span')
        bullet.className = `bullet`
        bulletsDiv.append(bullet)
        cont.append(bulletsDiv)
        bulletsContainer.append(cont)
        if (i === 0) {
            bullet.className = `bullet on`
        }
    }
}

function handleBullets() {
    let allBullets = Array.from(document.querySelectorAll('.bullets span'))

    allBullets.forEach((bullet, index) => {
        if (currentIndex === index) {
            bullet.classList.add('on')
        }
    })
}

function checkAnswers(rAnswer, answerz) {

    let choosenAnswer;
    for (let i = 0; i < answerz.length; i++) {
        if (answerz[i].checked) {
            choosenAnswer = allAnswers[i].dataset.answer

        }

    }
    if (choosenAnswer === rAnswer) {

        rightAnswers++
    }


}


function showResult(count) {
    let resDiv = document.createElement('div')
    resDiv.className = 'results'
    if (currentIndex === count) {
        questionsArea.remove()
        answersArea.remove()
        submitBtn.remove()
        bulletsContainer.remove()
        if (rightAnswers > (count / 2) && rightAnswers < count) {

            resDiv.innerHTML = `<span class='good'>Good </span>you answered ${rightAnswers} of ${count}`
        } else if (rightAnswers === count && rightAnswers != 0) {

            resDiv.innerHTML = `<span class='perfect'>Perfect </span>You answered ${rightAnswers} of ${count}`
        } else {

            resDiv.innerHTML = `<span class='bad'>Bad </span>You answered ${rightAnswers} of ${count}`

        }
        results.append(resDiv)
    }
}


function timerFunc(duration, count) {
    let minutes = parseInt(duration / 60)
    let seconds = parseInt(duration % 60)

    if (minutes < 10) {
        minutes = `0${minutes}`
    }
    timeInterval = setInterval(() => {

        seconds--
        if (seconds < 10) {
            seconds = `0${seconds}`
        }
        if (seconds < '01' && minutes > 0) {
            (minutes) -= 1
            seconds = '60'
            minutes = `0${minutes}`
        }
        if (seconds < '01' && minutes === '00') {
            clearInterval(timeInterval)
            time.innerHTML = `00:00`
            if (currentIndex < count) {
                submitBtn.click()
            }

        }

        if (currentIndex === count) {
            clearInterval(timeInterval)
            time.remove()

        }

        time.innerHTML = `${minutes} : ${seconds}`
    }, 1000)
}



window.onload = function () {

    preparingData()
}



