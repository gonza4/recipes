'use strict'

function orderResults(data, orderType, order, from, callback) {
	switch (orderType) {
		case 'ingredientes':
			if ('menor' === order) {
				data.sort(sort_by('ingredientLines', false, parseInt, true));
			} else {
				data.sort(sort_by('ingredientLines', true, parseInt, true));
			}

			paginate(data, from, (err, data) => {
				if(err) {
					callback(err);
				} else{
					callback(null, data);
				}
			});
			break;
		case 'porciones':
			if ('menor' === order) {
				data.sort(sort_by('yield', false, parseInt));
			} else {
				data.sort(sort_by('yield', true, parseInt));
			}
			
			paginate(data, from, (err, data) => {
				if(err) {
					callback(err);
				} else{
					callback(null, data);
				}
			});
			break;
		case 'calorias':
			if ('menor' === order) {
				data.sort(sort_by('calories', false, parseFloat));
			} else {
				data.sort(sort_by('calories', true, parseFloat));
			}

			paginate(data, from, (err, data) => {
				if(err) {
					callback(err);
				} else{
					callback(null, data);
				}
			});
			break;
		default:
			paginate(data, from, (err, data) => {
				if(err) {
					callback(err);
				} else{
					callback(null, data);
				}
			});
			break;
	}
}

function sort_by(field, reverse, primer, count){
	var key = primer ? 
		function(x) {return count ? primer(x[field].length) : primer(x[field])} : 
		function(x) {return x[field]};
	
	reverse = !reverse ? 1 : -1;
 
	return function (a, b) {
		if (count) {
			return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
		} else {
			return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
		}
	  } 
 }

function paginate(data, from, callback) {
	if (undefined === from || 0 === parseInt(from)) {
		from = 0;
	} else {
		from = parseInt(from - 1) + (20 * parseInt(from - 1));
	}
	
	if (from < 1) {
		from = from * -1;
	}

	let to = from + 20;
	let paginateData = data.slice(from, to);

	callback(null, paginateData);
}

module.exports = {
	orderResults
};