const quizArea = document.querySelector('.quiz-area');
const quizAnswers = document.querySelector('.quiz-answers .inputs');
const submitBtn = document.getElementById('submit');
const bulletsContainer = document.getElementById('bullets');
const countSpan = document.querySelector('.count span');
const results = document.querySelector('.results');
const time = document.getElementById('time')
let currentIdex = 0;
let rightAnswers = 0;
let countInterval;

function preparingData() {

    let myReq = new XMLHttpRequest();

    myReq.onreadystatechange = function() {
        if(this.readyState === 4 & this.status === 200) {
            let questObj = JSON.parse(this.response);
            let questCount = questObj.length;
            
            getQuestion(questObj[currentIdex], questCount)

            handleBullets(questCount)
            countDown(220, questCount)
            submitBtn.addEventListener('click', function() {
                let theRightAnswer;
                if(currentIdex < questCount) {
                    theRightAnswer = questObj[currentIdex].right;

                }
                checkAnswers(theRightAnswer, questCount)
                quizArea.innerHTML = '';
                quizAnswers.innerHTML = '';
                
                currentIdex++
                controlBullets()
                getQuestion(questObj[currentIdex], questCount)

                showResults(questCount)
                clearInterval(countInterval)
                countDown(220, questCount)

            })
        }
    }


    myReq.open('GET', 'questions.json', true);
    myReq.send()
}

preparingData()

function getQuestion(obj, count) {
    countSpan.innerHTML = count
    if(currentIdex < count) {
        let questTitle = document.createElement('h2');
        let questText = document.createTextNode(obj.title)
        let answer;
        questTitle.append(questText);

        quizArea.append(questTitle);

        for(let i = 1; i <= 4; i++) {
            let randomNum = Math.floor(Math.random() * i);
            answer = document.createElement('div')
            answer.className = 'answer';
            let radio = document.createElement('input');
            radio.type = 'radio';
            radio.id = `answer_${i}`;
            radio.name = `question`;
            radio.dataset.answer = obj[`answer${i}`];

            
            if(i === 1) {
                radio.checked = true
            }
            let label = document.createElement('label');
            label.setAttribute('for', `answer_${i}`);

            let labelText = document.createTextNode(obj[`answer${i}`]);

            label.append(labelText)

            answer.append(radio)
            answer.append(label)

            quizAnswers.append(answer)
            
        }
        const allAnswers = document.querySelectorAll('.answer');
        const arrayOfAnswers = Array.from(allAnswers)
        const arrayKeys = Array.from(Array(arrayOfAnswers.length).keys())
        console.log(arrayKeys)
        shuffleArr(arrayKeys)
        console.log(arrayKeys)

        allAnswers.forEach((answer, idx) => {
            answer.style.order = arrayKeys[idx]
        })
    }
}

// function handleBullets
function handleBullets(num) {
    for(let i = 0; i < num; i++) {
        let bullet = document.createElement('span');
        bullet.className = 'bullet';

        bulletsContainer.append(bullet)
        if(i === 0) {
            bullet.className = 'bullet on'
        }
    }
}

function controlBullets() {
    let allBullets = document.querySelectorAll('.bullet')

    allBullets.forEach((bullet, idx) => {
        if(currentIdex === idx) {
            bullet.className = `bullet on`
        }
    })

}

function checkAnswers(rAnswer, count) {
    let answers = document.getElementsByName('question')
    let theChoosenAnswer;
    for(let i = 0; i < answers.length; i++) {
        if(answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }
    if(theChoosenAnswer === rAnswer) {
        rightAnswers++
        console.log(rightAnswers)
    }

}

function showResults(count) {
    if(currentIdex === count) {
        quizArea.remove()
        quizAnswers.remove()
        submitBtn.remove()
        if(rightAnswers > (count / 2) && rightAnswers < count) {
            results.innerHTML = `<span class='good'>Good</span> You answered ${rightAnswers} of ${count}`
        } else if(rightAnswers === count) {
            results.innerHTML = `<span class='perfect'>Perfect</span> You answered ${rightAnswers} of ${count}`
        } else {
            results.innerHTML = `<span class='bad'>Bad</span> You answered ${rightAnswers} of ${count}`
        }
    }
}

function countDown(duration, count) {
    if(currentIdex < count) {
        let minutes = parseInt(duration / 60);
        let seconds = parseInt(duration % 60);
    
        minutes = minutes < 10 ? `0${minutes}`: minutes;
        seconds = seconds < 10 ? `0${seconds}`: seconds;
    
        countInterval = setInterval(() => {
            seconds--
            
            
            if(seconds < 1) {
                minutes -= 1
                seconds = 60
            }
    
            time.innerHTML = `${minutes} : ${seconds}`;
            if(minutes == 0 && seconds === 1) {
                clearInterval(countInterval)
                time.innerHTML = `Time up`;
                submitBtn.click();
    
            }
    
        }, 1000)
    }else {
        time.innerHTML = 'Time up ...'
    }

}




function shuffleArr(arr) {
    let currentIdx = arr.length,
    random ,
    stash;
    
    
    while (currentIdx > 0) {
        random = Math.floor(Math.random() * currentIdx);
        currentIdx--
        
        stash = arr[currentIdx];
        arr[currentIdx] = arr[random];
        arr[random] = stash;
    }
    return arr;
}


