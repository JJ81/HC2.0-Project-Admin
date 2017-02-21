/**
 * Created by yijaejun on 01/12/2016.
 */
'use strict';
require.config({
	map: {},
	paths: {
		jquery: ['/components/gentelella/vendors/jquery/dist/jquery.min'],
		jqueryForm:['/components/jquery-form/jquery.form'],
		bootstrap: ['/components/gentelella/vendors/bootstrap/dist/js/bootstrap.min'],
		custom: ['/components/gentelella/build/js/custom.min'],
		iCheck: ['/components/gentelella/vendors/iCheck/icheck.min'],
		npPogress: ['/components/gentelella/vendors/nprogress/nprogress'],
		bootstrapProgressbar: ['/components/gentelella/vendors/bootstrap-progressbar/bootstrap-progressbar.min'],
		fastclick: ['/components/gentelella/vendors/fastclick/lib/fastclick'],
		common: ['/javascripts/common'],
		videoJS: ['/components/video.js/dist/video.min'],
		videoJSYoutube: ['/components/videojs-youtube/dist/Youtube.min']
	},
	shim: {
		custom: ['jquery','bootstrap'],
		bootstrap: ['jquery'],
		bootstrapProgressbar: ['jquery'],
		iCheck:['jquery'],
	}
});
