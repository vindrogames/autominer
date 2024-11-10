
const SULFUR_PRICE = 100;
const DRILL_PRICE = 1000;
const SILVER_MINE_PRICE = 10;
const SILVER_MINE_STEPS = 5;

const IRON_PRICE_MULTIPLIER = 1.1;

const gameIntro = document.getElementById('game-intro');
const resourceDisplay = document.getElementById('resource-display');

var IRON_WORKER_PRICE = 10;
var SILVER_WORKER_PRICE = 10;

var iron = 10000;
var silver = 1000;
var gold = 0;

var iron_workers = 20;
var silver_workers = 0;
var sulfur = 0;
var drill_units = 0;
var silver_pick_steps = 0;


/**
 * Self-adjusting interval to account for drifting
 * 
 * @param {function} workFunc  Callback containing the work to be done
 *                             for each interval
 * @param {int}      interval  Interval speed (in milliseconds)
 * @param {function} errorFunc (Optional) Callback to run if the drift
 *                             exceeds interval
 */
function AdjustingInterval(workFunc, interval, errorFunc) {
    var that = this;
    var expected, timeout;
    this.interval = interval;

    this.start = function() {
        expected = Date.now() + this.interval;
        timeout = setTimeout(step, this.interval);
    }

    this.stop = function() {
        clearTimeout(timeout);
    }

    function step() {
        var drift = Date.now() - expected;
        if (drift > that.interval) {
            // You could have some default stuff here too...
            if (errorFunc) errorFunc();
        }
        workFunc();
        expected += that.interval;
        timeout = setTimeout(step, Math.max(0, that.interval-drift));
    }
}

window.addEventListener('scroll', () => {

    /*
    if (resourceDisplay.offsetTop - window.scrollY <= 7) {
        resourceDisplay.classList.add('fixed');
    } else  {
        resourceDisplay.classList.remove('fixed');
    }
    */
    
    if (gameIntro.getBoundingClientRect().height + gameIntro.getBoundingClientRect().top < 10 && !resourceDisplay
.classList.contains('fixed')) {
        console.log('scroll hit');
        resourceDisplay.classList.add('fixed');
    } else if (gameIntro.getBoundingClientRect().height + gameIntro.getBoundingClientRect().top >= 10 && resourceDisplay.classList.contains('fixed')) {
        resourceDisplay.classList.remove('fixed')
    }
})

function ironClick()
{
    iron = iron + 1;
    updateMetals();
}

function silverClick()
{
    var progress = 100 / SILVER_MINE_STEPS;
    if ((drill_units > 0) && (sulfur > 1))
    {
        document.getElementById('silver-progress').value = document.getElementById('silver-progress').value + progress;
        var sulfur_to_pay = SILVER_MINE_PRICE / SILVER_MINE_STEPS
        sulfur = sulfur - sulfur_to_pay;
        silver_pick_steps = silver_pick_steps + 1;
        if (silver_pick_steps == SILVER_MINE_STEPS)
        {
            document.getElementById('silver-progress').value = document.getElementById('silver-progress').value + progress;
            silver = silver + 1;
            drill_units = drill_units - 1;
            silver_pick_steps = 0;
            setTimeout(() => {
                document.getElementById('silver-progress').value = 0;
            }, 210);
        }
    }
    updateMetals();
}

function buyIronMiner()
{
    const number_workers_tobuy = document.getElementById('number_workers_tobuy').value;
    price_to_pay = (IRON_WORKER_PRICE*parseInt(number_workers_tobuy));
    if (iron >= price_to_pay )
    {
        iron = iron - price_to_pay;
        iron_workers = iron_workers + parseInt(number_workers_tobuy);
        increase_iron_miner_cost();
        updateMetals();
        updateWorkers();        
    }
    else
    {
        console.log("Not enough iron")
    }
}

