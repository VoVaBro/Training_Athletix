let calendar = document.querySelector('#calendar');
let container = document.querySelector('.containerTime');
let btnsDiv = document.querySelector('.btns');
let btnAdd = document.querySelector('.btn-add');
let select = document.querySelector(".select");
let label = document.querySelector(".timeLabel");
let labelInfo = document.querySelector(".label-info");
let timePicker = document.querySelector("#time");
let btnSand = document.querySelector('.btn-sand');
let btnRemove = document.querySelector('.btn-remove');
let btnEdit = document.querySelector('.btn-edit');
let btnSuccessModal = document.querySelector('#btn-success-modal');
let spinner = document.querySelector(".spinner-border");
let timeDuration = document.querySelector("#timeDuration");
let timerBtnAddSmall;
let date1;
let date2;
let timeDiv;
let startTime;
let delArr = [];
let onEdit = false;
let tempInnerTxt;

//modal
let modalEl;
let modalOpen = true;
let modalSuccess = false;

$('#myModal').on('hidden.bs.modal', function () {
    if (modalSuccess) {
        modalOpen = false;
        modalEl.click();
    }
    modalSuccess = false;
    labelInfo.style.display = "none";
    let tempBtnAddSmall = document.querySelector(".btn-add-small");
    if (tempBtnAddSmall) {
        tempBtnAddSmall.remove();
    }
});
btnSuccessModal.addEventListener("click", function () {
    modalSuccess = true;
});


btnAdd.addEventListener("click",function () {
    if (onEdit) {
        if (modalOpen) {
            $('#myModal').modal('show');
        }
        if (!modalOpen) {
            if (date1===undefined) {
                getStartTime(timePicker.value);
            }

            addTimeDiv(select.value,timeDuration.duration);

            container.insertBefore(timeDiv,btnAdd);
        }
        //modal
        modalEl = this;
        modalOpen = true;
    } else {
        renderAlert([{text: "Для добавления событий, пожалуйста, войдите в режим редактирования"}]);
    }
});

function divOver(event) {


}

