var all, util, compare, itertools, functools, random, shuffle;

util = require( "util" );
compare = require( "aureooms-js-compare" );
random = require( "aureooms-js-random" );
itertools = require( "aureooms-js-itertools" );
functools = require( "aureooms-js-functools" );

shuffle = random.__shuffle__( random.__sample__( random.randint ) );

all = function ( heapname, Heap, diffname, diff, n ) {

	var title = util.format( "Heap update (%s, %s, %d)", heapname, diffname, n );

	console.log( title );

	test( title, function () {

		var q, a, reference, references, i, x, b;

		q = Heap( diff );
		a = [];
		b = [];
		references = [];

		i = n;
		while ( i-- ) {
			x = Math.random();
			reference = q.push( x );
			references.push( reference );
			a.push( x );
		}

		shuffle( references, 0, n );

		for ( i = 0 ; i < n ; ++i ) {

			a[i] += Math.random() - 0.5;
			q.update( references[i], a[i] );

			// not a typo
			q.update( references[i], a[i] );

		}

		i = n;

		while ( i-- ) {

			b.push( q.pop() );

		}

		a.sort( diff );

		deepEqual( b, a, "check identical");

		deepEqual( q.length, 0, "check length empty");

		if ( q.list !== undefined ) {
			deepEqual( q.list.length, 0, "list empty" );
		}
		else if ( q.array !== undefined ) {
			deepEqual( q.array.length, 0, "array empty" );
		}

		deepEqual( q.head(), undefined, "check head empty");
		deepEqual( q.headreference(), null, "check headreference empty");
		deepEqual( q.pop(), undefined, "check pop empty");
		deepEqual( q.popreference(), null, "check popreference empty");

	});

};


itertools.product( [

	itertools.chain( [

		itertools.map( functools.partial( functools.star,

			function ( heapname, template, treename, treeconstructor ) {

				return [
					heapname + ", " + treename,
					functools.partial( functools.create,
						[template( treeconstructor )]
					)
				];

			} ),

			itertools.product( [

			[
				["__BinomialHeap__", heap.__BinomialHeap__],
				// ["__LazyBinomialHeap__", heap.__LazyBinomialHeap__]
			],

			[
				//["BinomialTree", heap.BinomialTree],
				["BinomialTreeWithParent", heap.BinomialTreeWithParent]
			]

			], 1, [] ),

			[]

		),


		itertools.map( functools.partial( functools.star,

			function ( heapname, template, arityname, arity ) {

				return [
					heapname + ", " + arityname,
					template( arity )
				];

			} ),

			itertools.product( [

			[
				// [
				// 	"DAryHeapWithoutReferences",
				// 	functools.curry(
				// 		functools.partial(
				// 			functools.create, [heap.DAryHeapWithoutReferences]
				// 		),
				// 		2
				// 	)
				// ],
				[
					"DAryHeap",
					functools.curry(
						functools.partial(
							functools.create, [heap.DAryHeap]
						),
						2
					)
				]
			],

			[
				["unary", 1],
				["binary", 2],
				["ternary", 3],
				["4-ary", 4],
				["5-ary", 5]
			],

			], 1, [] ),

			[]

		),

	], [] ),

	[
		["increasing", compare.increasing],
		["decreasing", compare.decreasing]
	],

	[1, 16, 17, 31, 32, 33, 63, 64, 65]

], 1, [] ).forEach( functools.partial( functools.star, [all] ) );
