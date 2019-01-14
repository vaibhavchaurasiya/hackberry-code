function jscss (){


	var pathconfig = {

		css_path: [
			'./css/bootstrap.css',
			'./css/bootstrap-theme.css',
            './css/owl.carousel.min.css',
            './css/owl.theme.default.min.css',
			'./css/style.css'  
		],

		js_path: [
			'./js/vendor/jquery-1.11.2.min.js',
			'./js/vendor/bootstrap.js',
            './js/vendor/owl.carousel.min.js',
            './js/vendor/all.js',
			// Material Files
            './js/vendor/materialize.min.js',
            './js/vendor/materialize_js/forms.js',
            './js/vendor/jquery.validate.min.js',
            
			'./js/main.js'
		]
	}

	return pathconfig;

}

module.exports = jscss();

