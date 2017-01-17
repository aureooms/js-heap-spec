var util = require('util');

var check = function(ctor, n, pred) {
	test(util.format("quickselect (new %s(%d), %s)", ctor.name, n, pred), function (assert) {

		// SETUP RANDOM
		var randint = neat.randint;
		var sample = neat.sample_t(randint);
		var shuffle = neat.shuffle_t(sample);
		var iota = neat.iota;

		// SETUP SORT
		var partition = neat.partition_t(pred);
		var quicksort = neat.quicksort_t(partition);
		var quickselect = neat.quickselect_t(partition);

		// SETUP REF ARRAY
		var ref = new ctor(n);
		iota(ref, 0, n, 0);
		shuffle(ref, 0, n);
		quicksort(ref, 0, n);

		// SETUP TEST ARRAY
		var a = ref.slice();

		// SORT ARRAY
		shuffle(a, 0, n);
		quickselect(a, 0, n);

		// TEST PREDICATE
		var i = a.length;
		while (i--) {
			shuffle(a, 0, n);
			quickselect(i, a, 0, n);
			deepEqual(a[i], ref[i], 'select #' + i);
		}

		deepEqual(a.length, n, 'check length');
	});
};

var PRED = [
	function(a, b){ return a <  b; },
	function(a, b){ return a <= b; },
	function(a, b){ return a >  b; },
	function(a, b){ return a >= b; }
];

var N = [0, 1, 2, 10, 100, 256];

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
