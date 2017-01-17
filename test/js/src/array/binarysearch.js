var util = require('util');

var check = function(ctor, n, pred, diff) {
	var name = util.format("binarysearch (new %s(%d), %s)", ctor.name, n, diff);
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
		var binarysearch_t = neat.binarysearch_tt(neat.pivotsearch_t);
		var binarysearch = binarysearch_t(diff);

		// SETUP REF ARRAY
		var ref = new ctor(n);
		iota(ref, 0, n, 0);
		shuffle(ref, 0, n);
		quicksort(ref, 0, n);

		// SETUP TEST ARRAY
		var a = ref.slice();

	// TEST SEARCH
		var i = a.length;

		if(i > 0){
			// CHECK > OUTER BOUND
			var s = binarysearch(n, a, 0, n);
			deepEqual(s[0], 0, 'not found ' + n);
			var x = (a[n-1] + (diff(-1, 0) < 0));
			deepEqual(s[1], x, 'where === ' + x);

			// CHECK BODY
			while (i--) {
				s = binarysearch(a[i], a, 0, n);
				deepEqual(s[0], 1, 'find  a[' + i + ']');
				deepEqual(s[1], i, 'where  === ' + i);
			}

			// CHECK < OUTER BOUND
			s = binarysearch(-1, a, 0, n);
			deepEqual(s[0], 0, 'not found -1');
			x = (a[0] + (diff(-1, 0) > 0));
			deepEqual(s[1], x, 'where === ' + x);
		}
		else{
			var s = binarysearch(-1, a, 0, n);
			deepEqual(s[0], 0, 'not found -1');
			deepEqual(s[1], 0, 'where === ' + 0);
		}


		// CHECK NOT MODIFIED
		deepEqual(a.length, n, 'length check');

		var notmodified = true;
		i = a.length;
		while(i--){
			if(a[i] !== ref[i]){
				notmodified = false;
				break;
			}
		}

		ok(notmodified, 'not modified check');
	});
};

var DIFF = [
	function(a, b){ return a - b; },
	function(a, b){ return b - a; }
];

var PRED = [];

for(var i = 0; i < DIFF.length; ++i){
	PRED.push(function(a, b){ return DIFF[i](a, b) < 0; });
}

var N = [0, 1, 2, 10, 128, 1023];

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
		for (var i = 0; i < DIFF.length; ++i) {
			check(CTOR[k], N[j], PRED[i], DIFF[i]);
		}
	}
}
