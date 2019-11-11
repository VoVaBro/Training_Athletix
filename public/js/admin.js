let calendar = document.querySelector('#calendar');
let container = document.querySelector('.container');
let btnAdd = document.querySelector('.btn-add');
let select = document.querySelector(".select");
let label = document.querySelector(".timeLabel");
let timePicker = document.querySelector("#time");
let btnSand= document.querySelector('.btn-sand');
let timerBtnAddSmall;
let date1;
let date2;
let timeDiv;
let startTime;
let arrTimeDivs=[];

btnAdd.addEventListener("click",function () {

    if (date1===undefined) {
        startTime = timePicker.value;
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

        timePicker.style.display="none";
        label.style.display="none";
    }

    addTimeDiv();

    container.insertBefore(timeDiv,btnAdd);
});

function addTimeDiv () {
    timeDiv = document.createElement("div");
    timeDiv.classList.add("timeDiv");

    if (select.value==="0") {
        timeDiv.classList.add("timeDivOther");
        date2.setMilliseconds(10 * 60 * 1000);
        timeDiv.innerText=`${date1.getHours()<10?`0${date1.getHours()}`:`${date1.getHours()}`}:${date1.getMinutes()<10?`0${date1.getMinutes()}`:`${date1.getMinutes()}`} - ${date2.getHours()<10?`0${date2.getHours()}`:`${date2.getHours()}`}:${date2.getMinutes()<10?`0${date2.getMinutes()}`:`${date2.getMinutes()}`}`;

        timeDiv.time=`${date1.getHours()<10?`0${date1.getHours()}`:`${date1.getHours()}`}:${date1.getMinutes()<10?`0${date1.getMinutes()}`:`${date1.getMinutes()}`}`;
        timeDiv.duration=10 * 60 * 1000;
        date1.setMilliseconds(10 * 60 * 1000);
    } else {
        date2.setMilliseconds(1.5 * 60 * 60 * 1000);
        timeDiv.innerText=`${date1.getHours()<10?`0${date1.getHours()}`:`${date1.getHours()}`}:${date1.getMinutes()<10?`0${date1.getMinutes()}`:`${date1.getMinutes()}`} - ${date2.getHours()<10?`0${date2.getHours()}`:`${date2.getHours()}`}:${date2.getMinutes()<10?`0${date2.getMinutes()}`:`${date2.getMinutes()}`}`;

        timeDiv.time=`${date1.getHours()<10?`0${date1.getHours()}`:`${date1.getHours()}`}:${date1.getMinutes()<10?`0${date1.getMinutes()}`:`${date1.getMinutes()}`}`;
        timeDiv.duration=1.5 * 60 * 60 * 1000;
        date1.setMilliseconds(1.5 * 60 * 60 * 1000);
    }

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
                    addTimeDiv();
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
                    addTimeDiv();
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

                //Возврат времени к нормальному
                date1.setMilliseconds(-tempThis.duration);
                date2.setTime(date1.getTime());

                let tempStartPos = tempArr.indexOf(tempThis);
                tempThis.remove();
                tempArr = Array.from(document.querySelectorAll(".timeDiv"));
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

            }
        }

    });
}


document.addEventListener("DOMContentLoaded",function () {
    calendar.valueAsDate = new Date();

});

btnSand.addEventListener('click',function () {

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

    const newTraining = {
        dateTraining : calendar.value,
        timetable: arrTimeDivs
    };
    fetch("/admin",{
        method : "post",
        body : JSON.stringify(newTraining),
        headers:{
            // 'Accept':'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(res => {
            res.forEach(el => {
                console.log(el);
            });
        })


});
