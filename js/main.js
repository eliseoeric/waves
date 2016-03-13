(function() {
	window.waveObjects = [];
	$('.wibbly-section').each(function( idx, el ) {
		return window.waveObjects.push(new WaveElement(el) );
	});

})();