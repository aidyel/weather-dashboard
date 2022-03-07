// var date = moment();
// // .tz("America/new_york").format('M/D/YYYY');
// console.log(date)
// currentDate = (`${date.toString()}`);
// console.log(currentDate)


// var startDt = moment().weekdays();

// weekDays = (`${startDt.week()}`);
// console.log(startDt)
// // var endDt = moment().tz().add(6,'day').startOf("day").unix()

let startDate = moment()
let endDate = moment().add(5, 'days')
while (endDate.isAfter(startDate)) {
    console.log(startDate.format('YYYY-MM-DD'))
    //increment by one day
   startDate = startDate.add(1, 'day')
}