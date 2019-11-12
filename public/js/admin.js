let calendar = document.querySelector('#calendar');
let container = document.querySelector('.container');
let btnAdd = document.querySelector('.btn-add');
let select = document.querySelector(".select");
let label = document.querySelector(".timeLabel");
let timePicker = document.querySelector("#time");
let btnSand = document.querySelector('.btn-sand');
let btnRemove = document.querySelector('.btn-remove');
let spinner = document.querySelector(".spinner-border");
let timeDuration = document.querySelector("#timeDuration")
let timerBtnAddSmall;
let date1;
let date2;
let timeDiv;
let startTime;

btnAdd.addEventListener("click",function () {

    if (date1===undefined) {
        getStartTime(timePicker.value);
    }

    addTimeDiv(select.value,timeDuration.duration);

    container.insertBefore(timeDiv,btnAdd);
});

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


    timeDiv.addEventListener("click",function (e) {
        let x = e.offsetX===undefined?e.layerX:e.offsetX;
        let tempArr = document.querySelectorAll(".btn-add-small");
        if (tempArr.length<1) {
            let btnAddSmall = document.createElement("div");
            btnAddSmall.classList.add("btn-add-small");
            btnAddSmall.innerText = "+";
            clearTimeout(timerBtnAddSmall);
            timerBtnAddSmall = setTimeout(function () {
                btnAddSmall.remove();
            }, 1500);
            btnAddSmall.addEventListener("mouseover", function () {
                clearTimeout(timerBtnAddSmall);
            });
            btnAddSmall.addEventListener("mouseout", function () {
                this.remove();
            });

            if (x <= (this.clientWidth / 4)) {
                container.insertBefore(btnAddSmall, this);

                let tempCurrent = this;
                btnAddSmall.addEventListener("click", function () {
                    console.log("LeftClick");
                    addTimeDiv(select.value,timeDuration.duration);
                    container.insertBefore(timeDiv,this);


                    let tempArr = Array.from(document.querySelectorAll(".timeDiv"));
                    let tempStartPos = tempArr.indexOf(tempCurrent)-1;

                    for (let i=tempStartPos;i<tempArr.length;i++) {

                        let tempStartTime;
                        if (tempArr[i - 1]===undefined) {
                            tempStartTime = startTime.split(":");
                        } else {
                            tempStartTime = tempArr[i-1].time.split(":");
                        }

                        let tempDate = new Date();

                        let hours = Number(tempStartTime[0]);
                        let min = Number(tempStartTime[1]);

                        tempDate.setHours(hours);
                        tempDate.setMinutes(min);
                        tempDate.setSeconds(0);
                        tempDate.setMilliseconds(0);

                        if (i!==0) {
                            tempDate.setMilliseconds(tempArr[i-1].duration);
                        }

                        let tempDate1 = new Date();
                        tempDate1.setTime(tempDate.getTime());
                        tempDate1.setMilliseconds(tempArr[i].duration);

                        tempArr[i].innerText = `${tempDate.getHours()<10?`0${tempDate.getHours()}`:`${tempDate.getHours()}`}:${tempDate.getMinutes()<10?`0${tempDate.getMinutes()}`:`${tempDate.getMinutes()}`} - ${tempDate1.getHours()<10?`0${tempDate1.getHours()}`:`${tempDate1.getHours()}`}:${tempDate1.getMinutes()<10?`0${tempDate1.getMinutes()}`:`${tempDate1.getMinutes()}`}`;
                        tempArr[i].time = `${tempDate.getHours()<10?`0${tempDate.getHours()}`:`${tempDate.getHours()}`}:${tempDate.getMinutes()<10?`0${tempDate.getMinutes()}`:`${tempDate.getMinutes()}`}`;
                    }

                });

            } else if (x >= (this.clientWidth-(this.clientWidth / 4))) {
                container.insertBefore(btnAddSmall, this.nextElementSibling);

                let tempCurrent = this;


                btnAddSmall.addEventListener("click", function () {
                    console.log("RightClick");
                    addTimeDiv(select.value,timeDuration.duration);
                    container.insertBefore(timeDiv,this);

                    let tempArr = Array.from(document.querySelectorAll(".timeDiv"));
                    let tempStartPos = tempArr.indexOf(tempCurrent);


                    for (let i=tempStartPos+1;i<tempArr.length;i++) {

                        let tempStartTime = tempArr[i-1].time.split(":");
                        let tempDate = new Date();

                        let hours = Number(tempStartTime[0]);
                        let min = Number(tempStartTime[1]);

                        tempDate.setHours(hours);
                        tempDate.setMinutes(min);
                        tempDate.setSeconds(0);
                        tempDate.setMilliseconds(0);
                        tempDate.setMilliseconds(tempArr[i-1].duration);

                        let tempDate1 = new Date();
                        tempDate1.setTime(tempDate.getTime());
                        tempDate1.setMilliseconds(tempArr[i].duration);

                        tempArr[i].innerText = `${tempDate.getHours()<10?`0${tempDate.getHours()}`:`${tempDate.getHours()}`}:${tempDate.getMinutes()<10?`0${tempDate.getMinutes()}`:`${tempDate.getMinutes()}`} - ${tempDate1.getHours()<10?`0${tempDate1.getHours()}`:`${tempDate1.getHours()}`}:${tempDate1.getMinutes()<10?`0${tempDate1.getMinutes()}`:`${tempDate1.getMinutes()}`}`;
                        tempArr[i].time = `${tempDate.getHours()<10?`0${tempDate.getHours()}`:`${tempDate.getHours()}`}:${tempDate.getMinutes()<10?`0${tempDate.getMinutes()}`:`${tempDate.getMinutes()}`}`;
                    }


                });
            } else {
                console.log("delete");

                let tempArr = Array.from(document.querySelectorAll(".timeDiv"));
                let tempThis = this;
                if (tempArr.length===1) {
                    tempThis.remove();
                    date1 = undefined;
                    timePicker.style.display="inline-block";
                    label.style.display="inline-block";
                } else {

                    //Возврат времени к нормальному
                    date1.setMilliseconds(-tempThis.duration);
                    date2.setTime(date1.getTime());

                    let tempStartPos = tempArr.indexOf(tempThis);
                    tempThis.remove();
                    tempArr = Array.from(document.querySelectorAll(".timeDiv"));
                    for (let i = tempStartPos; i < tempArr.length; i++) {

                        let tempStartTime;
                        if (tempArr[i - 1] === undefined) {
                            tempStartTime = startTime.split(":");
                        } else {
                            tempStartTime = tempArr[i - 1].time.split(":");
                        }

                        let tempDate = new Date();

                        let hours = Number(tempStartTime[0]);
                        let min = Number(tempStartTime[1]);

                        tempDate.setHours(hours);
                        tempDate.setMinutes(min);
                        tempDate.setSeconds(0);
                        tempDate.setMilliseconds(0);

                        if (i !== 0) {
                            tempDate.setMilliseconds(tempArr[i - 1].duration);
                        }

                        let tempDate1 = new Date();
                        tempDate1.setTime(tempDate.getTime());
                        tempDate1.setMilliseconds(tempArr[i].duration);

                        tempArr[i].innerText = `${tempDate.getHours() < 10 ? `0${tempDate.getHours()}` : `${tempDate.getHours()}`}:${tempDate.getMinutes() < 10 ? `0${tempDate.getMinutes()}` : `${tempDate.getMinutes()}`} - ${tempDate1.getHours() < 10 ? `0${tempDate1.getHours()}` : `${tempDate1.getHours()}`}:${tempDate1.getMinutes() < 10 ? `0${tempDate1.getMinutes()}` : `${tempDate1.getMinutes()}`}`;
                        tempArr[i].time = `${tempDate.getHours() < 10 ? `0${tempDate.getHours()}` : `${tempDate.getHours()}`}:${tempDate.getMinutes() < 10 ? `0${tempDate.getMinutes()}` : `${tempDate.getMinutes()}`}`;
                    }
                }
            }
        }

    });
}


