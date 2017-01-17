var util = require('util');

var check = function(ctor, n, pred) {
	var name = util.format("quicksort (new %s(%d), %s)", ctor.name, n, pred);
	console.log(name);
	test(name, function (assert) {

		// SETUP RANDOM
		var randint = neat.randint;
		var sample = neat.sample_t(randint);
		var shuffle = neat.shuffle_t(sample);
		var iota = neat.iota;

		// SETUP SORT
		var partition = neat.partition_t(pred);
		var quicksort = neat.quicksort_t(partition);

		// SETUP ARRAY
		var a = new ctor(n);
		iota(a, 0, n, 0);

		// SORT ARRAY
		shuffle(a, 0, n);
		quicksort(a, 0, n);

		// TEST PREDICATE
		var i = a.length;
		var sorted = true;
		if(i > 1){
			while (--i) {
				if ( !pred(a[i-1], a[i]) ) {
					sorted = false;
					break;
				}
			}
		}

		ok(sorted, 'check sorted');
		deepEqual(a.length, n, 'check length a');
	});
};

var PRED = [
	function(a, b){ return a <  b; },
	function(a, b){ return a <= b; },
	function(a, b){ return a >  b; },
	function(a, b){ return a >= b; }
];

var N = [0, 1, 2, 10, 63, 64, 65];

var CTOR = [
	Array,
	Int8Array,
	Uint8Array,
	Int16Array,
	Uint16Array,
	Int32Array,
	Uint32Array,
	Float32Array,
	Float64Array
];

for (var k = 0; k < CTOR.length; k++) {
	for (var j = 0; j < N.length; j++) {
		if(CTOR[k].BYTES_PER_ELEMENT &&
			N[j] > Math.pow(2, CTOR[k].BYTES_PER_ELEMENT * 8)){
				continue;
		}
		for (var i = 0; i < PRED.length; ++i) {
			check(CTOR[k], N[j], PRED[i]);
		}
	}
}