function buySilverMiner()
{
    const number_workers_tobuy = document.getElementById('number_silver_workers_tobuy').value;
    price_to_pay = (SILVER_WORKER_PRICE*parseInt(number_workers_tobuy));
    if (silver >= price_to_pay )
    {
        silver = silver - price_to_pay;
        silver_workers = silver_workers + parseInt(number_workers_tobuy);
        updateMetals();
        updateWorkers();
    }
    else
    {
        console.log("Not enough silver")
    }
}

function updateMetals()
{
    const iron_counter = document.getElementById('iron_counter');
    iron_counter.innerHTML  = iron;
    const silver_counter = document.getElementById('silver_counter');
    silver_counter.innerHTML  = silver;
    const sulfur_counter = document.getElementById('sulfur_counter');
    sulfur_counter.innerHTML  = sulfur + ' sulfur';
    const drill_counter = document.getElementById('drill_counter');
    if (drill_units == 1)
    {
        drill_counter.innerHTML  = drill_units + ' drill';
    }
    else
    {
        drill_counter.innerHTML  = drill_units + ' drills';
    }
}

function updateWorkers()
{
    const iron_worker_counter = document.getElementById('iron_worker_counter');
    iron_worker_counter.textContent = 'Iron miners: ' + iron_workers;
    const silver_worker_counter = document.getElementById('silver_worker_counter');
    silver_worker_counter.textContent = 'Silver miners: ' + silver_workers; 
    const iron_worker_label = document.getElementById('iron_worker_label');
    iron_worker_label.textContent = '1 Iron miner costs '+IRON_WORKER_PRICE+' Iron';
}

function buySulfur()
{
    const number_tobuy_sulfur = document.getElementById('number_tobuy_sulfur').value;
    price_to_pay = (SULFUR_PRICE*parseInt(number_tobuy_sulfur));
    if (iron > price_to_pay)
    {
        sulfur = sulfur + parseInt(number_tobuy_sulfur);
        iron = iron - price_to_pay
        updateMetals();
    }
    else
    {
        console.log("Not enough iron")
    }
}

function autoBuySulfur()
{
    const number_tobuy_sulfur = document.getElementById('number_tobuy_sulfur').value;
    var number_tobuy_sulfur_count = parseInt(number_tobuy_sulfur);
    var i = 0;
    while (( i < number_tobuy_sulfur_count))
    {
        if (iron > SULFUR_PRICE)
        {
            sulfur = sulfur + 1;
            iron = iron - SULFUR_PRICE;
            updateMetals();            
        }
        else
        {           
            const sulfur_autobuy_check = document.getElementById('sulfur_autobuy_check');
            sulfur_autobuy_check.checked = false;
            break;
        }
        i++;
    }
}



function buyDrill()
{
    const number_tobuy_drill = document.getElementById('number_tobuy_drill').value;
    price_to_pay = (DRILL_PRICE*parseInt(number_tobuy_drill));
    if (iron > price_to_pay)
    {
        drill_units = drill_units + parseInt(number_tobuy_drill);
        iron = iron - price_to_pay;
        updateMetals();
    }
    else
    {
        console.log("Not enough iron")
    }
}

function autoBuyDrill()
{
    const number_tobuy_drill = document.getElementById('number_tobuy_drill').value;
    var number_tobuy_drill_count = parseInt(number_tobuy_drill);
    var i = 0;
    while (( i < number_tobuy_drill_count))
    {
        if (iron > DRILL_PRICE)
        {
            drill_units = drill_units + 1;
            iron = iron - DRILL_PRICE;
            updateMetals();            
        }
        else
        {           
            const drill_autobuy_check = document.getElementById('drill_autobuy_check');
            drill_autobuy_check.checked = false;
            break;
        }
        i++;
    }
}

function mineSilverWorker()
{
    for (let i=0; i < silver_workers; i++)
    {
        if ((sulfur >= SILVER_MINE_PRICE) && (drill_units >= 1))
        {
            silver = silver + 1;
            sulfur = sulfur - SILVER_MINE_PRICE;
            drill_units = drill_units - 1;
            updateMetals();
        }
        else
        {
            break;
        }

    }
}