document.addEventListener("DOMContentLoaded",function () {
    calendar.valueAsDate = new Date();
    timeToSec(timeDuration);
    renderTimeDivs();
});

btnRemove.addEventListener("click", function () {
    let currentValue = calendar.value;
    if (currentValue !== "") {
        fetch(`/admin/${currentValue}`, {
            method : "delete"
        })
            .then(res => res.json())
            .then(res => {
                res.forEach(el => {
                    renderAlert(el);
                })
            })
    }
});

btnSand.addEventListener('click',function () {
    let arrTimeDivs=[];

    //Формирование массива timetable
    let tempArr = Array.from(document.querySelectorAll(".timeDiv"));
    let tempBool;
    tempArr.forEach(el=>{
        if (!el.classList.contains("timeDivOther")) {
            tempBool = true;
        } else {
            tempBool = false;
        }
        arrTimeDivs.push({
            duration : el.duration,
            time : el.time,
            isTraining : tempBool
        });
    });

    // Проверка наличия тренировки

    let currentValue = calendar.value;

    if (currentValue!=="" && arrTimeDivs.length > 0) {

        fetch(`/admin/${currentValue}`, {method: "get"})
            .then(res => res.json())
            .then(result => {
                if (result.length === 0) {
                    const newTraining = {
                        dateTraining: calendar.value,
                        timetable: arrTimeDivs
                    };
                    fetch("/admin", {
                        method: "post",
                        body: JSON.stringify(newTraining),
                        headers: {
                            // 'Accept':'application/json',
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(res => res.json())
                        .then(res => {
                            res.forEach(el => {
                                renderAlert(el);
                            });
                        })
                } else {
                    fetch(`/admin/${currentValue}`, {
                        method: "put",
                        body: JSON.stringify({timetable: arrTimeDivs}),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(res => res.json())
                        .then(res => {
                            res.forEach(el => {
                                renderAlert(el);
                            });
                        })
                }
            });

    } else {
        renderAlert("Для сохранения у тренировки должна быть дата и события");
    }

});

timeDuration.addEventListener("change", function () {
    timeToSec(this);
});

select.addEventListener("change", function () {

    if (this.value === "1") {
        timeDuration.value = "01:30";
    } else if (this.value === "0") {
        timeDuration.value = "00:10";
    }
    timeToSec(timeDuration);
});

calendar.addEventListener("change", function () {
    renderTimeDivs();
});

function timeToSec (obj) {
    let arrStartTime = obj.value.split(":");
    let hours = (Number(arrStartTime[0]) * 60 * 60 * 1000);
    let min = (Number(arrStartTime[1]) * 60 * 1000);
    obj.duration = hours + min;
}

function renderTimeDivs() {

    let tempArr = Array.from(document.querySelectorAll(".timeDiv"));
    tempArr.forEach(el => {
        el.remove();
    });

    let currentValue = calendar.value;
    if (currentValue !== "") {
        btnAdd.style.display = "none";
        spinner.style.display = "inline-block";
        btnRemove.style.display = "none";

        fetch(`/admin/${currentValue}`, {method: "get"})
            .then(res => res.json())
            .then(result => {
                btnAdd.style.display = "inline-block";
                spinner.style.display = "none";

                if (result.length > 0) {
                    btnRemove.style.display = "inline-block";
                    getStartTime(result[0].timetable[0].time);
                    for (let i = 0; i < result[0].timetable.length; i++) {
                        let tempIsTraining = Number(result[0].timetable[i].isTraining).toString();
                        addTimeDiv(tempIsTraining, result[0].timetable[i].duration);
                        container.insertBefore(timeDiv, btnAdd);
                    }
                } else {
                    date1 = undefined;
                    timePicker.style.display = "inline-block";
                    label.style.display = "inline-block";
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

    if (timePicker.style.display!=="none") {
        timePicker.style.display="none";
        label.style.display="none";
    }
}

function renderAlert(obj) {
    let tempTxt = "";
    if (typeof (obj) === "object") {
        obj.forEach(el => {
            tempTxt += el + "<br>";
        });

    } else if (typeof (obj) === "string"){
        tempTxt = obj;
    }
    let tempDiv = document.createElement("div");
    tempDiv.classList.add("alert");
    tempDiv.classList.add("alert-danger");
    tempDiv.innerText = tempTxt;
    document.body.insertBefore(tempDiv,container);
    setTimeout(function () {
        tempDiv.remove();
    },10000)
}