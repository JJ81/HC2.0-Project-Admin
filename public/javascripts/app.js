'use strict';
require.config({
	map: {},
	paths: {
		jquery: ['/components/gentelella/vendors/jquery/dist/jquery.min'],
		bootstrap: ['/components/gentelella/vendors/bootstrap/dist/js/bootstrap.min'],
		custom: ['/components/gentelella/build/js/custom.min'],
		// bootstrapProgressbar: ['/components/gentelella/vendors/bootstrap-progressbar/bootstrap-progressbar.min'],
    jqueryForm:['/components/jquery-form/jquery.form'],
		common: ['/javascripts/common'],
		videoJS: ['/components/video.js/dist/video.min'],
		videoJSYoutube: ['/components/videojs-youtube/dist/Youtube.min'],
	},
	shim: {
		custom: ['jquery','bootstrap'],
		bootstrap: ['jquery'],
		bootstrapProgressbar: ['jquery'],
		iCheck:['jquery'],
	}
});
