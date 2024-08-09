const IRON_WORKER_PRICE = 10;

var iron = 0;
var silver = 0;
var gold = 0;

var iron_workers = 0;


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

function ironClick()
{
    iron = iron + 1;
    updateMetals();
}

function buyIronMiner()
{
    const number_workers_tobuy = document.getElementById('number_workers_tobuy').value;
    console.log(number_workers_tobuy);
    price_to_pay = (IRON_WORKER_PRICE*parseInt(number_workers_tobuy));
    console.log(price_to_pay);
    if (iron >= price_to_pay )
    {
        iron = iron - price_to_pay;
        iron_workers = iron_workers + parseInt(number_workers_tobuy);
        updateMetals();
        updateWorkers();
    }
    else
    {
        console.log("Not enough iron")
    }
}

function updateMetals()
{
    const iron_counter = document.getElementById('iron_counter');
    iron_counter.textContent = iron;
}

function updateWorkers()
{
    const iron_worker_counter = document.getElementById('iron_worker_counter');
    iron_worker_counter.textContent = iron_workers;
}

// For testing purposes, we'll just increment
// this and send it out to the console.
var justSomeNumber = 0;

// Define the work to be done
var doWork = function() {
    iron = iron + iron_workers;
    updateMetals();
};

// Define what to do if something goes wrong
var doError = function() {
    console.warn('The drift exceeded the interval.');
};

// (The third argument is optional)
var ticker = new AdjustingInterval(doWork, 1000, doError);

ticker.start();