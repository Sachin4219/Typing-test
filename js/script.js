	let numberOfWords=0;

	const startBtn = document.querySelector('.start .btn'); 
	const testArea = document.querySelector('.test-area')
	const timer    = document.querySelector('.timer');

	const displayPhrase   = document.querySelector(".test-phrase");
	const input    = document.querySelector("textarea");

	const accuracy = document.querySelector('.accuracy')
	const netSpeed = document.querySelector('.speed')
	const adjustedSpeed = document.querySelector(".adjusted")

	let count

	function getPhrase(){
		return fetch("https://api.quotable.io/random")
			.then(response => response.json())
			.then(data => data.content)
	}

	async function renderPhrase(){
		const phrase = await getPhrase();
		displayPhrase.innerHTML = '';
		phrase.split('').forEach(char => {
			const element = document.createElement('span');

			element.innerText = char;
			displayPhrase.appendChild(element);
		})
		input.value=null;
		startTimer()
		numberOfWords = phrase.split(" ").length
	}	

	let startTime
	let clrId
	function startTimer() {
		timer.innerText = 0
		startTime = new Date()
		clrId = setInterval(() => {
			timer.innerText = getTime()
		}, 1000)
	}

	function getResult(){
		const arrayPhrase = displayPhrase.querySelectorAll('span')

		let correct   = 0;
		let total     = 0;
		let words     = 0;

		arrayPhrase.forEach((element) => {


			if(element.classList.contains("correct"))
				correct += 1;

			total += 1;
		})

		return arr = {correct, total, words};
	}

	function getTime(){
		const time = Math.floor((new Date() - startTime) / 1000)

		if(time === 60){
			displayResult();
			startBtn.parentElement.style.display = "flex";
			testArea.style.display = "none"
		}
		return time;
	}

	input.addEventListener("input", () => {
		const arrayPhrase = displayPhrase.querySelectorAll('span')
		const arrayValue = input.value.split('')
		count = arrayPhrase.length
		// let correct = true

		arrayPhrase.forEach((element, index) => {
			const char = arrayValue[index]

			if(char == null){
				element.classList.remove('correct')
				element.classList.remove('incorrect')
				// correct = false
			}
			else if(char == element.innerText){
				element.classList.add('correct')
				element.classList.remove('incorrect')
			}
			else{
				element.classList.add('incorrect')
				element.classList.remove('correct')
				// correct = false
			}
		})
		if(arrayPhrase[count-1].classList.contains("correct") || arrayPhrase[count-1].classList.contains("incorrect")){
			let time = parseInt(timer.innerText);
			displayResult(time);
			clearInterval(clrId);
		}
	})

	function displayResult(time){
			let result = getResult();
			const acc = Math.round(100*result.correct/result.total);
			const speed = Math.round(numberOfWords * 60/ time);
			netSpeed.textContent = `Speed: ${speed}wpm`;
			accuracy.textContent = `Accuracy: ${acc}%`;
			adjustedSpeed.textContent = `Adjusted: ${Math.round(acc*speed/100)}wpm`;
			showRetry();
	}

	function showRetry(){
			startBtn.parentElement.style.display = "flex";
			startBtn.parentElement.style.marginTop = "60px";
			startBtn.innerText = "Retry";
	}

	startBtn.addEventListener("click",function(){
		testArea.style.display = "flex";
		testArea.style.marginTop = "150px";
		netSpeed.textContent = "";
		accuracy.textContent = "";
		adjustedSpeed.textContent =""; 
		renderPhrase();
		startBtn.parentElement.style.display = "none";
})
