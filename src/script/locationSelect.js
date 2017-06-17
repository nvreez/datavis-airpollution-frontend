import Observer from './Observer';

var select = d3.select('#locationSelect').on('change', onchange);

var options = select
  .selectAll('option');

var locationChange = new Observer();

function initLocationSelect (data) {
  options
    .data(data).enter()
    .append('option')
      .text(function (d) { return d; });

  return select;
}


function onchange() {
  config.loc = this.value;

  locationChange.fire(this.value);
}

export { initLocationSelect, locationChange };