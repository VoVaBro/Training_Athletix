let calendar = document.querySelector('#calendar');
let container = document.querySelector('.container');
let out = document.querySelector('.out');

document.addEventListener("DOMContentLoaded",function () {
    calendar.valueAsDate=new Date();
    renderBusyDivs();

});
calendar.addEventListener("change",function () {
    if (this.value!=='') {
        renderBusyDivs();
    }
});

function checkTraining() {
    let currentValue = calendar.value.toString();


    fetch(`/record/${currentValue}`,{method:"get"})
        .then(res=>res.json())
        .then(result=>{
            console.log(result);
            return result;
        })
}

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
            out.innerText = `${tempDivs[0].time}:00 - ${tempDivs[lastTempDivs].time+1}:00`;
        }
        document.querySelector("#recordTime").value=out.innerText;
    });
    container.appendChild(timeDiv);
}

function renderBusyDivs() {
    let currentValue = calendar.value.toString();

    fetch(`/record/${currentValue}`,{method:"get"})
        .then(res=>res.json())
        .then(result=>{
            let tempDivs = document.querySelectorAll(".timeDiv");

            tempDivs.forEach(el=>{
                if (el.classList.contains("busyTimeDiv")) {
                    el.classList.remove("busyTimeDiv");
                }
            });

            for (let j=0;j<result.length;j++) {

                let tempArr = result[j].recordTime.split("-");

                tempArr = tempArr.map(el => {
                    return Number(el.substring(0, el.indexOf(":")));
                });


                let temp = tempArr[1] - tempArr[0];


                if (temp === 1) {
                    for (let i = 0; i < tempDivs.length; i++) {
                        if (tempDivs[i].time === tempArr[0]) {
                            tempDivs[i].classList.add("busyTimeDiv")
                        }
                    }
                } else {
                    let tempArr1 = [];
                    for (let j=tempArr[0];j<tempArr[1];j++) {
                        tempArr1.push(j);
                    }

                    for (let i = 0; i <= tempArr1.length-1; i++) {

                        for (let j = 0; j < tempDivs.length; j++) {
                            if (tempDivs[j].time === tempArr1[i]) {
                                tempDivs[j].classList.add("busyTimeDiv")
                            }
                        }
                    }
                }
            }
        })
}
