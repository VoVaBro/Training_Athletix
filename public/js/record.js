let calendar = document.querySelector('#calendar');
let container = document.querySelector('.containerTimeDiv');
let spinner = document.querySelector(".spinner-border");
let btnSignUp = document.querySelector(".btn-signUp");
let containerH1 = document.querySelector(".containerH1");
let date1;
let date2;
let timeDiv;
let startTime;
let EditCalendar = true;


document.addEventListener("DOMContentLoaded",function () {
    calendar.value = getStrDate();
    renderTimeDivs();
});

document.body.addEventListener("click", function (e) {
    if (!e.target.classList.contains("timeDiv")) {
        let tempDiv = document.querySelector(".activeTimeDiv");
        if (tempDiv){
            document.querySelector(".activeTimeDiv").classList.remove("activeTimeDiv");
        }
    }
});

calendar.addEventListener("change",function () {
    if (this.value!=='') {
        if (EditCalendar) {
            calendar.disabled = true;
            renderTimeDivs();
        }
    } else {
        let tempArr = Array.from(document.querySelectorAll(".timeDiv"));
        tempArr.forEach(el => {
            el.remove();
        });
        containerH1.innerText = `Пожалуйста, выберете желаемую дату для записи на тренировку`;
        containerH1.style.display = "inline-block";
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
                    if (el.recordTime === recordTime && el.user !== null) {
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

                fetch(`/admin/${dateTraining}`, {method: "get"})
                    .then(res => res.json())
                    .then(result => {
                        let tempArrTimeDiv = document.querySelectorAll(".timeDiv");
                        let tempResult = result[0].timetable.filter(el => {
                            return el.isTraining ===true;
                        });

                        let boolEdit = false;
                        if (tempResult.length === tempArrTimeDiv.length) {
                            tempArrTimeDiv.forEach( (el,index) => {
                                if (el.time !== tempResult[index].time) {
                                    boolEdit = true;
                                } else {
                                    if (el.duration !== tempResult[index].duration) {
                                        boolEdit = true;
                                    }
                                }
                            });
                        } else {
                            tempErrArr.push({text : "Расписание тренировок было изменено, вы можете записаться на удобное Вам время", bool : 0});
                        }
                        if (boolEdit) {
                            tempErrArr.push({text : "Расписание тренировок было изменено, вы можете записаться на удобное Вам время", bool : 0});
                        }
                        if (result[0].onEdit) {
                            tempErrArr.push({text : "Расписание в данный момент редакитуется, пожалуйста проверьте расписание позже", bool : 0});
                        }
                        if (tempErrArr.length < 1) {
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
                            renderTimeDivs();
                        }

                    });
            })

    }
});

function splitDate (date) {
    if (typeof(date) === "string") {
       return  date.split("-").reverse().join("-");
    } else {
        return date
    }
}