function divOut(event) {
    // if (onEdit) {
    //     event.target.innerHTML = tempInnerTxt;
    // }
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
        timeDiv.firstTime = timeDiv.time;
        timeDiv.onEdit = false;
        date1.setMilliseconds(duration);

    // timeDiv.addEventListener("mousemove", function () {
    //     divOver(event);
    // } );
    // timeDiv.addEventListener("mouseover", function () {
    //     tempInnerTxt = event.target.innerHTML;
    // } );
    // timeDiv.addEventListener("mouseout", function () {
    //     divOut(event);
    // } );


    timeDiv.addEventListener("click",function (e) {

        if (onEdit){
            let arrTimeDivs = document.querySelectorAll(".timeDiv");


            if (!this.onEdit) {

                arrTimeDivs.forEach( div => {
                    if ( div.onEdit && !e.target.onEdit ) {
                        div.innerHTML = tempInnerTxt;
                        div.onEdit = false;
                    }
                });

                tempInnerTxt = event.target.innerHTML;

                event.target.innerHTML = "<i class=\"fas fa-arrow-alt-circle-up fa-2x\"></i>";
                event.target.innerHTML += "<i class=\"fas fa-trash-alt fa-2x\"></i>";
                event.target.innerHTML += "<i class=\"fas fa-arrow-alt-circle-down fa-2x\"></i>";
                let icons = this.querySelectorAll("i");
                let tempCurrent = this;
                icons[0].addEventListener("click", function () {
                    let tempArr = document.querySelectorAll(".btn-add-small");
                    if (tempArr.length < 1) {
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
                        // btnAddSmall.addEventListener("mouseout", function () {
                        //     this.remove();
                        // });

                        container.insertBefore(btnAddSmall, tempCurrent);

                            btnAddSmall.addEventListener("click", function () {
                                if (onEdit) {
                                    if (modalOpen) {
                                        $('#myModal').modal('show');
                                    }
                                    //Проверка на перенос тренировок
                                    let tempUserArr = [];
                                    let tempArr = Array.from(document.querySelectorAll(".timeDiv"));
                                    let tempStartPos = tempArr.indexOf(tempCurrent);

                                    for (let i = tempStartPos; i < tempArr.length; i++) {
                                        if (tempArr[i].userId !== undefined) {
                                            tempUserArr.push(tempArr[i].userName);
                                        }
                                    }
                                    if (tempUserArr.length > 0) {
                                        labelInfo.innerText = `При добавлении нового события произойдет перенос тренеровок, продолжить?`;
                                        labelInfo.style.display = "inline-block";
                                    }
                                    if (!modalOpen) {
                                        addTimeDiv(select.value, timeDuration.duration);
                                        container.insertBefore(timeDiv, this);


                                        tempArr = Array.from(document.querySelectorAll(".timeDiv"));
                                        tempStartPos = tempArr.indexOf(tempCurrent) - 1;

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
                                            if (tempArr[i].userName !== undefined) {
                                                tempArr[i].innerHTML += `<br>${tempArr[i].userName}`;
                                            }
                                        }

                                    }
                                    //modal
                                    modalEl = this;
                                    modalOpen = true;
                                } else {
                                    renderAlert([{text: "Для добавления событий, пожалуйста, войдите в режим редактирования"}]);
                                }
                            });
                    } else {
                        let tempBtnAddSmall = document.querySelector(".btn-add-small");
                        if (tempBtnAddSmall) {
                            tempBtnAddSmall.remove();
                        }
                    }
                });
                icons[1].addEventListener("click", function () {

                        let delPrompt = true;
                        if (tempCurrent.userName !== undefined) {
                            delPrompt = confirm(`Вы действительно хотите удалить тренировку с ${tempCurrent.userName} ?`);
                            delArr.push(tempCurrent.recordId);
                        }
                        if (delPrompt) {
                            let tempArr = Array.from(document.querySelectorAll(".timeDiv"));
                            let tempThis = tempCurrent;
                            if (tempArr.length === 1) {
                                tempThis.remove();
                                date1 = undefined;
                                timePicker.style.display = "inline-block";
                                label.style.display = "inline-block";
                            } else {
                                if (onEdit) {
                                    // Проверка на перенос тренеровок
                                    let tempUserArr = [];
                                    let tempStartPos = tempArr.indexOf(tempThis) + 1;
                                    tempArr = Array.from(document.querySelectorAll(".timeDiv"));
                                    for (let i = tempStartPos; i < tempArr.length; i++) {
                                        if (tempArr[i].userId !== undefined) {
                                            tempUserArr.push(tempArr[i].userName);
                                        }
                                    }
                                    let tempConfirm = true;
                                    if (tempUserArr.length > 0) {
                                        tempConfirm = confirm(`При удалении данного события произойдет перенос тренеровок, продолжить?`)
                                    }
                                    if (tempConfirm) {

                                        //Возврат времени к нормальному
                                        date1.setMilliseconds(-tempThis.duration);
                                        date2.setTime(date1.getTime());

                                        tempStartPos = tempArr.indexOf(tempThis);
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
                                            if (tempArr[i].userName !== undefined) {
                                                tempArr[i].innerHTML += `<br>${tempArr[i].userName}`;
                                            }
                                        }
                                    }
                                } else {
                                    renderAlert([{text: "Для удаления событий, пожалуйста, войдите в режим редактирования"}]);
                                }
                            }
                        }

                        let tempBtnAddSmall = document.querySelector(".btn-add-small");
                        if (tempBtnAddSmall) {
                            tempBtnAddSmall.remove();
                        }

                });
                icons[2].addEventListener("click", function () {
                    let tempArr = document.querySelectorAll(".btn-add-small");
                    if (tempArr.length < 1) {
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
                        // btnAddSmall.addEventListener("mouseout", function () {
                        //     this.remove();
                        // });

                        container.insertBefore(btnAddSmall, tempCurrent.nextElementSibling);

                        btnAddSmall.addEventListener("click", function () {
                            if (onEdit) {
                                            if (modalOpen) {
                                                $('#myModal').modal('show');
                                            }
                                            //Проверка на перенос тренировок
                                            let tempUserArr = [];
                                            let tempArr = Array.from(document.querySelectorAll(".timeDiv"));
                                            let tempStartPos = tempArr.indexOf(tempCurrent);

                                            for (let i = tempStartPos + 1; i < tempArr.length; i++) {
                                                if (tempArr[i].userId !== undefined) {
                                                    tempUserArr.push(tempArr[i].userName);
                                                }
                                            }
                                            if (tempUserArr.length > 0) {
                                                labelInfo.innerHTML = `При добавлении нового события произойдет перенос тренеровок, продолжить?`;
                                                labelInfo.style.display = "inline-block";
                                            }
                                            if (!modalOpen) {
                                                addTimeDiv(select.value, timeDuration.duration);
                                                container.insertBefore(timeDiv, this);

                                                let tempArr = Array.from(document.querySelectorAll(".timeDiv"));
                                                let tempStartPos = tempArr.indexOf(tempCurrent);


                                                for (let i = tempStartPos + 1; i < tempArr.length; i++) {

                                                    let tempStartTime = tempArr[i - 1].time.split(":");
                                                    let tempDate = new Date();

                                                    let hours = Number(tempStartTime[0]);
                                                    let min = Number(tempStartTime[1]);

                                                    tempDate.setHours(hours);
                                                    tempDate.setMinutes(min);
                                                    tempDate.setSeconds(0);
                                                    tempDate.setMilliseconds(0);
                                                    tempDate.setMilliseconds(tempArr[i - 1].duration);

                                                    let tempDate1 = new Date();
                                                    tempDate1.setTime(tempDate.getTime());
                                                    tempDate1.setMilliseconds(tempArr[i].duration);

                                                    tempArr[i].innerText = `${tempDate.getHours() < 10 ? `0${tempDate.getHours()}` : `${tempDate.getHours()}`}:${tempDate.getMinutes() < 10 ? `0${tempDate.getMinutes()}` : `${tempDate.getMinutes()}`} - ${tempDate1.getHours() < 10 ? `0${tempDate1.getHours()}` : `${tempDate1.getHours()}`}:${tempDate1.getMinutes() < 10 ? `0${tempDate1.getMinutes()}` : `${tempDate1.getMinutes()}`}`;
                                                    tempArr[i].time = `${tempDate.getHours() < 10 ? `0${tempDate.getHours()}` : `${tempDate.getHours()}`}:${tempDate.getMinutes() < 10 ? `0${tempDate.getMinutes()}` : `${tempDate.getMinutes()}`}`;
                                                    if (tempArr[i].userName !== undefined) {
                                                        tempArr[i].innerHTML += `<br>${tempArr[i].userName}`;
                                                    }
                                                }

                                            }
                                            //modal
                                            modalEl = this;
                                            modalOpen = true;
                                        } else {
                                            renderAlert([{text: "Для добавления событий, пожалуйста, войдите в режим редактирования"}]);
                                        }


                        });

                    } else {
                        let tempBtnAddSmall = document.querySelector(".btn-add-small");
                        if (tempBtnAddSmall) {
                            tempBtnAddSmall.remove();
                        }
                    }
                });
                this.onEdit = true;
            } else {
                this.innerHTML = tempInnerTxt;
                this.onEdit = false;
            }
                // event.target.style.justifyContent = "space-between";
        }

    });
}


