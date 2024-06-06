document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('counterRandomSeries').addEventListener('input', function (event) {
    const newValue = event.target.value;
    const spanRandonSeriesCounter = document.getElementById('spanRandonSeriesCounter')
    spanRandonSeriesCounter.innerText = newValue
    // You can perform further actions with the new value here
  });
  document.getElementById('btnAddRandomSeries').addEventListener('click', function (event) {

    const randomSeriesAmount = document.getElementById('counterRandomSeries').value;
    const playersPerTischAmount = document.getElementById('counterPlayersPerTisch').value;
    console.log(`series = ${randomSeriesAmount}, players/tisch = ${playersPerTischAmount}`)
  });

})