async function renderTimeDivs() {
    let tempArr = Array.from(document.querySelectorAll(".timeDiv"));
    let boolRenderBusy = false;
    EditCalendar = false;
    tempArr.forEach(el => {
        el.remove();
    });

    let currentValue = calendar.value;
    let tempNewArr = currentValue.split("-");
    let tempNewDate0 = new Date();
    tempNewDate0.setHours(0,0,0,0);
    let tempNewDate1 = new Date(tempNewArr[0],tempNewArr[1]-1,tempNewArr[2]);

    if (currentValue !== "" && tempNewDate0.getTime() <= tempNewDate1.getTime()) {
        spinner.style.display = "inline-block";
        btnSignUp.style.display = "none";
        containerH1.innerText = "";

        let result = await fetch(`/admin/${currentValue}`, {method: "get"})
            .then(res => res.json());
                if (result.length > 0 && result[0].onEdit === false) {
                    boolRenderBusy = true;
                    getStartTime(result[0].timetable[0].time);
                    for (let i = 0; i < result[0].timetable.length; i++) {
                        let tempIsTraining = Number(result[0].timetable[i].isTraining).toString();
                        addTimeDiv(tempIsTraining, result[0].timetable[i].duration);
                        timeDiv.style.display = "none";
                        container.insertBefore(timeDiv, containerH1);
                    }
                    tempArr = document.querySelectorAll(".timeDiv");
                    tempArr.forEach(el => {
                        if (el.classList.contains("timeDivOther")) {
                            el.remove();
                        }
                    });

                    if (boolRenderBusy) {
                       await renderBusyDivs();
                    }
                } else {
                    btnSignUp.style.display = "none";
                    spinner.style.display = "none";
                    EditCalendar = true;
                    calendar.disabled = false;
                    if (result.length > 0 && result[0].onEdit === true) {
                        containerH1.innerText = `Расписание на ${splitDate(currentValue)} в данный момент редакитуется, пожалуйста проверьте расписание позже`;
                    } else {
                        containerH1.innerText = `На ${splitDate(currentValue)} расписания нет`;
                    }
                }



    } else {
        // renderAlert([{text : "Выберите актуальную дату для просмотра расписания", bool : 0}]);
        containerH1.innerText = `Выберите актуальную дату для просмотра расписания`;
        btnSignUp.style.display = "none";
        EditCalendar = true;
        calendar.disabled = false;
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
    let tempArr = document.querySelectorAll(".alert");
    tempArr.forEach(el => {
        el.remove();
    });

    obj.forEach(el => {
        let tempDiv = document.createElement("div");
        tempDiv.classList.add("alert");
        if (el.bool) {
            tempDiv.classList.add("alert-success");
        } else {
            tempDiv.classList.add("alert-danger");
        }
        tempDiv.innerText = el.text;
        tempDiv.style.textAlign = "center";

        $('#myModal').modal('show');
        let modalBody = document.querySelector(".modal-body");
        modalBody.appendChild(tempDiv);
    });
}

async function renderBusyDivs() {
    let currentValue = calendar.value;
    let result = await fetch(`/record/${currentValue}`,{method:"get"})
        .then(res => res.json());
    spinner.style.display = "none";

            let tempDivs = document.querySelectorAll(".timeDiv");

            if (result[0].length > 0){
                let tempCountUserMatch = 0;
                let tempRecord;
                // let tempCountBusyDivs = 0;
                for (let j = 0;j < result[0].length; j++) {
                    if (result[0][j].user) {
                        if (result[0][j].user._id === result[1]) {
                            tempCountUserMatch++;
                            tempRecord = result[0][j];
                            // containerH1.innerText = `${result[0][j].dateTraining} Вы записаны на ${result[0][j].recordTime}`;
                        }
                    }
                        let tempTime = result[0][j].recordTime.split("-")[0].trim();
                        for (let i = 0; i < tempDivs.length; i++) {
                            if (tempDivs[i].time === tempTime && result[0][j].user) {
                                // tempDivs[i].classList.add("busyTimeDiv")
                                // tempCountBusyDivs++;
                            } else {
                                tempDivs[i].style.display = "flex";
                            }
                        }

                }
                btnSignUp.style.display = "inline-block";
                if (result[0].length === tempDivs.length) {
                    containerH1.innerText = `В данный момент на  ${splitDate(calendar.value)} расписание укомплектовано`;
                    btnSignUp.style.display = "none";
                }
                if (tempCountUserMatch > 0) {
                    tempDivs.forEach(el => {
                        el.remove();
                    });
                    containerH1.innerText = `${splitDate(tempRecord.dateTraining)} Вы записаны на ${tempRecord.recordTime}`;
                    btnSignUp.style.display = "none";
                }

            } else {
                tempDivs.forEach(el => {
                    el.style.display = "flex";
                });
                btnSignUp.style.display = "inline-block";
            }

            EditCalendar = true;
            calendar.disabled = false;

}

function getStrDate() {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    let today = year + "-" + month + "-" + day;
    return today
}




