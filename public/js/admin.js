// let calendar = document.querySelector('#calendar');
let container = document.querySelector('.container');
let btnAdd = document.querySelector('.btn-add');
let timerBtnAddSmall;
let date1;
let date2;


btnAdd.addEventListener("click",function () {
    let select = document.querySelector(".select");
    let label = document.querySelector(".timeLabel");
    let timePicker = document.querySelector("#time");

    if (date1===undefined) {
        const startTime = timePicker.value;
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

    let timeDiv = document.createElement("div");
    timeDiv.classList.add("timeDiv");

    if (select.value==="0") {
        timeDiv.classList.add("timeDivOther");
        date2.setMilliseconds(10 * 60 * 1000);
        timeDiv.innerText=`${date1.getHours()<10?`0${date1.getHours()}`:`${date1.getHours()}`}:${date1.getMinutes()<10?`0${date1.getMinutes()}`:`${date1.getMinutes()}`} - ${date2.getHours()<10?`0${date2.getHours()}`:`${date2.getHours()}`}:${date2.getMinutes()<10?`0${date2.getMinutes()}`:`${date2.getMinutes()}`}`;

        timeDiv.time=`${date1.getHours()<10?`0${date1.getHours()}`:`${date1.getHours()}`}:${date1.getMinutes()<10?`0${date1.getMinutes()}`:`${date1.getMinutes()}`}`;
        date1.setMilliseconds(10 * 60 * 1000);
    } else {
        date2.setMilliseconds(1.5 * 60 * 60 * 1000);
        timeDiv.innerText=`${date1.getHours()<10?`0${date1.getHours()}`:`${date1.getHours()}`}:${date1.getMinutes()<10?`0${date1.getMinutes()}`:`${date1.getMinutes()}`} - ${date2.getHours()<10?`0${date2.getHours()}`:`${date2.getHours()}`}:${date2.getMinutes()<10?`0${date2.getMinutes()}`:`${date2.getMinutes()}`}`;

        timeDiv.time=`${date1.getHours()<10?`0${date1.getHours()}`:`${date1.getHours()}`}:${date1.getMinutes()<10?`0${date1.getMinutes()}`:`${date1.getMinutes()}`}`;
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

            if (x < (this.clientWidth / 2)) {
                container.insertBefore(btnAddSmall, this);
                btnAddSmall.addEventListener("click", function () {
                    console.log("LeftClick");
                });

            } else {
                container.insertBefore(btnAddSmall, this.nextElementSibling);
                btnAddSmall.addEventListener("click", function () {
                    console.log("RightClick");
                });
            }
        }
    });

    container.insertBefore(timeDiv,btnAdd);
});

