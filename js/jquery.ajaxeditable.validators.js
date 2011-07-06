// jQuery AJAX editable plugin - validators extension
// v0.1
// @ 2011 Roman Damborsky <rdamborsky@gmail.com> (www.rdamborsky.com)

(function($) {

	var ajaxEditableValidators = window.ajaxEditableValidators = {
		validators: {},
		prepare: function(type, options) {
			var that = this;
			return function(value) {
				return that.validators[type].call(that, options, value);
			};
		},
		register: function(type, func) {
			this.validators[type] = func;
		}			
	};

	ajaxEditableValidators.register('number', function(options, value) {
		options = $.extend({
			minValue: null,
			maxValue: null
		}, options);

		if (!value.match(/^\-?[0-9]+$/)) {
			return false;
		}

		if (options.minValue !== null && value < options.minValue) {
			return false;
		}

		if (options.maxValue !== null && value > options.maxValue) {
			return false;
		}

		return true;
	});

}(jQuery));