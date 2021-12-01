const Day = document.querySelector('.day');
const month = document.querySelector('.month-name');
const date = new Date();

const pre = document.querySelector('.left');
const next = document.querySelector('.right');

const todoField = document.querySelector('.todo');
const todoTitle = document.querySelector('.todo-title');
const todoList = document.querySelector('.todoList');

const input = document.querySelector('input[type="text"]');
const add = document.querySelector('.add');
const reset = document.querySelector('.reset');
const allReset = document.querySelector('.allreset');


let currentMon = date.getMonth()+1;   
let currentYear = date.getFullYear();
let currentDay = date.getDate();

let DayOfChoice = currentDay;
let MonOfChoice = currentMon;
let yearOfChoice = currentYear;

let year = currentYear;
let mon = currentMon;

let clickEventArr = [];
let storeToDo = [];

function isLeapYear(year){
    return (year%4==0)&&(year%400==0||year%100!=0);
}

function getDayOfMon(mon,year){
    if(mon===1||mon===3||mon===5||mon===7||mon===8||mon===10||mon===12){
        return 31;
    }
    else if(mon===2){
        return isLeapYear(year)? 29 : 28;
    }
    else{
        return 30;
    }
}

function getDay(year,mon,date){
    const conYMD = year+'-'+mon+'-'+date;
    return(new Date(conYMD).getDay());
}
function makeCalendar(year,mon,dayCount){
    clickEventArr=[];
    Day.innerHTML='';
    let getFirstDay = getDay(year,mon,1);
    let previousMon;
    if(currentMon-1<0){
        previousMon = 12;
    }
    else{
        previousMon = currentMon - 1;
    }
    let getDayOfPreMon = getDayOfMon(previousMon,year);
    for(let i=(getFirstDay+6)%7; i>0; i--){
        const listPre = document.createElement('li');
        listPre.textContent = `${getDayOfPreMon-(i-1)}`;
        listPre.style.opacity = '0.5';
        listPre.classList.add('disabled');
        Day.appendChild(listPre);
    }
   
    for(let i=1; i<=dayCount; i++){
        if(i===currentDay&&year===currentYear&&mon===currentMon){
            //선택한 년, 월, 일 다를 때 현재 날짜에 검은색 테두리
            const onlyOneList = document.createElement('li');

            onlyOneList.textContent = `${i}`;
            if(currentYear === yearOfChoice && currentMon === MonOfChoice && currentDay === DayOfChoice){
                onlyOneList.style.border = '3px solid red';
            }
            else{
                //onlyOneList.style.border = '3px solid black';
            }

            if(0===getDay(year,mon,i)){
                onlyOneList.style.color = 'red';
            }
            else if(6==getDay(year,mon,i)){
                onlyOneList.style.color = 'blue';
            }

            //현재 년, 월 같을 때
            
            Day.addEventListener('click',(event)=>{
                if(event.target!==onlyOneList){
                    onlyOneList.style.border = '3px solid black';
                }
            });

            Day.appendChild(onlyOneList);
            continue;
        }

        const list = document.createElement('li');
        list.textContent = `${i}`;
        if(i===DayOfChoice&&year===yearOfChoice&&mon===MonOfChoice){
            list.style.border = '3px solid red';
            Day.addEventListener('click',(event)=>{
                if(event.target!==list){
                    list.style.border = 'none';
                }
            });
        }

        // 오늘보다 이전 날짜 비활성화
        if(i < currentDay && mon == currentMon) {
            list.style.opacity = '0.5';
            list.classList.add('disabled');
        }

        if(0===getDay(year,mon,i)){
            list.style.color = 'red';
        }
        else if(6==getDay(year,mon,i)){
            list.style.color = 'blue';
        }

        Day.appendChild(list);
    }

    for(let i=1; i<42-(getFirstDay+6)%7-dayCount+1; i++){
        const listNext = document.createElement('li');
        listNext.textContent = `${(i)}`;
        listNext.style.opacity = '0.5';
        listNext.classList.add('disabled');
        Day.appendChild(listNext);
    }
}

function setMonthTitle(year,mon){
    month.textContent = `${year}년 ${mon}월`
}

function nextMonthOrYear(){
    if(mon===12){
        year = year+1;
        mon = 1;
    }
    else{
        mon = mon+1;
    }
    setMonthTitle(year,mon);
    makeCalendar(year,mon,getDayOfMon(mon,year));
}

function preMonthOrYear(){
    if(mon===1){
        year = year-1;
        mon = 12;
    }
    else{
        mon = mon-1;
    }
    setMonthTitle(year,mon);
    makeCalendar(year,mon,getDayOfMon(mon,year));
}


function main(){
    setMonthTitle(year,mon);
    makeCalendar(year,mon,getDayOfMon(mon,year));
}

pre.addEventListener('click',preMonthOrYear);
next.addEventListener('click',nextMonthOrYear);

function clearEvent(){
    clickEventArr.forEach((value)=>{
        value.style.border = 'none';
    });
}

Day.addEventListener('click',(event)=>{
    if(event.target.tagName==='UL')return;
    if(event.target.className!=='disabled'){
        clearEvent();
        event.target.style.border='3px solid red';
        DayOfChoice = (event.target.textContent)*1;
        MonOfChoice = mon;
        yearOfChoice = year;

        var dayTemp = DayOfChoice < 10 ? "0" + DayOfChoice : DayOfChoice;
        var monthTemp = MonOfChoice < 10 ? "0" + MonOfChoice : MonOfChoice;

        var selectedDate = yearOfChoice + '-' + MonOfChoice + '-' + DayOfChoice;
        selectedDateTemp = yearOfChoice + '-' + monthTemp + '-' + dayTemp;
        selectedDateText = yearOfChoice + '년 ' + MonOfChoice + '월 ' + DayOfChoice + '일';

        if(selectedDateTemp == todayValue) {
            $(".selected-day-list").hide();
            $(".today-list").css('height','660px');
        } else {
            $(".today-list").css('height','321px');
            $(".selected-day-list").show();
        }

        $(".today-card").remove();
        $(".selected-day-card").remove();
        getSelectedDayToDo();
        getTodayToDo();
        
        clickEventArr.push(event.target);
    }
});

main();