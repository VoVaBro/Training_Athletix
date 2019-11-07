let calendar = document.querySelector('#calendar');
let container = document.querySelector('.container');
let out = document.querySelector('.out');

calendar.addEventListener("change",function () {
    if (this.value!=='') {
        console.log(new Date(this.value));
    }
});

for (let i=8;i<=20;i++) {
    let timeDiv = document.createElement("div");
    timeDiv.classList.add("timeDiv");
    timeDiv.innerText=`${i+1}:00`;
    timeDiv.time=i+1;
    timeDiv.addEventListener("click", function () {
        this.classList.toggle("activeTimeDiv");
        let tempDivs = document.querySelectorAll(".activeTimeDiv");
        let tempAllDivs = document.querySelectorAll(".timeDiv");
        if (tempDivs.length<=0) {
            out.innerText = "";
        } else if (tempDivs.length===1) {
            out.innerText = `${tempDivs[0].time}:00 - ${tempDivs[0].time+1}:00`;
        } else {
            let lastTempDivs=tempDivs.length-1;
            let tempBool = false;
            out.innerText = `${tempDivs[0].time}:00 - ${tempDivs[lastTempDivs].time}:00`;
        }
    });
    container.appendChild(timeDiv);
}