document.addEventListener("DOMContentLoaded",function () {
    calendar.disabled = true;
    calendar.value = getStrDate();
    timeToSec(timeDuration);
    renderTimeDivs();
    let tempCalendarVal = calendar.value.split("-");
    document.querySelector(".left h2").innerHTML = `Тренировки на ${tempCalendarVal[2]}-${tempCalendarVal[1]}-${tempCalendarVal[0]}:`;
});

btnRemove.addEventListener("click", function () {
    let tempConfirm = confirm("Вы действительно хотите удалить расписание?");
    if (tempConfirm) {
        removeTraining();
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
                                renderAlert(res);
                                renderTimeDivs();
                        })
                } else {
                    // fetch(`/admin/${currentValue}`, {
                    //     method: "put",
                    //     body: JSON.stringify({timetable: arrTimeDivs}),
                    //     headers: {
                    //         'Content-Type': 'application/json'
                    //     }
                    // })
                    //     .then(res => res.json())
                    //     .then( el => {
                    //             renderAlert(el);
                    //             renderTimeDivs();
                    //     })
                }
            });
    } else {
        renderAlert([{text : "Для сохранения у тренировки должна быть дата и события", bool : 0}]);
    }

});

function createBtnEditCancel() {

    let currentValue = calendar.value;
    let btnCancel = document.createElement("button");
    btnCancel.classList.add("btn-Cancel");
    btnCancel.innerText = "Отменить изменения";
    btnCancel.addEventListener("click", function () {
        fetch(`/admin/${currentValue}`, {
            method: "put",
            body: JSON.stringify({onEdit: false}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then( () => {
                renderTimeDivs();
                this.remove();
                btnEdit.innerText = "Редактировать";
                renderAlert([{ text : "Изменения не были применены", bool : 1 }]);
                onEdit = false;
            });
    });
    btnsDiv.insertBefore(btnCancel, btnEdit);
}

btnEdit.addEventListener("click", async function () {
    let currentValue = calendar.value;

    if (btnEdit.innerText === "Редактировать") {
        delArr = [];

        fetch(`/admin/${currentValue}`, {
            method: "put",
            body: JSON.stringify({onEdit: true}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then( () => {
                renderTimeDivs();
            })
            .catch( err => {
                if (err) {
                    renderAlert([{text : "Произошла ошибка, попробуйте позже"}]);
                }
            });
    } else if (btnEdit.innerText === "Сохранить изменения") {
        let errorArr = [];

        let arrTimeDivs = document.querySelectorAll(".timeDiv");
        arrTimeDivs.forEach( div => {
            if (div.onEdit) {
                div.innerHTML = tempInnerTxt;
                div.onEdit = false;
            }
        });
        if (errorArr.length === 0) {


            //Удаление тренировок
            if ( delArr.length > 0 ) {
                await fetch(`/record/many`, {
                    method : "delete",
                    body: JSON.stringify({ ids: delArr }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(res => res.json())
                    .then(res => {
                        renderAlert(res);
                    });
            }

            //Перенос тренеровок

            let tempArr = document.querySelectorAll(".busyTimeDiv");
            if (tempArr.length > 0){
                tempArr.forEach(el => {
                    if (el.time !== el.firstTime) {
                        fetch(`/record/${el.recordId}`, {
                            method: "put",
                            body: JSON.stringify({recordTime: el.innerText.substring(0, 13)}),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                            .then(res => res.json())
                            .catch(err => {
                                if (err) {
                                    renderAlert(err);
                                }
                            })
                    }
                });

            }

            //Сохранение результата
                //Формирование массива timetable
            let tempArrTimetable = document.querySelectorAll(".timeDiv");
            if (tempArrTimetable.length < 1){
                let tempConfirm = confirm("Вы действительно хотите удалить расписание?");
                if (tempConfirm) {
                    removeTraining();
                } else {
                    renderTimeDivs();
                }
            } else {
                let arrTimeDivs=[];
                let tempBool;
                tempArrTimetable.forEach(el=>{
                    tempBool = !el.classList.contains("timeDivOther");
                    arrTimeDivs.push({
                        duration : el.duration,
                        time : el.time,
                        isTraining : tempBool
                    });
                });
                let currentValue = calendar.value;
                fetch(`/admin/${currentValue}`, {
                    method: "put",
                    body: JSON.stringify({timetable: arrTimeDivs, onEdit: false}),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(res => res.json())
                    .then( el => {
                        renderAlert(el);
                        renderTimeDivs();
                    });
            }

            document.querySelector(".btn-Cancel").remove();
            btnEdit.innerText = "Редактировать";
        }
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
    let tempCalendarVal = calendar.value.split("-");
    document.querySelector(".left h2").innerHTML = `Тренировки на ${tempCalendarVal[2]}-${tempCalendarVal[1]}-${tempCalendarVal[0]}`;
    calendar.disabled = true;
    renderTimeDivs();
    btnsDiv.classList.add("hidden");
    document.querySelector(".containerTime").classList.add("hidden");
    document.querySelector(".left-ul").classList.add("hidden");
    document.querySelector(".right-ul").classList.add("hidden");
});

function timeToSec (obj) {
    let arrStartTime = obj.value.split(":");
    let hours = (Number(arrStartTime[0]) * 60 * 60 * 1000);
    let min = (Number(arrStartTime[1]) * 60 * 1000);
    obj.duration = hours + min;
}

async function renderTimeDivs() {
    calendar.disabled = true;
    let boolRenderBusy = false;
    let tempArr = Array.from(document.querySelectorAll(".timeDiv"));
    tempArr.forEach(el => {
        el.remove();
    });
    let tempBtnAddSmall = document.querySelector(".btn-add-small");
    if (tempBtnAddSmall) {
        tempBtnAddSmall.remove();
    }

    let currentValue = calendar.value;
    if (currentValue !== "") {
        btnAdd.style.display = "none";
        btnEdit.style.display = "none";
        spinner.style.display = "inline-block";
        btnRemove.style.display = "none";
        let result = await fetch(`/admin/${currentValue}`, {method: "get"})
            .then(res => res.json());

                btnAdd.style.display = "inline-block";
                if (result.length > 0) {
                    boolRenderBusy = true;
                    btnRemove.style.display = "inline-block";
                    btnEdit.style.display = "inline-block";
                    btnSand.style.display = "none";

                    btnEdit.innerText = "Редактировать";
                    let tempBtnEditCancelArr = document.querySelectorAll(".btn-Cancel");
                    tempBtnEditCancelArr.forEach(el => {
                        el.remove();
                    });

                    if (result[0].onEdit) {
                        renderAlert([{text: "Расписание находится в режиме редактирования. Пожалуйста, сохраните расписание, чтобы оно стало доступно для клиентов"}]);
                        btnEdit.innerText = "Сохранить изменения";
                        onEdit = true;
                        createBtnEditCancel();
                        btnRemove.style.display = "none";
                    } else {
                        onEdit = false;
                    }

                    getStartTime(result[0].timetable[0].time);
                    for (let i = 0; i < result[0].timetable.length; i++) {
                        let tempIsTraining = Number(result[0].timetable[i].isTraining).toString();
                        addTimeDiv(tempIsTraining, result[0].timetable[i].duration);
                        container.insertBefore(timeDiv, btnAdd);
                    }
                } else {
                    date1 = undefined;
                    onEdit = true;
                    timePicker.style.display = "inline-block";
                    label.style.display = "inline-block";
                    btnSand.style.display = "inline-block";
                }

                if (boolRenderBusy) {
                    await renderBusyDivs()
                } else {
                    spinner.style.display = "none";
                    let ul = document.querySelector(".left-ul");
                    ul.innerHTML = "";
                }
                await getActTrainings();
                calendar.disabled = false;

    }
}

async function renderBusyDivs() {

    let currentValue = calendar.value;
    let records = await fetch(`/record/${currentValue}`,{method:"get"})
        .then(res => res.json());

        let tempDivs = document.querySelectorAll(".timeDiv");
        for (let j = 0;j < records[0].length; j++) {
            let tempTime = records[0][j].recordTime.split("-")[0].trim();

            for (let i = 0; i < tempDivs.length; i++) {
                if (tempDivs[i].time === tempTime) {
                    if (records[0][j].user) {
                        tempDivs[i].classList.add("busyTimeDiv");
                        tempDivs[i].innerHTML += `<br>${records[0][j].user.name} ${records[0][j].user.secondName}`;
                        tempDivs[i].userId = records[0][j].user._id;
                        tempDivs[i].userName = records[0][j].user.name + " " + records[0][j].user.secondName;
                        tempDivs[i].userFone = records[0][j].user.phoneNum;
                        tempDivs[i].recordId = records[0][j]._id;
                    }
                }
            }

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
    let tempArr = document.querySelectorAll(".alert");
    let tempCountAlerts = 0;
    tempArr.forEach(el => {
        // el.remove();
        if (el.classList.contains("alert-success")) {
            el.classList.remove("alert-success");
        } else {
            el.classList.remove("alert-danger");
        }
        el.style.backgroundColor = "gray";
        tempCountAlerts++;
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
        tempDiv.classList.add("renderAlert");

        tempDiv.style.top = (tempCountAlerts * 55).toString() + "px";

        let removeBtn = document.createElement("span");
        removeBtn.innerText = "x";
        removeBtn.addEventListener("click", function () {
            this.parentElement.remove();
        });
        tempDiv.appendChild(removeBtn);

        document.body.insertBefore(tempDiv,document.body.firstChild);

        setTimeout(function () {
            tempDiv.remove();
            let tempArr = document.querySelectorAll(".alert");
            tempArr.forEach(el => {
                let tempElTop = parseInt(el.style.top);
                tempElTop -= 50;
                el.style.top = tempElTop + "px";
            });
        },5000)
    });
}

function getStrDate() {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    return year + "-" + month + "-" + day;
}

async function getActTrainings() {
    let ul = document.querySelector(".right-ul");
    ul.innerHTML = "";

    let result = await fetch(`record/all`, {method : "get"})
        .then(res => res.json());
    let tempNewDate = new Date;
            tempNewDate.setHours(0);
            tempNewDate.setMinutes(0);
            tempNewDate.setSeconds(0);
            tempNewDate.setMilliseconds(24*60*60*1000);

            let trainings = result[0].sort( (a,b) => {
                return new Date (`${a.dateTraining}T${a.recordTime.split("-")[0].trim()}`).getTime() - new Date (`${b.dateTraining}T${b.recordTime.split("-")[0].trim()}`).getTime();
            });

            trainings.map(training => {
                if (training.user){
                    let tempDate = new Date(`${training.dateTraining}T${training.recordTime.split("-")[0].trim()}`);
                    if ((tempDate.getTime() - tempNewDate) > 0) {

                        //    Добавление в список тренировок
                        let li = document.createElement("li");
                        let span = document.createElement("span");
                        let tempDateTraining = training.dateTraining.split("-");
                        span.innerHTML = `<i class="fas fa-trash-alt"></i>`;
                        span.classList.add("delSpan");
                        span.addEventListener("click", function () {
                            let tempConfirm = confirm(`Вы действительно хотите удалить тренировку на ${tempDateTraining[2]}-${tempDateTraining[1]}-${tempDateTraining[0]} (${training.recordTime})`);
                            if (tempConfirm) {
                                let tempRecordId = training._id;
                                fetch(`/record/${tempRecordId}`, {method: "delete"})
                                    .then(res => res.json())
                                    .then(res => {
                                        renderAlert(res);
                                        renderTimeDivs();
                                    });
                            }
                        });


                        let user = training.user;
                        li.innerHTML = `<span>${tempDateTraining[2]}-${tempDateTraining[1]}-${tempDateTraining[0]}</span> <span>${training.recordTime}</span> <span>${user.name} ${user.secondName}</span> `;
                        li.appendChild(span);
                        ul.appendChild(li);
                    }
                }
            });

            btnsDiv.classList.remove("hidden");
            document.querySelector(".containerTime").classList.remove("hidden");
            document.querySelector(".left-ul").classList.remove("hidden");
            document.querySelector(".right-ul").classList.remove("hidden");

            renderTodayTrainings();

}

function removeTraining() {
    let currentValue = calendar.value;
    if (currentValue !== "") {
        fetch(`/admin/${currentValue}`, {
            method : "delete"
        })
            .then(res => res.json())
            .then(res => {
                renderAlert(res);
            })
            .catch(err => {
                if (err) {
                    renderAlert([{text : "Произошла ошибка, попробуйте позже", bool : 0}]);
                }
            })
            .then( () => {
                fetch(`/recordDelAll/${currentValue}`, {
                    method : "delete"
                })
                    .then(res => res.json())
                    .then( () => {
                        renderTimeDivs();
                    })
                    .catch(err => {
                        if (err) {
                            renderAlert([{text : "Произошла ошибка, попробуйте позже", bool : 0}]);
                        }
                    })
            })
    }
}

function renderTodayTrainings() {

    let ul = document.querySelector(".left-ul");
    ul.innerHTML = "";

    spinner.style.display = "none";
    let tempArr = document.querySelectorAll(".busyTimeDiv");
    for (let i=0;i<tempArr.length;i++) {
        //    Добавление в список тренировок
        let li = document.createElement("li");
        let span = document.createElement("span");
        span.innerHTML = `<i class="fas fa-trash-alt"></i>`;
        span.classList.add("delSpan");
        span.addEventListener("click", function () {
            let tempConfirm = confirm(`Вы действительно хотите удалить тренировку на ${tempArr[i].innerText}`);
            if (tempConfirm) {
                let tempRecordId = tempArr[i].recordId;
                fetch(`/record/${tempRecordId}`, {method : "delete"})
                    .then(res => res.json())
                    .then(res => {
                        renderAlert(res);
                        renderTimeDivs();
                    });
            }
        });
        li.innerHTML = `<span class="LiInf">${tempArr[i].innerText}</span> <span class="LiPhone">${tempArr[i].userFone}</span> `;

        // li.addEventListener("mousemove", function (e) {
        //     this.querySelector(".LiInf").style.display = "none";
        //     this.querySelector(".LiPhone").style.display = "inline-block";
        // });
        // li.addEventListener("mouseout", function (e) {
        //     this.querySelector(".LiInf").style.display = "inline-block";
        //     this.querySelector(".LiPhone").style.display = "none";
        // });

        li.appendChild(span);
        ul.appendChild(li);
    }
}