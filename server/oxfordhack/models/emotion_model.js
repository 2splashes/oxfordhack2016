var users = require('./users');

var threshold = 0.1;

var derivativeMeans = function (id, n, callback) {
	users.getHistory(id, function (history) {
		n = Math.min(n, history.length);
		history.reverse();
		var deltas = [];
		for (var i = 0; i < n - 1; i++) {
			deltas.push(history[i+1].sadness - history[i].sadness);
		}
		var delDeltas = [];
		for (var i = 0; i < n - 2; i++) {
			delDeltas.push(deltas[i + 1] - deltas[i]);
		}
		callback(deltas, delDeltas);
	});
};

var depressedProbability = function (id, callback) {
	derivativeMeans(id, 5, function (firstDel, secondDel) {
		var firstMean = 0;
		var secondMean = 0;
		for (var i = 0; i < firstDel.length; i++) firstMean += firstDel[i];
		for (var i = 0; i < secondDel.length; i++) secondMean += secondDel[i];
		firstMean /= firstDel.length;
		secondMean /= secondDel.length;
		var prob = 0.3 - (firstMean*2);

		callback(prob);
	});
};

module.exports = {
	depressedProbability: depressedProbability,
	derivativeMeans: derivativeMeans
};