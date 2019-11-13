let calendar = document.querySelector('#calendar');
let container = document.querySelector('.container');
let spinner = document.querySelector(".spinner-border");
let btnSignUp = document.querySelector(".btn-signUp");
let containerH1 = document.querySelector(".containerH1");
let date1;
let date2;
let timeDiv;
let startTime;


document.addEventListener("DOMContentLoaded",function () {
    calendar.valueAsDate = new Date();
    renderTimeDivs();
    // renderBusyDivs();
});

calendar.addEventListener("change",function () {
    if (this.value!=='') {
        // renderBusyDivs();
        renderTimeDivs();
    }
});

btnSignUp.addEventListener("click", function () {
    let errors = [];
    let tempDiv = document.querySelector(".activeTimeDiv");
    let dateTraining = calendar.value;
    let recordTime;

    if (tempDiv === null) {
        errors.push({text : "Пожалуйста выберете время для записи на тренировку", bool : 0});
    } else {
        recordTime = tempDiv.innerText;
    }
    if (!dateTraining){
        errors.push({text : "Пожалуйста выберете дату для записи на тренировку", bool : 0});
    }

    if (errors.length > 0) {
        renderAlert(errors);
    } else {
        fetch(`/record/${dateTraining}`,{method:"get"})
            .then(res => res.json())
            .then(result => {
                let tempCounter = 0;
                let tempIsBusy = false;
                // let tempTime = recordTime.split("-")[0].trim();
                result[0].forEach(el => {
                    if (el.recordTime === recordTime) {
                        tempCounter++;
                    }
                    if (el.user === result[1]) {
                        tempIsBusy = true;
                    }

                });
                let tempErrArr = [];
                if (tempCounter > 0) {
                    tempErrArr.push({text : "Пожалуйста выберете другое время для записи на тренировку, выбранное вами время уже занято", bool : 0});
                }
                if (tempIsBusy === true) {
                    tempErrArr.push({text : "У вас уже есть запись на тренировку для этой даты, чтобы записаться на дополнительную тренировку пожалуйста свяжитесь с тренером", bool : 0});
                }
                if ((tempCounter === 0) && (!tempIsBusy)) {
                    const newRecord = {
                        dateTraining: dateTraining,
                        recordTime: recordTime
                    };
                    fetch("/record", {
                        method: "post",
                        body: JSON.stringify(newRecord),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(res => res.json())
                        .then(res => {
                            renderAlert(res);
                            renderTimeDivs();
                        })
                } else {
                    renderAlert(tempErrArr);
                }

            })

    }
});

function renderTimeDivs() {
    let tempArr = Array.from(document.querySelectorAll(".timeDiv"));
    let boolRenderBusy = false;
    tempArr.forEach(el => {
        el.remove();
    });

    let currentValue = calendar.value;
    if (currentValue !== "") {
        spinner.style.display = "inline-block";
        containerH1.innerText = "";

        fetch(`/admin/${currentValue}`, {method: "get"})
            .then(res => res.json())
            .then(result => {
                if (result.length > 0) {
                    boolRenderBusy = true;
                    getStartTime(result[0].timetable[0].time);
                    for (let i = 0; i < result[0].timetable.length; i++) {
                        let tempIsTraining = Number(result[0].timetable[i].isTraining).toString();
                        addTimeDiv(tempIsTraining, result[0].timetable[i].duration);
                        container.insertBefore(timeDiv, containerH1);
                    }
                    tempArr = document.querySelectorAll(".timeDiv");
                    tempArr.forEach(el => {
                        if (el.classList.contains("timeDivOther")) {
                            el.remove();
                        }
                    });
                } else {
                    containerH1.innerText = `На ${currentValue} расписания нет`;
                }

            })
            .then( () => {
                if (boolRenderBusy) {
                    renderBusyDivs();
                } else {
                    spinner.style.display = "none";
                }
            })

    }
}

function getStartTime(startValue) {
    startTime = startValue;
    let arrStartTime = startTime.split(":");
    let hours = Number(arrStartTime[0]);
    let min = Number(arrStartTime[1]);

    date1 = new Date();
    date1.setHours(hours);
    date1.setMinutes(min);
    date1.setSeconds(0);
    date1.setMilliseconds(0);
    date2 = new Date();
    date2.setTime(date1.getTime());
}

function addTimeDiv (isTraining,duration) {
    timeDiv = document.createElement("div");
    timeDiv.classList.add("timeDiv");

    if (isTraining === "0") {
        timeDiv.classList.add("timeDivOther");
    }
    date2.setMilliseconds(duration);
    timeDiv.innerText=`${date1.getHours()<10?`0${date1.getHours()}`:`${date1.getHours()}`}:${date1.getMinutes()<10?`0${date1.getMinutes()}`:`${date1.getMinutes()}`} - ${date2.getHours()<10?`0${date2.getHours()}`:`${date2.getHours()}`}:${date2.getMinutes()<10?`0${date2.getMinutes()}`:`${date2.getMinutes()}`}`;

    timeDiv.time=`${date1.getHours()<10?`0${date1.getHours()}`:`${date1.getHours()}`}:${date1.getMinutes()<10?`0${date1.getMinutes()}`:`${date1.getMinutes()}`}`;
    timeDiv.duration = duration;
    date1.setMilliseconds(duration);

    timeDiv.addEventListener("click", function () {
        if (!this.classList.contains("busyTimeDiv") && !this.classList.contains("activeTimeDiv")) {
            let tempAllDivs = document.querySelectorAll(".timeDiv");

            tempAllDivs.forEach(el => {
                if (el.classList.contains("activeTimeDiv")) {
                    el.classList.remove("activeTimeDiv");
                }
            });

            this.classList.add("activeTimeDiv");
        }
    });

}

function renderAlert(obj) {
    // let tempArr = document.querySelectorAll(".alert");
    // tempArr.forEach(el => {
    //     el.remove();
    // });

    obj.forEach(el => {
        let tempDiv = document.createElement("div");
        tempDiv.classList.add("alert");
        if (el.bool) {
            tempDiv.classList.add("alert-success");
        } else {
            tempDiv.classList.add("alert-danger");
        }
        tempDiv.innerText = el.text;
        document.body.insertBefore(tempDiv,document.body.firstChild);
        setTimeout(function () {
            tempDiv.remove();
        },10000)
    });
}

// function renderTimeDivs () {
//    const startTime = "09:00";
//    const countTraining = 7;
//    let arrStartTime = startTime.split(":");
//    let hours = Number(arrStartTime[0]);
//    let min = Number(arrStartTime[1]);
//    let date1 = new Date();
//
//    date1.setHours(hours);
//    date1.setMinutes(min);
//    date1.setSeconds(0);
//    date1.setMilliseconds(0);
//
//    let date2 = new Date();
//    date2.setTime(date1.getTime());
//
//    for (let i = 0;i < countTraining; i++) {
//        let timeDiv = document.createElement("div");
//        timeDiv.classList.add("timeDiv");
//
//        date2.setMilliseconds(1.5 * 60 * 60 * 1000);
//        timeDiv.innerText=`${date1.getHours()<10?`0${date1.getHours()}`:`${date1.getHours()}`}:${date1.getMinutes()<10?`0${date1.getMinutes()}`:`${date1.getMinutes()}`} - ${date2.getHours()<10?`0${date2.getHours()}`:`${date2.getHours()}`}:${date2.getMinutes()<10?`0${date2.getMinutes()}`:`${date2.getMinutes()}`}`;
//
//        timeDiv.time=`${date1.getHours()<10?`0${date1.getHours()}`:`${date1.getHours()}`}:${date1.getMinutes()<10?`0${date1.getMinutes()}`:`${date1.getMinutes()}`}`;
//        date1.setMilliseconds(1.5 * 60 * 60 * 1000);
//
//        timeDiv.addEventListener("click", function () {
//            if (!this.classList.contains("busyTimeDiv")) {
//                let tempAllDivs = document.querySelectorAll(".timeDiv");
//
//                tempAllDivs.forEach(el => {
//                    if (el.classList.contains("activeTimeDiv")) {
//                        el.classList.remove("activeTimeDiv");
//                    }
//                });
//
//                this.classList.add("activeTimeDiv");
//
//                document.querySelector("#recordTime").value = this.innerText;
//            }
//        });
//
//        container.appendChild(timeDiv);
//    }
//
// }

function renderBusyDivs() {
    let currentValue = calendar.value;

    fetch(`/record/${currentValue}`,{method:"get"})
        .then(res => res.json())
        .then(result => {
            let tempDivs = document.querySelectorAll(".timeDiv");

            for (let j = 0;j < result[0].length; j++) {
                let tempTime = result[0][j].recordTime.split("-")[0].trim();
                for (let i = 0; i < tempDivs.length; i++) {
                    if (tempDivs[i].time === tempTime) {
                        tempDivs[i].classList.add("busyTimeDiv")
                    }
                }

            }
            spinner.style.display = "none";
        })
}





