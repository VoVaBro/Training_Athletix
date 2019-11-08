let calendar = document.querySelector('#calendar');
let container = document.querySelector('.container');
let out = document.querySelector('.out');

renderTimeDivs();

document.addEventListener("DOMContentLoaded",function () {
    calendar.valueAsDate=new Date();
    renderBusyDivs();

});
calendar.addEventListener("change",function () {
    if (this.value!=='') {
        renderBusyDivs();
    }
});

function renderTimeDivs () {
   const startTime = "09:00";
   const countTraining = 7;
   let arrStartTime = startTime.split(":");
   let hours = Number(arrStartTime[0]);
   let min = Number(arrStartTime[1]);
   let date1 = new Date();

   date1.setHours(hours);
   date1.setMinutes(min);
   date1.setSeconds(0);
   date1.setMilliseconds(0);

   let date2 = new Date();
   date2.setTime(date1.getTime());

   for (let i=0;i<countTraining;i++) {
       let timeDiv = document.createElement("div");
       timeDiv.classList.add("timeDiv");

       date2.setMilliseconds(1.5 * 60 * 60 * 1000);
       timeDiv.innerText=`${date1.getHours()<10?`0${date1.getHours()}`:`${date1.getHours()}`}:${date1.getMinutes()<10?`0${date1.getMinutes()}`:`${date1.getMinutes()}`} - ${date2.getHours()<10?`0${date2.getHours()}`:`${date2.getHours()}`}:${date2.getMinutes()<10?`0${date2.getMinutes()}`:`${date2.getMinutes()}`}`;

       timeDiv.time=`${date1.getHours()<10?`0${date1.getHours()}`:`${date1.getHours()}`}:${date1.getMinutes()<10?`0${date1.getMinutes()}`:`${date1.getMinutes()}`}`;
       date1.setMilliseconds(1.5 * 60 * 60 * 1000);

       timeDiv.addEventListener("click", function () {
           let tempAllDivs = document.querySelectorAll(".timeDiv");

           tempAllDivs.forEach(el=>{
               if (el.classList.contains("activeTimeDiv")) {
                   el.classList.remove("activeTimeDiv");
               }
           });

           this.classList.add("activeTimeDiv");

           document.querySelector("#recordTime").value = this.innerText;

       });

       container.appendChild(timeDiv);
   }

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

                for (let i = 0; i < tempDivs.length; i++) {
                    if (tempDivs[i].time === tempArr[0].trim()) {

                        tempDivs[i].classList.add("busyTimeDiv")
                    }
                }

            }
        })
}
