const counterModule = (function() {
    let counter = 0;

    function increment() {
        counter++;
        console.log("Counter incremented: " + counter);
    }

    function reset() {
        counter = 0;
        console.log("Counter reset: " + counter);
    }

    return {
        increment: increment,
        reset: reset
    };
})();

counterModule.increment();
counterModule.increment();
counterModule.reset();
counterModule.increment();