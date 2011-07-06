// jQuery AJAX editable plugin
// v0.1
// @ 2011 Roman Damborsky <rdamborsky@gmail.com> (www.rdamborsky.com)

(function($) {
	$.fn.extend({
		ajaxEditable: function(options) {
			var defaults, validateAndSave, inputElements;

			defaults = {
				// type of editable element to be created - see inputElements object
				type: 'text',
				// function for content validation before saving - use editable validators extension or custom function(options, value)
				validator: null,
				// type of ajax request [ GET | POST ]
				ajaxType: 'POST',
				// url of ajax request processing script
				ajaxGateway: 'ajax.php',
				// function($element, value) called for preparation of JSON for ajax request (parameters names, adding some more data...)
				ajaxPrepare: null,
				// function($element, data) called after response from server is received
				ajaxCallback: null,
				// name of data property key for storing last saved (current) value
				originalValueHolderName: 'data-editable',
				// every input field will have id = this prefix + order number
				formElementsIdPrefix: 'editable-',
				// CSS class name used as identification of actual editable elements set
				classNameEditableSet: 'is-editable',
				// CSS class name to be added to originating element for the time of element being loaded
				classNameSaving: 'editable-saving',
				// CSS class name to be added when value is not valid
				classNameInvalid: 'editable-invalid',
				// CSS class name of added field that is used for value input
				classNameEditableField: 'editable-input',
				// in case of validation failed, this function is called - parameters: ($element, value)
				onError: null,
				// used for arrow navigation between elements, this should be element on level down from parent of all elements
				commonLevelSelector: 'tr',
				// allow user to navigate using UP/DOWN keys between elements in actual set
				arrowKeysNavigation: true,
				// allow validation and saving when user move out of element using TAB
				saveOnTabKey: true
			};

			options = $.extend(defaults, options);

			validateAndSave = function($element) {
				var value = $element.val(),
					opts = options,
					originalValueKey = opts.originalValueHolderName,
					params, callback;

				// no action if there is no change from original value
				if (value === $element.data(originalValueKey)) {
					return;
				}

				// validate element's content and notify user if there is any error
				if (opts.validator && !opts.validator(value)) {
					$element.addClass(opts.classNameInvalid);
					opts.onError && opts.onError($element, value);
					return;
				}

				// prepare parameters and callback for AJAX call
				params = opts.ajaxPrepare ? opts.ajaxPrepare($element, value) : value;
				callback = function(data) {
					$element.data(originalValueKey, value).removeAttr('disabled').parent().removeClass(opts.classNameSaving);
					opts.ajaxCallback && opts.ajaxCallback($element, data);
				};

				// disable element when processed and send request
				$element.attr('disabled', 'disabled').parent().addClass(opts.classNameSaving);
				$.ajax({
					type: opts.ajaxType,
					url: opts.ajaxGateway,
					data: params,
					success: callback,
					dataType: 'json'
				});
			};

			inputElements = {
				elementTypes: {
					text: function(params) {
						var $cont = params.$container,
							originalValue = $cont.text(),
							$field;

						$field = $('<input/>').
							attr('id', params.idPrefix + params.order).
							attr('value', originalValue);

						$cont.empty().append($field);

						// when initialized, store current value of data within input element
						return $field.addClass(params.elementClass).data(params.valueHolderKey, originalValue);
					}
				},
				create: function(params) {
					return this.elementTypes[params.type](params);
				}
			};

			return this.each(function(i) {
				var $this = $(this),
					opts = options,
					originalValueKey = opts.originalValueHolderName,
					$element;

				// replace target element with form element
				$element = inputElements.create({
					$container: $this,
					type: opts.type,
					order: i,
					valueHolderKey: originalValueKey,
					idPrefix: opts.formElementsIdPrefix,
					elementClass: opts.classNameEditableField
				});

				// set up keyboard interaction
				$element.bind('keyup', function(e) {
					var $this = $(this),
						value = $this.val(),
						code = e.keyCode,
						opts = options;

					// remove validation error styling
					if ($this.hasClass(opts.classNameInvalid) && opts.validator && opts.validator(value)) {
						$this.removeClass(opts.classNameInvalid);
					}

					if (opts.arrowKeysNavigation && (code === 40)) {
						// down
						$this.closest(opts.commonLevelSelector).next().find('.' + opts.classNameEditableSet).find('.' + opts.classNameEditableField).focus().select();
					} else if (opts.arrowKeysNavigation && (code === 38)) {
						// up
						$this.closest(opts.commonLevelSelector).prev().find('.' + opts.classNameEditableSet).find('.' + opts.classNameEditableField).focus().select();
					} else if (code === 27) {
						// esc - rollback to last saved value
						$this.val($this.data(originalValueKey));
					} else if (code === 13) {
						// enter
						validateAndSave($this);
					}
				});

				// validation and saving on TAB key
				opts.saveOnTabKey && $element.bind('blur', function() {
					validateAndSave($(this));
				});

			});

		}
	});
}(jQuery));