function mineIronWorker()
{
    iron = iron + iron_workers;
}



function updateLabels() {
    const iron_worker_label = document.getElementById('iron_worker_label');
    iron_worker_label.innerHTML = '1 Iron miner costs ' + IRON_WORKER_PRICE + ' Iron';
    
    const silver_worker_label = document.getElementById('silver_worker_label');
    silver_worker_label.innerHTML = '1 Silver worker costs ' + SILVER_WORKER_PRICE + ' Silver';

    // Update the would be price to buy Iron Workers by multiple
    const worker_price_label = document.getElementById('worker_price_label');
    const number_workers_tobuy = document.getElementById('number_workers_tobuy').value;
    var temp_price_to_pay = (IRON_WORKER_PRICE * parseInt(number_workers_tobuy));    
    worker_price_label.innerHTML = 'Cost: ' + temp_price_to_pay + ' Iron';

    // Update the would be price to buy Sulfur by multiple
    const sulfur_price_label = document.getElementById('sulfur_price_label');
    const number_tobuy_sulfur = document.getElementById('number_tobuy_sulfur').value;
    var temp_price_to_pay = (SULFUR_PRICE*parseInt(number_tobuy_sulfur));
    sulfur_price_label.innerHTML = 'Cost: ' + temp_price_to_pay + ' Iron';

    // Update the would be price to buy Drill by multiple
    const drill_price_label = document.getElementById('drill_price_label');    
    const number_tobuy_drill = document.getElementById('number_tobuy_drill').value;
    var temp_price_to_pay = (DRILL_PRICE*parseInt(number_tobuy_drill));
    drill_price_label.innerHTML = 'Cost: ' + temp_price_to_pay + ' Iron';


}

function updateProductionOutput()
{
    const iron_prod_label = document.getElementById('iron_prod_label');
    iron_prod_label.innerHTML  = 'Production: '+ iron_workers +' Iron/sec';

    var silver_prod_real = 0;
    if ((drill_units >= 1) && (sulfur >=10))
    {
        silver_prod_real = silver_workers;
    }
    const silver_prod_label = document.getElementById('silver_prod_label');
    silver_prod_label.innerHTML  = 'Production: '+ silver_prod_real +' Silver/sec';
}

function autoBuy()
{
    const sulfur_autobuy_check = document.getElementById('sulfur_autobuy_check');
    if (sulfur_autobuy_check.checked)
    {
        autoBuySulfur();
    }
    const drill_autobuy_check = document.getElementById('drill_autobuy_check');
    if (drill_autobuy_check.checked)
    {
        buyDrill()
    }
    
}

function increase_iron_miner_cost()
{
  

    const priceMultiplier = Math.floor(iron_workers / 10);
    
    // Update the price by increasing it by 10% for every 10 miners
    IRON_WORKER_PRICE = Math.round(10 * Math.pow(IRON_PRICE_MULTIPLIER, priceMultiplier));  // 10 is the initial base price
}


// For testing purposes, we'll just increment
// this and send it out to the console.
var justSomeNumber = 0;

// Define the work to be done
var doWork = function() {
    updateProductionOutput();
    autoBuy()
    mineIronWorker();
    mineSilverWorker();
    updateMetals();
    updateLabels();
    updateWorkers();
};

// Define what to do if something goes wrong
var doError = function() {
    console.warn('The drift exceeded the interval.');
};

// (The third argument is optional)
var ticker = new AdjustingInterval(doWork, 1000, doError);

ticker.start();
window.onload = function() {
    updateLabels();
};

document.getElementById('number_workers_tobuy').addEventListener('input', function() {
    // Update labels whenever the input value changes
    updateLabels();
});

document.getElementById('number_tobuy_sulfur').addEventListener('input', function() {
    // Update labels whenever the input value changes
    updateLabels();
});

document.getElementById('number_tobuy_drill').addEventListener('input', function() {
    // Update labels whenever the input value changes
    updateLabels();
});


