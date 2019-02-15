/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _autosize = __webpack_require__(1);

	var _autosize2 = _interopRequireDefault(_autosize);

	var _formcraftValidation = __webpack_require__(2);

	var _formcraftValidation2 = _interopRequireDefault(_formcraftValidation);

	var _helpers = __webpack_require__(3);

	var _helpers2 = _interopRequireDefault(_helpers);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function globalNotification(type, message) {
		type = type === 'error' ? 'red' : 'green';
		jQuery('#notification-panel').removeClass('red green').addClass(type).html(message);
	}

	if (typeof Object.assign !== 'function') {
		Object.assign = function (target) {
			'use strict';

			if (target === null) {
				throw new TypeError('Cannot convert undefined or null to object');
			}

			target = Object(target);
			for (var index = 1; index < arguments.length; index++) {
				var source = arguments[index];
				if (source !== null) {
					for (var key in source) {
						if (Object.prototype.hasOwnProperty.call(source, key)) {
							target[key] = source[key];
						}
					}
				}
			}
			return target;
		};
	}

	var FormCraft = function () {
		function FormCraft(form) {
			_classCallCheck(this, FormCraft);

			this.form = form;
			this.formID = form.attr('data-id');
			this.parentElement = form.parents('.form-live');
			var self = this;

			// Setup complex form elements
			this.setupInputMasks();
			this.setupCharacterCount();
			this.setupSliderFields();
			this.setupDatepickerFields();
			this.setupFileUploadFields();
			this.setupTimepickerFields();
			this.setupAddressFields();
			form.find('.star-cover label').removeClass('fake-click fake-hover active');
			this.form.find('.textarea-cover textarea').each(function () {
				(0, _autosize2.default)(this);
			}).on('input', function () {
				var evt = document.createEvent('Event');
				evt.initEvent('autosize:update', true, false);
				this.dispatchEvent(evt);
			});

			// Simple Stuff
			if (jQuery().tooltip) {
				if (_helpers2.default.isMobile() === true) {
					this.parentElement.find('.fc-form [data-toggle="tooltip"]').tooltip({
						container: '.fc-form',
						placement: 'top'
					});
				} else {
					this.parentElement.find('.fc-form [data-toggle="tooltip"]').tooltip({
						container: '.fc-form'
					});
				}
			}

			jQuery('.formcraft-icon').each(function () {
				if (jQuery(this).text() === '' || jQuery(this).text() === 'no-icon') {
					jQuery(this).remove();
				}
			});

			// Parse form text to look for math formulas in []
			this.prepareMathFormulas();

			// Handle form submission
			jQuery(this.form).on('submit', function (event) {
				event.preventDefault();
				FormCraftSubmitForm(self.form, 'all');
			});

			jQuery(this.form).find('span.error').text('');
			setTimeout(function () {
				jQuery(this.form).find('.form-element.error-field').removeClass('error-field');
			}, 300);

			// Auto-save form progress data every 3 seconds
			if (self.form.hasClass('save-form-true')) {
				setInterval(self.saveProgress.bind(self), 3000);
			}

			// Our logic is stored as plain text in a hidden element. Retrieve that.
			var logicText = this.parentElement.find('.form-logic').text().replace(/“/g, '"').replace(/”/g, '"').replace(/″/g, '"').replace(/„/g, '"').replace(/″/g, '"');
			this.FormCraftLogic = logicText.trim() === '' ? {} : jQuery.parseJSON(logicText);
			this.parentElement.find('.form-logic').remove();

			// Check if we need to execute Conditional Logic or Math Logic on changes in fields
			form.on('input', '.oneLineText-cover input[type="text"], .address-cover input[type="text"], .password-cover input[type="password"], .datepicker-cover input[type="text"], .email-cover input[type="text"], .email-cover input[type="email"], .textarea-cover textarea', function () {
				self.setValue = [];
				self.checkIfApplyMath(jQuery(this));
				self.checkIfApplyLogic(jQuery(this));
			});
			form.on('change', '.customText-cover input[type="hidden"], .timepicker-cover input[type="hidden"], .slider-cover input[type="hidden"], .fileupload-cover input[type="hidden"], .checkbox-cover input[type="radio"], .star-cover input[type="radio"], .thumb-cover input[type="radio"], .checkbox-cover input[type="checkbox"], .dropdown-cover select', function () {
				self.setValue = [];
				self.checkIfApplyMath(jQuery(this));
				self.checkIfApplyLogic(jQuery(this));
			});

			// If form had previously saved data, populate it in the form
			setTimeout(function () {
				var data = {};
				self.form.parents('.form-live').find('.pre-populate-data').each(function () {
					var dataTemp = jQuery(this).text().replace(/“/g, '"').replace(/”/g, '"');
					dataTemp = jQuery.parseJSON(dataTemp);
					for (var field in dataTemp) {
						if (dataTemp[field] === '' || _typeof(dataTemp[field]) === 'object' && dataTemp[field][0] === '') {
							delete dataTemp[field];
						}
					}
					data = Object.assign(data, dataTemp);
				});
				self.setFormValues(data);
			}, 0);

			form.keypress(function (event) {
				if (event.which === 13 && form.hasClass('disable-enter-true') === true) {
					event.preventDefault();
				}
			});

			// HoneyPot
			this.form.find('.required_field').hide();

			// Mark ReadOnly
			this.form.find('[make-read-only="true"]').attr('readonly', true).addClass('is-read-only');
		}

		_createClass(FormCraft, [{
			key: 'disableSubmit',
			value: function disableSubmit() {
				this.form.find('.submit-button').attr('disabled', true);
			}
		}, {
			key: 'enableSubmit',
			value: function enableSubmit() {
				this.form.find('.submit-button').attr('disabled', false);
			}
		}, {
			key: 'setupCharacterCount',
			value: function setupCharacterCount() {
				this.form.find('.textarea-cover textarea').on('input', function () {
					var len = jQuery(this).val().length;
					var max = parseInt(jQuery(this).parents('.textarea-cover').find('.count-true > span.max-count').text(), 10);
					if (len > max) {
						jQuery(this).parents('.textarea-cover').find('.count-true').css('color', 'red');
					} else {
						jQuery(this).parents('.textarea-cover').find('.count-true').css('color', 'inherit');
					}
					jQuery(this).parents('.textarea-cover').find('.count-true > span.current-count').text(len);
				});
			}
		}, {
			key: 'setupInputMasks',
			value: function setupInputMasks() {
				this.form.find('[data-input-mask]').each(function () {
					var options = {
						onComplete: function onComplete(cep, event) {
							jQuery(event.srcElement).removeClass('mask-invalid');
						},
						onChange: function onChange(cep, event) {
							jQuery(event.srcElement).addClass('mask-invalid');
						}
					};
					if (jQuery(this).attr('data-input-mask').replace(/[^a-zA-Z0-9 ():\-\/]+/g, '').trim() !== '') {
						jQuery(this).mask(jQuery(this).attr('data-input-mask').replace(/[^a-zA-Z0-9 ():\-\/]+/g, ''), options);
					}
				});
			}
		}, {
			key: 'setupSliderFields',
			value: function setupSliderFields() {
				this.form.find('.slider-cover .ui-slider-cover').each(function () {
					var options = {};
					options.min = parseFloat(jQuery(this).find('> span').attr('range-min'));
					options.max = parseFloat(jQuery(this).find('> span').attr('range-max'));
					options.step = parseFloat(jQuery(this).find('> span').attr('range-step'));
					options.range = jQuery(this).find('> span').attr('range-true') === 'true' ? true : 'min';
					var prefix = jQuery(this).find('> span').attr('data-prefix') || '';
					var suffix = jQuery(this).find('> span').attr('data-suffix') || '';
					options.create = function () {
						if (options.range === true) {
							jQuery(this).find('.ui-slider-range').eq(0).append('<span class="ui-slider-handle-nos">0</span>');
						} else {
							jQuery(this).find('span.ui-slider-handle').eq(0).append('<span class="ui-slider-handle-nos">0</span>');
						}
						jQuery(this).parents('.slider-cover').find('input[type="hidden"]').val('').trigger('change').attr('data-prefix', prefix).attr('data-suffix', suffix);
					};
					options.change = options.slide = function (event, ui) {
						jQuery(this).parents('.ui-slider-cover').find('.ui-slider-handle-nos').show();
						var thousand = jQuery(this).parents('.fc-form').attr('data-thousand');
						var decimal = jQuery(this).parents('.fc-form').attr('data-decimal');
						jQuery(this).parents('.slider-cover').find('.ui-slider-handle-nos').css('margin-left', '-' + (jQuery(this).parents('.slider-cover').find('.ui-slider-handle-nos').outerWidth() / 2 - 9) + 'px');
						var value = void 0,
						    valueAmount = void 0,
						    valueOne = void 0,
						    valueOneFrom = void 0,
						    valueZero = void 0,
						    valueZeroFrom = void 0;

						if (ui.values) {
							valueAmount = ui.values[0] + ' - ' + ui.values[1];
							valueZero = ui.values[0].toString().replace(/[.]/g, decimal).replace(/\B(?=(\d{3})+(?!\d))/g, thousand);
							valueOne = ui.values[1].toString().replace(/[.]/g, decimal).replace(/\B(?=(\d{3})+(?!\d))/g, thousand);
							valueZeroFrom = ui.values[0];
							valueOneFrom = ui.values[1];
							ui.values[0] = prefix + ui.values[0] + suffix;
							ui.values[1] = prefix + ui.values[1] + suffix;
							value = ui.values[0] + ' - ' + ui.values[1];
						} else {
							valueAmount = ui.value;
							value = parseFloat(ui.value);
							valueZero = value.toString().replace(/[.]/g, decimal).replace(/\B(?=(\d{3})+(?!\d))/g, thousand);
							valueZeroFrom = value;
							valueOne = '';
							valueOneFrom = '';
							value = prefix + value + suffix;
						}
						jQuery(this).parents('.slider-cover').find('input').val(valueAmount).trigger('change');
						value = value.replace(valueZeroFrom, valueZero).replace(valueOneFrom, valueOne);
						jQuery(this).parents('.slider-cover').find('.ui-slider-handle-nos').text(value);
					};
					jQuery(this).html('<span></span>');
					jQuery(this).find('span').slider(options);
				});
			}
		}, {
			key: 'setupDatepickerFields',
			value: function setupDatepickerFields() {
				this.form.find('.datepicker-cover input[type="text"]').each(function () {
					jQuery(this).removeClass('hasDatepicker');
					var options = {};
					options.beforeShow = function () {
						jQuery('#ui-datepicker-div').removeClass('ui-datepicker').addClass('formcraft-datepicker');
					};
					options.onClose = function () {
						jQuery(this).trigger('blur');
					};
					options.onSelect = function () {
						jQuery(this).trigger('change').trigger('input');
						if (jQuery('[data-date-min-range="[' + jQuery(this).attr('data-field-id') + ']"]').length !== 0 && jQuery('[data-date-min-range="[' + jQuery(this).attr('data-field-id') + ']"]').hasClass('hasDatepicker')) {
							jQuery('[data-date-min-range="[' + jQuery(this).attr('data-field-id') + ']"]').datepicker('option', 'minDate', jQuery(this).datepicker('getDate'));
						}
					};
					if (jQuery(this).attr('data-date-lang') && jQuery(this).attr('data-date-lang') !== 'en' && window.datepickerLoad === false) {
						jQuery.getScript(FC.datepickerLang + 'datepicker-' + jQuery(this).attr('data-date-lang') + '.js');
						window.datepickerLoad = true;
					}
					if (jQuery(this).attr('data-date-format')) {
						options.dateFormat = jQuery(this).attr('data-date-format');
					}

					if (jQuery(this).attr('data-date-max')) {
						var maxDate = void 0;
						if (jQuery(this).attr('data-date-max') !== '' && parseInt(jQuery(this).attr('data-date-max'), 10).toString() === jQuery(this).attr('data-date-max')) {
							maxDate = new Date();
							maxDate.setDate(maxDate.getDate() + parseInt(jQuery(this).attr('data-date-max'), 10));
						} else {
							maxDate = new Date(jQuery(this).attr('data-date-max-alt'));
						}
						options.maxDate = maxDate;
					}
					if (jQuery(this).attr('data-date-min')) {
						var minDate = void 0;
						if (jQuery(this).attr('data-date-min') !== '' && parseInt(jQuery(this).attr('data-date-min'), 10).toString() === jQuery(this).attr('data-date-min')) {
							minDate = new Date();
							minDate.setDate(minDate.getDate() + parseInt(jQuery(this).attr('data-date-min'), 10));
						} else {
							minDate = new Date(jQuery(this).attr('data-date-min-alt'));
						}
						options.minDate = minDate;
					}
					if (jQuery(this).attr('data-date-days')) {
						var tempNew = jQuery.map(jQuery.parseJSON(jQuery(this).attr('data-date-days')), function (x, y) {
							if (x === true) return y;
						});
						options.beforeShowDay = function (date) {
							if (tempNew.indexOf(date.getDay().toString()) !== -1) return [true, ''];
							return [false, ''];
						};
					}
					options.nextText = '❯';
					options.prevText = '❮';
					options.hideIfNoPrevNext = true;
					options.changeYear = true;
					options.changeMonth = true;
					options.showAnim = false;
					options.yearRange = 'c-100:c+100';
					options.shortYearCutoff = 50;
					options.showOtherMonths = true;
					jQuery(this).datepicker(options);
				});
			}
		}, {
			key: 'setupFileUploadFields',
			value: function setupFileUploadFields() {
				if (this.form.find('.fileupload-cover .button-file input').length === 0) return;
				this.form.find('.fileupload-cover .button-file input').fileupload({
					dataType: 'json',
					add: function add(e, data) {
						var thisForm = jQuery(this).parents('form').data('FormCraft');
						thisForm.disableSubmit();
						if (jQuery(this).attr('data-allow-extensions') !== '' && jQuery(this).attr('data-allow-extensions').indexOf(',')) {
							var extensions = jQuery(this).attr('data-allow-extensions').replace(/ /g, '').split(',');
							for (var file in data.files) {
								var fileParts = data.files[file].name.split('.');
								var fileExtension = fileParts[fileParts.length - 1];
								if (extensions.indexOf(fileExtension.toLowerCase()) === -1) {
									thisForm.enableSubmit();
									return false;
								}
							}
						}
						if (jQuery(this).attr('data-max-files') !== '') {
							if (jQuery(this).parent().parent().find('.files-list li').length >= parseInt(jQuery(this).attr('data-max-files'), 10)) {
								thisForm.enableSubmit();
								return false;
							}
						}

						if (typeof jQuery(this).attr('data-max-size') !== 'undefined' && jQuery(this).attr('data-max-size') !== '') {
							var maxSize = parseFloat(jQuery(this).attr('data-max-size'));
							if (data.files[0].size / 1024 > maxSize) {
								if (typeof window['FC_Validation_' + thisForm.formID].max_file_size === 'undefined') {
									alert('File too big');
								} else {
									alert(window['FC_Validation_' + thisForm.formID].max_file_size.replace('[x]', maxSize));
								}
								thisForm.enableSubmit();
								return false;
							}
						}

						var id = jQuery(this).parents('.fc-form').attr('data-id');
						data.url = '' + FC.ajaxurl + (FC.ajaxurl.indexOf('?') === -1 ? '?' : '&') + 'action=formcraft3_file_upload&id=' + id;
						var parent = jQuery(this).parent().parent();
						if (parent.find('.files-list').length === 0) {
							parent.append('<ul class="files-list"></ul>');
						}
						parent.find('.files-list').append('<li><div></div></li>');
						data.listPosition = parent.find('li').length - 1;
						parent.find('.files-list li').eq(data.listPosition).slideDown(100);
						data.timeout = 0;
						window.jqXHR = data.submit();
					},
					progress: function progress(e, data) {
						var parent = jQuery(this).parent().parent();
						var progress = parseInt(data.loaded / data.total * 100, 10);
						parent.find('.files-list li').eq(data.listPosition).find('div').css('width', progress + '%');
					},
					done: function done(e, data) {
						var thisForm = jQuery(this).parents('form').data('FormCraft');
						thisForm.enableSubmit();
						var parent = jQuery(this).parent().parent();
						if (data.result.success) {
							var name = jQuery(this).attr('data-name-list');
							parent.find('.files-list li').eq(data.listPosition).find('div').text(data.result.file_name);
							parent.find('.files-list li').eq(data.listPosition).append('<span class="delete-file" title="Delete File">&times;</span><input type="hidden" data-field-id="' + name + '" name="' + name + '[]" value="' + data.result.success + '"/>');
							parent.find('.files-list li').eq(data.listPosition).find('input').trigger('change');
						} else if (data.result.failed) {
							parent.find('.files-list li').eq(data.listPosition).remove();
							if (showDebug === true) {
								globalNotification('error', data.result.debug);
							}
						}
					}
				});
				this.form.find('.fileupload-cover').on('click', '.files-list .delete-file', function () {
					var key = jQuery(this).parent().find('input').val();
					jQuery(this).addClass('icon-spin5 animate-spin').html('');
					jQuery.ajax({
						url: FC.ajaxurl,
						type: 'POST',
						context: jQuery(this),
						data: 'action=formcraft3_file_delete&id=' + key,
						dataType: 'json'
					}).done(function (response) {
						if (response.success) {
							jQuery(this).parent().slideUp(200, function () {
								jQuery(this).find('input').val('').trigger('change');
								jQuery(this).remove();
							});
						} else {
							jQuery(this).removeClass('icon-spin5 animate-spin').html('×');
						}
					}).always(function () {
						jQuery(this).removeClass('icon-spin5 animate-spin').html('×');
					});
				});
			}
		}, {
			key: 'setupTimepickerFields',
			value: function setupTimepickerFields() {
				this.form.on('input, change', '.time-fields-cover > select, .time-fields-cover > input', function () {
					var parent = jQuery(this).parent();
					var hrs = parent.find('select').eq(0).val();
					var minute = parent.find('select').eq(1).val();
					var meridian = parent.find('input').val();
					if (jQuery(this).parent().hasClass('hide-meridian-true')) {
						parent.parent().find('input[type="hidden"]').val(hrs + ':' + minute).trigger('change');
					} else {
						parent.parent().find('input[type="hidden"]').val(hrs + ':' + minute + ' ' + meridian).trigger('change');
					}
				});
				this.form.on('focus', '.meridian-picker', function () {
					if (jQuery(this).val() === 'am') {
						jQuery(this).val('pm').trigger('change');
					} else if (jQuery(this).val() === 'pm') {
						jQuery(this).val('am').trigger('change');
					} else {
						jQuery(this).val('am').trigger('change');
					}
					jQuery(this).blur();
					jQuery(this).trigger('input');
				});
			}
		}, {
			key: 'setupAddressFields',
			value: function setupAddressFields() {
				if (typeof AddressPicker === 'undefined') {
					jQuery('.address-picker-field').parents('.field-cover').find('.address-field-map').html('You need to enter the Google API Key when editing the field to make the autocomplete address field work').css('height', 'auto').css('color', 'red');
					return;
				}
				jQuery('.address-picker-field').each(function () {
					var _this = this;

					if (!jQuery(this).is('[class*=tt-]')) {
						if (jQuery(this).attr('data-show-map') === 'true') {
							jQuery(this).parents('.field-cover').find('.address-field-map').css('height', jQuery(this).attr('data-map-height'));
							jQuery(this).data('addressField', new AddressPicker({
								map: {
									id: jQuery(this).parents('.field-cover').find('.address-field-map')[0]
								},
								reverseGeocoding: true
							}));
							jQuery(this).typeahead(null, {
								displayKey: 'description',
								source: jQuery(this).data('addressField').ttAdapter()
							});
							jQuery(this).bind('typeahead:selected', jQuery(this).data('addressField').updateMap);
							jQuery(this).bind('typeahead:cursorchanged', jQuery(this).data('addressField').updateMap);
							jQuery(jQuery(this).data('addressField')).on('addresspicker:selected', function (event, result) {
								jQuery(_this).parents('.address-cover').find('.address-picker-field-hidden').val(result.placeResult.formatted_address);
								jQuery(_this).val(result.address());
							});
						} else {
							jQuery(this).data('addressField', new AddressPicker());
							jQuery(this).typeahead(null, {
								displayKey: 'description',
								source: jQuery(this).data('addressField').ttAdapter()
							});
							jQuery(this).parents('.field-cover').find('.address-field-map').hide();
							jQuery(this).bind('typeahead:selected', jQuery(this).data('addressField').updateMap);
							jQuery(this).bind('typeahead:cursorchanged', jQuery(this).data('addressField').updateMap);
							jQuery(jQuery(this).data('addressField')).on('addresspicker:selected', function (event, result) {
								jQuery(_this).parents('.address-cover').find('.address-picker-field-hidden').val(result.placeResult.formatted_address);
								jQuery(_this).val(result.address());
							});
						}
					}
				});
			}
		}, {
			key: 'prepareMathFormulas',
			value: function prepareMathFormulas() {
				this.FormCraftMath = [];
				var self = this;
				this.form.find('.customText-cover > div, .stripe-cover div.stripe-amount-show, .stripe-cover input.stripe-amount-hidden, .customText-cover input[type="hidden"], .allow-math').each(function () {
					var html = void 0,
					    match = void 0,
					    text = void 0,
					    textToSearch = void 0;
					if (jQuery(this).prop('type') === 'hidden') {
						text = textToSearch = jQuery(this).val();
					} else {
						text = jQuery(this).text();
						html = jQuery(this).html();
						var temp = jQuery('<div>').html(html);
						temp.find('.fc-third-party').remove();
						textToSearch = temp.text();
					}
					var pattern = /\[(.*?)\]/g;
					while ((match = pattern.exec(textToSearch)) !== null) {
						match[0] = jQuery('<div/>').text(match[0]).html();
						var identifier = Math.random().toString(36).replace(/[^a-z]+/g, '').substring(0, 8);
						if (jQuery(this).prop('type') === 'hidden') {
							jQuery(this).attr('id', 'bind-math-' + identifier).val('');
						} else {
							html = html.replace(match[0], '<span id="bind-math-' + identifier + '"></span>');
							jQuery(this).html(html);
						}

						self.FormCraftMath[identifier] = { identifier: identifier, variables: [] };
						self.FormCraftMath[identifier].string = match[1].replace(/[^a-zA-Z0-9.*()\-,+\/]+/g, '').toLowerCase();
						if (self.FormCraftMath[identifier].string.slice(-1).replace(/[^.*\-,+\/]+/g, '') !== '') {
							self.FormCraftMath[identifier].string = self.FormCraftMath[identifier].string.slice(0, self.FormCraftMath[identifier].string.length - 1);
						}
						if (self.FormCraftMath[identifier].string.replace(/[^.*()\-,+\/]+/g, '') === '') {
							self.FormCraftMath[identifier].resultType = 'string';
						} else {
							self.FormCraftMath[identifier].resultType = 'math';
						}
						var fields = self.FormCraftMath[identifier].string.split(/[*()\-,+\/]/);
						for (var field in fields) {
							if (fields[field] === '' || typeof fields[field] === 'function' || fields[field].replace(/[^\d.-]/g, '') === fields[field]) {
								continue;
							}
							self.FormCraftMath[identifier].variables.push(fields[field]);
						}
						self.FormCraftMath[identifier].variables = self.FormCraftMath[identifier].variables.sort(function (a, b) {
							return parseInt(b.replace('field', ''), 10) - parseInt(a.replace('field', ''), 10);
						});
					}
				});
			}
		}, {
			key: 'checkIfApplyMath',
			value: function checkIfApplyMath(element) {
				var fieldID = jQuery(element).attr('data-field-id');
				for (var formula in this.FormCraftMath) {
					for (var field in this.FormCraftMath[formula].variables) {
						if (this.FormCraftMath[formula].variables[field] === fieldID) {
							this.calculateAndApplyMath(this.FormCraftMath[formula]);
						}
					}
				}
			}
		}, {
			key: 'calculateAndApplyMath',
			value: function calculateAndApplyMath(formula) {
				var mathResult = void 0;
				var form = jQuery('#bind-math-' + formula.identifier).parents('form');
				var thousand = jQuery('#bind-math-' + formula.identifier).parents('form').attr('data-thousand');
				var decimal = jQuery('#bind-math-' + formula.identifier).parents('form').attr('data-decimal');

				if (formula.variables.length === 1 && formula.variables[0] === formula.string) {
					// Do this if the [] block has one variable
					mathResult = this.getFieldValue(jQuery('[data-field-id="' + formula.variables[0] + '"]'), 'string');
					if (jQuery('#bind-math-' + formula.identifier).prop('type') === 'hidden') {
						mathResult = parseFloat(mathResult);
						setTimeout(function () {
							jQuery('#bind-math-' + formula.identifier).val(mathResult).trigger('change');
						});
					} else if (jQuery('.fc-form.spin-true').length && !isNaN(parseFloat(mathResult))) {
						_helpers2.default.spinTo('#bind-math-' + formula.identifier, mathResult, thousand, decimal);
					} else {
						mathResult = mathResult.toString().replace(/[.]/g, decimal).replace(/\B(?=(\d{3})+(?!\d))/g, thousand);
						jQuery('#bind-math-' + formula.identifier).text(mathResult);
					}
					jQuery(document).trigger('formcraft_math_change', [form]);
				} else {
					// Do this if the [] block has more than one variable
					var string = formula.string;
					for (var field in formula.variables) {
						if (typeof formula.variables[field] === 'function') {
							continue;
						}
						var value = this.getFieldValue(jQuery(form).find('[data-field-id="' + formula.variables[field] + '"]'), 'number');
						var reg = new RegExp(formula.variables[field], 'g');
						value = value === '' ? 0 : value;
						string = string.replace(reg, value);
					}
					string = string.replace(/--/g, '+');
					try {
						mathResult = parseFloat(eval(string).toFixed(2));
					} catch (e) {
						mathResult = 0;
						if (e instanceof SyntaxError) {
							console.log('%cMath Formula Syntax Error. Formula: ' + string + '. FormID: ' + this.formID + '. Error: ' + e.message, 'color: red');
						}
					}
					if (jQuery('#bind-math-' + formula.identifier).prop('type') === 'hidden') {
						jQuery('#bind-math-' + formula.identifier).val(mathResult).trigger('change');
					} else if (jQuery('.fc-form.spin-true').length) {
						_helpers2.default.spinTo('#bind-math-' + formula.identifier, mathResult, thousand, decimal);
					} else {
						mathResult = mathResult.toString().replace(/[.]/g, decimal).replace(/\B(?=(\d{3})+(?!\d))/g, thousand);
						jQuery('#bind-math-' + formula.identifier).text(mathResult);
					}
					jQuery(document).trigger('formcraft_math_change', [form]);
				}
			}
		}, {
			key: 'checkIfApplyLogic',
			value: function checkIfApplyLogic(element) {
				var parent = this.form.parents('.form-live').attr('data-uniq');
				var fieldID = jQuery(element).attr('data-field-id');
				var applied = false;
				if (typeof this.FormCraftLogic !== 'undefined' && this.FormCraftLogic.length !== 0) {
					for (var logic in this.FormCraftLogic) {
						for (var conditions in this.FormCraftLogic[logic][0]) {
							var tempField = this.FormCraftLogic[logic][0][conditions][2];
							if (typeof tempField !== 'undefined' && tempField.slice(0, 1) === '[' && tempField.replace('[', '').replace(']', '') === fieldID) {
								this.applyLogic(this.FormCraftLogic[logic], parent);
								applied = true;
							} else if (this.FormCraftLogic[logic][0][conditions][0] === fieldID) {
								this.applyLogic(this.FormCraftLogic[logic], parent);
								applied = true;
							}
						}
					}
				}
				if (applied === true) {
					this.setFormValues(this.setValue);
				}
				if (typeof this.finalHideShowList === 'undefined') {
					return false;
				}
				for (var field in this.finalHideShowList) {
					if (field.substr(0, 5) !== 'field') {
						continue;
					}
					if (this.finalHideShowList[field].length === 0 || typeof this.finalHideShowList[field] === 'function') {
						continue;
					}
					this.finalHideShowList[field] = this.finalHideShowList[field].sort();
					var newState = this.finalHideShowList[field][this.finalHideShowList[field].length - 1];
					switch (newState) {

						case 'hide':
							if (!jQuery('.uniq-' + parent + ' form .form-element-' + field).hasClass('state-hidden')) {
								jQuery('.uniq-' + parent + ' form .form-element-' + field).removeClass('state-hidden state-shown over-write');
								jQuery('.uniq-' + parent + ' form .form-element-' + field).slideUp(300).addClass('state-hidden');
								jQuery('.uniq-' + parent + ' form .form-element-' + field).trigger('hideElement');
							}
							break;

						case 'show':
							if (!jQuery('.uniq-' + parent + ' form .form-element-' + field).hasClass('state-shown')) {
								jQuery('.uniq-' + parent + ' form .form-element-' + field).removeClass('state-hidden state-shown over-write');
								jQuery('.uniq-' + parent + ' form .form-element-' + field).slideDown(300).addClass('state-shown');
								jQuery('.uniq-' + parent + ' form .form-element-' + field).trigger('showElement');
							}
							break;

						case 'default':
							if (jQuery('.uniq-' + parent + ' form .form-element-' + field).hasClass('default-false') && jQuery('.uniq-' + parent + ' form .form-element-' + field).hasClass('state-hidden')) {
								jQuery('.uniq-' + parent + ' form .form-element-' + field).slideDown(300).removeClass('state-hidden state-shown').addClass('state-shown');
								jQuery('.uniq-' + parent + ' form .form-element-' + field).trigger('showElement');
							}
							if (jQuery('.uniq-' + parent + ' form .form-element-' + field).hasClass('default-true') && jQuery('.uniq-' + parent + ' form .form-element-' + field).hasClass('state-shown')) {
								jQuery('.uniq-' + parent + ' form .form-element-' + field).slideUp(300).removeClass('state-hidden state-shown').addClass('state-hidden');
								jQuery('.uniq-' + parent + ' form .form-element-' + field).trigger('hideElement');
							}
							break;

					}
				}
				this.finalHideShowList = [];
			}
		}, {
			key: 'applyLogic',
			value: function applyLogic(logic, parent) {
				this.finalHideShowList = this.finalHideShowList || [];
				window.finalEmailsTo = window.finalEmailsTo || [];
				var logicNos = this.FormCraftLogic.indexOf(logic);
				var conditions = logic[0];
				var actions = logic[1];
				var conditionsSatisfied = 0;
				var conditionsToSatisfy = logic[2] === 'or' ? 1 : conditions.length;

				for (var x in conditions) {
					var value = this.getFieldValue(jQuery('.uniq-' + parent + ' [data-field-id="' + conditions[x][0] + '"]'), 'string');
					var conditionToCheck = void 0,
					    tempVal = void 0;
					conditions[x][2] = conditions[x][2] || '';
					if (conditions[x][2].slice(0, 1) === '[') {
						conditionToCheck = conditions[x][2].replace('[', '').replace(']', '');
						conditionToCheck = this.getFieldValue(jQuery('[data-field-id="' + conditionToCheck + '"]'), 'string');
					} else {
						conditionToCheck = conditions[x][2];
					}
					switch (conditions[x][1]) {

						case 'equal_to':
							if (conditionToCheck.toString().indexOf('-') === 4) {
								tempVal = this.dateToDifference(conditionToCheck).toString();
							} else {
								tempVal = conditionToCheck;
							}
							if (tempVal === value.toString()) conditionsSatisfied++;
							break;

						case 'not_equal_to':
							if (conditionToCheck.toString().indexOf('-') === 4) {
								tempVal = this.dateToDifference(conditionToCheck).toString();
							} else {
								tempVal = conditionToCheck;
							}
							if (tempVal !== value.toString()) conditionsSatisfied++;
							break;

						case 'contains':
							if (conditionToCheck === '') {
								if (value !== '') conditionsSatisfied++;
								break;
							}
							if (value.toString().indexOf(conditionToCheck) !== -1) conditionsSatisfied++;
							break;

						case 'contains_not':
							if (value.toString().indexOf(conditionToCheck) === -1) conditionsSatisfied++;
							break;

						case 'greater_than':
							if (conditionToCheck.toString().indexOf('-') !== -1) {
								tempVal = this.dateToDifference(conditionToCheck);
							} else {
								tempVal = conditionToCheck;
							}
							if (!isNaN(parseFloat(value)) && parseFloat(value) > parseFloat(tempVal)) conditionsSatisfied++;
							break;

						case 'less_than':
							if (conditionToCheck.toString().indexOf('-') !== -1) {
								tempVal = this.dateToDifference(conditionToCheck);
							} else {
								tempVal = conditionToCheck;
							}
							if (!isNaN(parseFloat(value)) && parseFloat(value) < parseFloat(tempVal)) conditionsSatisfied++;
							break;
					}
				}
				this.executeLogic(actions, logicNos, conditionsToSatisfy, conditionsSatisfied);
			}
		}, {
			key: 'executeLogic',
			value: function executeLogic(actions, logicNos, conditionsToSatisfy, conditionsSatisfied) {

				for (var x in actions) {
					switch (actions[x][0]) {

						case 'hide_fields':
							if (!actions[x][1]) continue;
							var fieldsToHide = actions[x][1].split(',');
							for (var y in fieldsToHide) {
								if (typeof fieldsToHide[y] === 'function') continue;
								this.finalHideShowList[fieldsToHide[y]] = this.finalHideShowList[fieldsToHide[y]] || [];
								if (conditionsSatisfied >= conditionsToSatisfy) {
									this.finalHideShowList[fieldsToHide[y]].push('hide');
								} else {
									this.finalHideShowList[fieldsToHide[y]].push('default');
								}
							}
							break;

						case 'show_fields':
							if (!actions[x][1]) continue;
							var fieldsToShow = actions[x][1].split(',');
							for (var _y in fieldsToShow) {
								if (typeof fieldsToShow[_y] === 'function') continue;
								this.finalHideShowList[fieldsToShow[_y]] = this.finalHideShowList[fieldsToShow[_y]] || [];
								if (conditionsSatisfied >= conditionsToSatisfy) {
									this.finalHideShowList[fieldsToShow[_y]].push('show');
								} else {
									this.finalHideShowList[fieldsToShow[_y]].push('default');
								}
							}
							break;

						case 'email_to':
							if (!actions[x][2]) continue;
							var emails = actions[x][2];
							if (conditionsSatisfied >= conditionsToSatisfy) {
								if (window.finalEmailsTo.indexOf(logicNos + ':' + emails) === -1) {
									window.finalEmailsTo.push(logicNos + ':' + emails);
								}
							} else if (window.finalEmailsTo.indexOf(logicNos + ':' + emails) !== -1) {
								window.finalEmailsTo.splice(window.finalEmailsTo.indexOf(logicNos + ':' + emails), 1);
							}
							break;

						case 'redirect_to':
							window.finalRedirect = window.finalRedirect || [];
							if (conditionsSatisfied >= conditionsToSatisfy) {
								window.finalRedirect.push(actions[x][2]);
							} else if (window.finalRedirect.indexOf(actions[x][2]) !== -1) {
								window.finalRedirect.splice(window.finalRedirect.indexOf(actions[x][2]), 1);
							}
							break;

						case 'trigger_integration':
							if (!actions[x][3]) continue;
							window.triggerIntegration = window.triggerIntegration || [];
							if (conditionsSatisfied >= conditionsToSatisfy) {
								if (window.triggerIntegration.indexOf(actions[x][3]) === -1) {
									window.triggerIntegration.push(actions[x][3]);
								}
							} else if (window.triggerIntegration.indexOf(actions[x][3]) !== -1) {
								window.triggerIntegration.splice(window.triggerIntegration.indexOf(actions[x][3]), 1);
							}
							break;

						case 'set_value':
							// if (!actions[x][2]) continue
							this.setValue = this.setValue || [];
							var actionsApply = void 0;
							if (actions[x][2] && actions[x][2].slice(0, 1) === '[') {
								actionsApply = actions[x][2].replace('[', '').replace(']', '');
								actionsApply = this.getFieldValue(jQuery('[data-field-id="' + actionsApply + '"]'), 'string');
							} else {
								actionsApply = actions[x][2];
							}
							if (conditionsSatisfied >= conditionsToSatisfy) {
								this.setValue[actions[x][4]] = actionsApply;
							} else if (typeof this.setValue[actions[x][4]] !== 'undefined' && this.setValue[actions[x][4]] === actionsApply) {
								// delete this.setValue[actions[x][4]]
							}
							break;
					}
				}
			}

			/**
	  * Save form data in a JSON string, and store it in the database
	  */

		}, {
			key: 'saveProgress',
			value: function saveProgress() {
				var data = this.form.find('input, textarea, select').not('.no-save, [type="password"], .stripe-amount-hidden').serialize() + '&id=' + this.form.attr('data-id');
				if (!this.lastSaveProgress || this.lastSaveProgress !== data) {
					this.lastSaveProgress = data;
				} else {
					return false;
				}
				return jQuery.ajax({
					url: FC.ajaxurl,
					type: 'POST',
					data: 'action=formcraft_save_form_progress&' + data,
					dataType: 'json'
				});
			}

			/**
	  * Get value of an input field element
	  */

		}, {
			key: 'getFieldValue',
			value: function getFieldValue(element, type) {
				var parentUniq = this.parentElement.attr('data-uniq');
				if (jQuery(element).length === 0) {
					return 0;
				}
				var elementType = jQuery(element).prop('type');
				var result = void 0;
				var decimal = jQuery(element).parents('.fc-form').attr('data-decimal') === ',' ? ',' : '.';
				elementType = jQuery(element).is('select') ? 'select' : elementType;
				elementType = jQuery(element).hasClass('hasDatepicker') ? 'date' : elementType;
				elementType = jQuery(element).parent().parent().hasClass('files-list') ? 'file' : elementType;
				elementType = jQuery(element).parent().parent().hasClass('slider-cover') ? 'slider' : elementType;
				switch (elementType) {

					case 'text':case 'password':case 'select':case 'hidden':case 'email':case 'textarea':
						result = jQuery(element).val().replace(decimal, '.');
						break;

					case 'slider':
						result = jQuery(element).val().replace(decimal, '.');
						if (result.indexOf(' - ') !== -1) {
							result = (parseFloat(result.split(' - ')[0]) + parseFloat(result.split(' - ')[1])) / 2;
						}
						break;

					case 'radio':case 'checkbox':
						result = [];
						jQuery('.uniq-' + parentUniq + ' [name="' + jQuery(element).prop('name') + '"]:checked').each(function () {
							result.push(jQuery(this).val().replace(decimal, '.'));
						});
						break;

					case 'date':
						var date = jQuery(element).datepicker('getDate');
						if (date === null) {
							return '';
						}
						var now = new Date();
						var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
						date = date === null ? today : date;
						result = parseInt((date - today) / (60 * 60 * 24 * 1000), 10);
						break;

					case 'file':
						var name = jQuery(element).attr('name');
						result = 0;
						jQuery('[name="' + name + '"]').each(function () {
							if (jQuery(this).val() !== '') result++;
						});
						break;

				}
				if (type === 'string') {
					if ((typeof result === 'undefined' ? 'undefined' : _typeof(result)) === 'object') return result.join(', ');
					return result;
				}
				if ((typeof result === 'undefined' ? 'undefined' : _typeof(result)) === 'object') {
					var sum = 0;
					for (var x in result) {
						sum = sum + (isNaN(parseFloat(result[x])) ? 0 : parseFloat(result[x]));
					}
					return sum;
				} else if (typeof result === 'string' && result.indexOf('-') !== -1) {
					var temp = result.split('-');
					result = (parseFloat(temp[0].trim()) + parseFloat(temp[1].trim())) / 2;
					return isNaN(parseFloat(result)) ? 0 : parseFloat(result);
				}
				return isNaN(parseFloat(result)) ? 0 : parseFloat(result);
			}

			/**
	  * Set form field values
	  * @param {Object} data e.g. {field1: "Jack", field2: "23"}
	  */

		}, {
			key: 'setFormValues',
			value: function setFormValues(data) {
				var form = this.form;
				for (var x in data) {
					var element = form.find('[name="' + x + '"]').length === 0 ? form.find('[name="' + x + '[]"]') : form.find('[name="' + x + '"]');
					var elementType = element.prop('type');
					elementType = element.is('select') ? 'select' : elementType;
					elementType = element.hasClass('hasDatepicker') ? 'date' : elementType;
					elementType = element.parent().parent().hasClass('files-list') ? 'file' : elementType;
					elementType = element.parents('.field-cover').hasClass('slider-cover') ? 'slider' : elementType;
					elementType = element.parents('.field-cover').hasClass('timepicker-cover') ? 'timepicker' : elementType;
					switch (elementType) {

						case 'text':case 'email':case 'select':case 'hidden':case 'textarea':case 'date':
							if (element.attr('id')) {
								if (element.attr('id').substr(0, 9) === 'bind-math') break;
							}
							if (data[x] !== element.val()) {
								element.val(data[x]).trigger('input').trigger('change');
							}
							break;

						case 'radio':case 'checkbox':
							if (typeof data[x] === 'string' && data[x] === '' || data[x] === null && form.find('[name="' + x + '[]"]').length > 0) {
								form.find('[name="' + x + '[]"]').prop('checked', false).trigger('change');
							}
							data[x] = typeof data[x] === 'string' ? [data[x]] : data[x];
							for (var y in data[x]) {
								if (form.find('[name="' + x + '[]"]').length === 0) {
									form.find('[name="' + x + '"][value="' + data[x][y] + '"]').prop('checked', true).trigger('change');
								} else {
									form.find('[name="' + x + '[]"][value="' + data[x][y] + '"]').prop('checked', true).trigger('change');
								}
							}
							break;

						case 'timepicker':
							element.val(data[x]).trigger('change');
							var time = data[x].replace(' ', ':').split(':');
							time[0] = time[0] === '' || typeof time[0] === 'undefined' ? '00' : time[0];
							time[1] = time[1] === '' || typeof time[1] === 'undefined' ? '00' : time[1];
							time[2] = time[2] === '' || typeof time[2] === 'undefined' ? 'am' : time[2];
							element.parents('.timepicker-cover').find('.time-fields-cover > select').eq(0).val(time[0]);
							element.parents('.timepicker-cover').find('.time-fields-cover > select').eq(1).val(time[1]);
							element.parents('.timepicker-cover').find('.time-fields-cover > input').eq(0).val(time[2]);
							break;

						case 'slider':
							if (data[x] === '') break;
							if (data[x].indexOf(' - ') !== -1) {
								var temp = data[x].split(' - ');
								temp = temp.map(function (x) {
									return parseFloat(x.replace(/[^\d.-]/g, ''));
								});
								element.parents('.slider-cover').find('.ui-slider-cover > span').slider('values', temp);
							} else {
								data[x] = data[x].replace(element.attr('data-prefix'), '').replace(element.attr('data-suffix'), '');
								data[x] = isNaN(data[x]) ? 0 : parseFloat(data[x].replace(/[^\d.-]/g, ''));
								element.parents('.slider-cover').find('.ui-slider-cover > span').slider('value', data[x]);
							}
							break;
					}
				}
			}

			/**
	  * Save form data in a JSON string, and store it in the database
	  * @param (String) date      format YYYY-MM-DD
	  * @return (Number) result   difference in days between input data, and today
	  */

		}, {
			key: 'dateToDifference',
			value: function dateToDifference(date) {
				var temp = date.toString().split('-');
				var now = new Date();
				var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
				var fieldDate = new Date(temp[0], parseInt(temp[1], 10) - 1, temp[2]);
				return parseInt((fieldDate - today) / (60 * 60 * 24 * 1000), 10);
			}
		}]);

		return FormCraft;
	}();

	jQuery(document).ready(function () {
		jQuery('.fc-form').each(function () {
			var thisForm = new FormCraft(jQuery(this));
			jQuery(this).data('FormCraft', thisForm);
		});

		// Fix an issue where autosizing textarea doesn't work when the field is inside an element which is hidden by default
		jQuery('.fc-form-modal').on('shown.bs.fc_modal', function () {
			var form = jQuery(this).find('.fc-form').attr('data-id');
			jQuery(this).find('.fc-form').find('textarea').trigger('input');
			jQuery.get(FC.ajaxurl + '?action=formcraft3_trigger_view&id=' + form);
		});
	});

	/**
	* Legacy Support
	*/
	window.setFormValues = function (form, data) {
		form.data('FormCraft').setFormValues(data);
	};

	window.datepickerLoad = false;

	window.showDebug = window.location.href.indexOf('preview=true') > -1 ? true : false;

	if (window.location.protocol === 'https:') {
		FC.ajaxurl = FC.ajaxurl.replace('http:', 'https:');
		FC.datepickerLang = FC.datepickerLang.replace('http:', 'https:');
	}

	/**
	* Main function to handle form submission
	*/
	window.FormCraftSubmitForm = function (element, type, callback) {
		var redirect = '';
		var form = jQuery(element);
		if (type === 'all' && form.find('.form-element-type-submit.state-hidden').length === form.find('.form-element-type-submit').length) {
			return false;
		}
		form.find('.submit-response').slideUp('fast').html();
		var formData = jQuery(element).hasClass('dont-submit-hidden-true') ? form.find('.form-element').not('.state-hidden').find('input, select, textarea').serialize() : form.serialize();
		var hidden = [];
		form.find('.form-element.state-hidden').each(function () {
			hidden.push(jQuery(this).attr('data-identifier'));
		});
		hidden = hidden.join(', ');

		var emails = '';
		if (typeof window.finalEmailsTo !== 'undefined') {
			for (var x in window.finalEmailsTo) {
				if (typeof window.finalEmailsTo[x] === 'function') {
					continue;
				}
				emails = emails + ',' + encodeURIComponent(window.finalEmailsTo[x].substr(window.finalEmailsTo[x].indexOf(':') + 1));
			}
		}

		if (typeof window.finalRedirect !== 'undefined' && window.finalRedirect.length !== 0) {
			redirect = encodeURIComponent(window.finalRedirect[window.finalRedirect.length - 1]);
		}

		var triggerIntegration = void 0;
		if (typeof window.triggerIntegration !== 'undefined') {
			triggerIntegration = encodeURIComponent(JSON.stringify(window.triggerIntegration));
		}
		var data = formData + '&id=' + form.attr('data-id') + '&location=' + encodeURIComponent(window.location.href) + '&emails=' + emails + '&hidden=' + hidden + '&redirect=' + redirect + '&type=' + type + '&triggerIntegration=' + triggerIntegration;

		var abort = { abort: false };
		if (type === 'all') {
			form.find('.validation-lenient, .validation-strict').each(function () {
				if (!jQuery(this).parents('.form-element').hasClass('state-hidden')) {
					var a = jQuery(this).fcValidate();
					if (a === false) {
						abort.abort = true;
					}
				}
			});
		} else {
			var pageValidate = type - 1;
			form.find('.form-page-' + pageValidate + ' .validation-lenient, .validation-strict').each(function () {
				if (!jQuery(this).parents('.form-element').hasClass('state-hidden') && jQuery(this).parents('.form-page-' + pageValidate).length !== 0) {
					var a = jQuery(this).fcValidate();
					if (a === false) {
						abort.abort = true;
					}
				}
			});
		}
		if (type === 'all') {
			jQuery(document).trigger('formcraft_submit_trigger', [form, data, abort]);
		}
		if (abort.abort === true) {
			if (form.find('.error-field').length === 0) {
				return false;
			}
			if (_helpers2.default.isElementInViewport(form.find('.error-field').first()) === false) {
				var y = form.find('.error-field').first().offset().top;
				if (form.parents('.fc-form-modal').length) {
					y = form.parents('.fc-form-modal').scrollTop() + y - (form.height() + 130);
					form.parents('.fc-form-modal').animate({ scrollTop: form.find('.error-field').first().position().top }, 600);
				} else if (form.parents('.fc-sticky').length) {
					jQuery('.fc-sticky').animate({ scrollTop: form.find('.error-field').first().position().top - 30 }, 600);
				} else if (form.parent().find('.fc-pagination.fixed').length) {
					jQuery('html, body').animate({ scrollTop: y - 200 }, 600);
				} else {
					jQuery('html, body').animate({ scrollTop: y - 120 }, 600);
				}
			}
			if (typeof callback !== 'undefined') {
				callback(false);
			}
			return false;
		}
		form.find('.submit-cover').addClass('disabled');
		form.find('.form-element').removeClass('error-field');
		if (type === 'all') {
			form.find('.submit-button').attr('disabled', true);
		}
		var tempForm = form;
		jQuery.ajax({
			url: FC.ajaxurl,
			type: 'POST',
			timeout: 120000,
			data: 'action=formcraft3_form_submit&' + data,
			dataType: 'json'
		}).done(function (response) {
			form = tempForm;
			if (response.debug) {
				if (response.debug.failed) {
					if (showDebug === true) {
						for (var _x in response.debug.failed) {
							globalNotification('error', response.debug.failed[_x]);
						}
					}
				}
				if (response.debug.success) {
					if (showDebug === true) {
						for (var _x2 in response.debug.success) {
							globalNotification('success', '<i class=\'formcraft-icon\'>check</i> ' + response.debug.success[_x2]);
						}
					}
				}
			}
			if (response.failed) {
				if (form.parents('.fc-form-modal').length !== 0) {
					setTimeout(function () {
						form.addClass('shake');
					}, 600);
					setTimeout(function () {
						form.removeClass('shake');
					}, 1100);
				}
				form.find('.validation-lenient').addClass('validation-strict').removeClass('.validation-lenient');
				form.find('.submit-response').html('<span class="has-error">' + response.failed + '</span>').slideDown('fast');
				if (response.errors) {
					for (var field in response.errors) {
						form.find('.form-element-' + field).addClass('error-field');
						form.find('.form-element-' + field + ' .error').text(response.errors[field]);
					}
				}
				if (form.find('.error-field').length !== 0) {
					if (_helpers2.default.isElementInViewport(form.find('.error-field').first()) === false) {
						var _y2 = form.find('.error-field').first().offset().top;
						if (form.parents('.fc-form-modal').length) {
							_y2 = form.parents('.fc-form-modal').scrollTop() + _y2 - (form.height() + 130);
							form.parents('.fc-form-modal').animate({ scrollTop: form.find('.error-field').first().position().top }, 600);
						} else if (form.parents('.fc-sticky').length) {
							jQuery('.fc-sticky').animate({ scrollTop: form.find('.error-field').first().position().top - 30 }, 600);
						} else if (form.parent().find('.fc-pagination.fixed').length) {
							jQuery('html, body').animate({ scrollTop: _y2 - 200 }, 600);
						} else {
							jQuery('html, body').animate({ scrollTop: _y2 - 120 }, 600);
						}
					}
				}
			} else if (typeof response.success !== 'undefined') {
				form.append('<div class="final-success"><i class="final-success-check formcraft-icon">check</i><span></span></div>');
				form.find('.final-success > span').html(response.success);
				form.addClass('submitted');
				form.find('.final-success').slideDown(800, function () {});
				form.find('.form-page').slideUp(800, function () {
					form.find('.form-element').remove();
				});
				if (form.parents('.fc-form-modal').length === 0 && form.parents('.fc-sticky').length === 0) {
					jQuery('html, body').animate({ scrollTop: form.offset().top - 100 }, 800);
				}
				jQuery(document).trigger('formcraft_submit_result', [form, response]);
				if (response.redirect) {
					var delay = parseInt(form.attr('data-delay'), 10);
					delay = isNaN(delay) ? 2 : delay;
					delay = Math.max(0, delay);
					setTimeout(function () {
						window.location.assign(response.redirect);
					}, delay * 1000);
				}
			}
			if (typeof callback !== 'undefined') {
				callback(response, form);
			}
		}).fail(function () {
			jQuery(element).find('.response').text('Connection error');
			if (typeof callback !== 'undefined') {
				callback(false);
			}
		}).always(function (response) {
			jQuery(document).trigger('formcraft_submit_success_trigger', [form, response]);
			form.find('.submit-cover').addClass('enabled');
			form.find('.submit-cover').removeClass('disabled');
			if (type === 'all') {
				form.find('.submit-button').removeAttr('disabled');
			}
		});
	};

	jQuery(document).ready(function () {

		if (_helpers2.default.isMobile() === true) {
			jQuery('.email-cover input[type="text"]').prop('type', 'email');
		}

		if (jQuery('#fc-form-preview').length === 1) {
			jQuery('body').addClass('formcraft-css');
		}

		jQuery('body').on('click', '.fc-trigger-close', function () {
			jQuery('.fc-sticky').each(function () {
				if (jQuery(this).hasClass('show')) {
					jQuery(this).parent().find('[data-toggle="fc-sticky"]').trigger('click');
				}
			});
		});

		jQuery('.form-element.default-true').hide();
		jQuery('.fc-form').removeClass('fc-temp-class');
		jQuery('.fc-form .form-element.default-true').addClass('state-hidden');
		jQuery('body').on('click', '.field-cover div [class^="icon-"]', function () {
			jQuery(this).parent().find('input').focus();
		});
		jQuery('[href]').each(function () {
			var href = jQuery(this).attr('href');
			if (href.indexOf('form-view/') !== -1) {
				var sub = href.split('form-view/');
				if (jQuery('.fc-form-modal .fc-form[data-id="' + sub[sub.length - 1] + '"]').length) {
					var form = jQuery('.fc-form-modal .fc-form[data-id="' + sub[sub.length - 1] + '"]').first();
					var uniq = form.parents('.fc-form-modal').attr('id');
					jQuery(this).removeAttr('href');
					jQuery(this).attr('data-toggle', 'fc_modal');
					jQuery(this).attr('data-target', '#' + uniq);
				}
			}
		});
		jQuery('.fc-form-modal .form-live').each(function () {
			if (jQuery(this).attr('data-bind') !== '') {
				var uniq = jQuery(this).attr('data-uniq');
				jQuery(jQuery(this).attr('data-bind')).each(function () {
					jQuery(this).attr('data-toggle', 'fc_modal');
					jQuery(this).attr('data-target', '#modal-' + uniq);
				});
			}
		});
		jQuery('.fc-form').each(function () {
			var form = jQuery(this);
			jQuery(document).trigger('formcraft_math_change', [form]);
		});

		jQuery('body').on('focus', '.password-cover input[type="password"], .address-cover input[type="text"] ,.oneLineText-cover input[type="text"],.datepicker-cover input[type="text"],.email-cover input[type="text"],.email-cover input[type="email"],.textarea-cover textarea,.dropdown-cover select,.matrix-cover input,.star-cover input,.thumb-cover input', function () {
			jQuery(this).parents('.field-cover').addClass('has-focus');
		});
		jQuery('body').on('blur', '.password-cover input[type="password"], .address-cover input[type="text"] ,.oneLineText-cover input[type="text"],.datepicker-cover input[type="text"],.email-cover input[type="text"],.email-cover input[type="email"],.textarea-cover textarea,.dropdown-cover select,.matrix-cover input,.star-cover input,.thumb-cover input', function () {
			jQuery(this).parents('.field-cover').removeClass('has-focus');
		});

		jQuery('body').on('change', '.dropdown-cover select', function () {
			if (jQuery(this).find('option:checked').length > 0 && jQuery(this).find('option:checked').text() !== '') {
				jQuery(this).parents('.field-cover').addClass('has-input');
			} else {
				jQuery(this).parents('.field-cover').removeClass('has-input');
			}
		});
		jQuery('body').on('input', '.address-cover input[type="text"], .oneLineText-cover input[type="text"],.password-cover input[type="password"],.datepicker-cover input[type="text"],.email-cover input[type="text"],.email-cover input[type="email"], .textarea-cover textarea', function () {
			if (jQuery(this).val().length > 0 || typeof jQuery(this).attr('placeholder') !== 'undefined' && jQuery(this).attr('placeholder').length > 0) {
				jQuery(this).parents('.field-cover').addClass('has-input');
			} else {
				jQuery(this).parents('.field-cover').removeClass('has-input');
			}
		});

		jQuery('.oneLineText-cover input[type="text"],.datepicker-cover input[type="text"], .email-cover input[type="text"], .email-cover input[type="email"], .textarea-cover textarea').trigger('input');
		jQuery('.customText-cover input[type="hidden"],.timepicker-cover input[type="hidden"],.slider-cover input[type="hidden"],.fileupload-cover input[type="hidden"],.checkbox-cover input[type="radio"],.star-cover input[type="radio"],.thumb-cover input[type="radio"],.checkbox-cover input[type="checkbox"],.dropdown-cover select').trigger('change');

		setTimeout(function () {
			jQuery('.time-fields-cover > select').first().trigger('change');
		}, 500);
		jQuery('.fc-pagination').each(function () {
			jQuery(this).find('.pagination-trigger').eq(0).addClass('active');
		});
		jQuery('.fc-form .form-page-0').addClass('active');
		jQuery('body').on('change', '.checkbox-cover label input,.update-label label input', function () {
			if (jQuery(this).is(':checked')) {
				var name = jQuery(this).attr('name');
				jQuery('[name="' + name + '"]').parent().removeClass('active');
				jQuery(this).parent().addClass('active');
			}
		});
		if (_helpers2.default.isiOS()) {
			jQuery('body').on('touchstart', '.star-cover label, .thumb-cover label', function () {
				event.preventDefault();
				jQuery(this).trigger('click');
			});
			jQuery('body').on('touchstart', '[data-toggle="fc_modal"]', function (event) {
				event.preventDefault();
				jQuery(this).trigger('click');
			});
			jQuery('body').on('touchstart', '[data-toggle="fc-sticky"]', function () {
				event.preventDefault();
				jQuery(this).trigger('click');
			});
		}
		jQuery('body').on('change', '.star-cover label input', function () {
			if (jQuery(this).is(':checked')) {
				var name = jQuery(this).attr('name');
				jQuery('[name="' + name + '"]').parent().removeClass('active');
				jQuery(this).parent().addClass('active');
				var index = jQuery(this).parent().index();
				jQuery(this).parent().parent().find('label').removeClass('fake-click');
				jQuery(this).parent().parent().find('label').slice(0, index + 1).addClass('fake-click');
			}
		});
		jQuery('.update-label label.active').removeClass('active');
		jQuery('.powered-by').each(function () {
			var width = jQuery(this).parent().find('.fc-form').outerWidth();
			jQuery(this).css('width', width + ' px');
		});
		setTimeout(function () {
			jQuery('.fc-form-modal').appendTo('body');
		}, 500);
		jQuery('.formcraft-css.placement-right').appendTo('body');
		jQuery('.formcraft-css.placement-left').appendTo('body');
		jQuery('.body-append').appendTo('body');
		setTimeout(function () {
			jQuery('.image_button_cover a').each(function () {
				var height = parseInt(jQuery(this).outerWidth(), 10) / 2 + jQuery(this).outerHeight();
				jQuery(this).css('top', '-' + height + 'px');
			});
		}, 100);
		setTimeout(function () {
			jQuery('.image_button_cover a').each(function () {
				jQuery(this).parents('.image_button_cover').addClass('now-show');
			});
		}, 400);
		jQuery('body').on('click', '[data-toggle="fc-sticky"]', function () {
			var element = jQuery(jQuery(this).attr('data-target'));
			var elementButton = jQuery(jQuery(this).attr('data-target')).parent().find('.fc-sticky-button');
			if (element.hasClass('show')) {
				element.addClass('hiding');
				elementButton.addClass('showing');
				setTimeout(function () {
					element.removeClass('show hiding');
					elementButton.removeClass('hide showing');
				}, 400);
			} else {
				var form = element.find('.fc-form').attr('data-id');
				jQuery.get(FC.ajaxurl + '?action=formcraft3_trigger_view&id=' + form);
				element.addClass('show');
				elementButton.addClass('hide');
			}
		});
		jQuery(document).keyup(function (e) {
			jQuery('.fc-sticky').each(function () {
				if (jQuery(this).hasClass('show') && e.which === 27) {
					jQuery(this).parent().find('[data-toggle="fc-sticky"]').trigger('click');
				}
			});
		});
		var bodyHeight = parseInt(jQuery(window).height(), 10) * 0.8;
		jQuery('.fc-sticky').css('max-height', bodyHeight + 'px');
		jQuery(document).mouseup(function (e) {
			var container1 = jQuery('.fc-sticky');
			var container2 = jQuery('.fc-datepicker');
			var container3 = jQuery('.fc-sticky-button');
			if (!container1.is(e.target) && container1.has(e.target).length === 0 && !container2.is(e.target) && container2.has(e.target).length === 0 && !container3.is(e.target)) {
				jQuery('.fc-sticky').each(function () {
					if (jQuery(this).hasClass('show')) {
						jQuery(this).parent().find('[data-toggle="fc-sticky"]').trigger('click');
					}
				});
			}
		});
		setTimeout(function () {
			jQuery('.fc-sticky').each(function () {
				if (jQuery(this).hasClass('fc-sticky-right') || jQuery(this).hasClass('fc-sticky-left')) {
					var height = jQuery(this).find('.fc-form').height();
					height = Math.min(bodyHeight, height);
					jQuery(this).css('margin-top', '-' + height / 2 + 'px');
					jQuery(this).find('.fc-form').addClass('calculated');
				}
			});
		}, 500);

		jQuery('.fc-form-modal').each(function () {
			if (jQuery(this).attr('data-auto') && !isNaN(parseFloat(jQuery(this).attr('data-auto')))) {
				var modal = jQuery(this);
				setTimeout(function () {
					modal.fc_modal('show');
				}, parseFloat(jQuery(this).attr('data-auto')) * 1000);
			}
			if (jQuery(this).find('.pagination-trigger').length > 1) {
				var height = jQuery(this).find('.fc_close').parents('.fc_modal-dialog').find('.fc-pagination-cover').height();
				var width = jQuery(this).find('.fc_close').parents('.fc_modal-dialog').find('.fc-form').width();
				jQuery(this).find('.fc_close').css({
					'margin-top': height,
					left: '50%',
					'margin-left': width / 2 - 30
				});
			}
		});
		jQuery('.fc-sticky').each(function () {
			if (jQuery(this).attr('data-auto') && !isNaN(parseFloat(jQuery(this).attr('data-auto')))) {
				var modal = jQuery(this);
				setTimeout(function () {
					if (!modal.hasClass('show')) {
						modal.parent().find('.fc-sticky-button').trigger('click');
					}
				}, parseFloat(jQuery(this).attr('data-auto')) * 1000);
			}
		});
		jQuery('.star-cover label').hover(function () {
			var index = jQuery(this).index();
			jQuery(this).parent().find('label').slice(0, index + 1 - jQuery(this).prevAll('.formcraft-icon').length).addClass('fake-hover');
			jQuery(this).parent().find('label').slice(index + 1 - jQuery(this).prevAll('.formcraft-icon').length, jQuery(this).parent().find('label').length).addClass('fake-empty');
		}, function () {
			jQuery(this).parent().find('label').removeClass('fake-hover fake-empty');
		});
		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			jQuery('.datepicker-cover input[type="text"]').attr('readonly', 'readonly');
		}
		setTimeout(function () {
			jQuery('body').on('blur change', '.fc-form .validation-lenient', function (e) {
				if (jQuery(this).fcValidate() === false) {
					jQuery(this).addClass('validation-strict').removeClass('validation-lenient');
				}
			});
		}, 1000);
		jQuery('body').on('keyup change input', '.fc-form .validation-strict', function () {
			if (jQuery(this).fcValidate() === false) {
				jQuery(this).addClass('validation-strict').removeClass('validation-lenient');
			} else {
				jQuery(this).addClass('validation-lenient').removeClass('validation-strict');
			}
		});
	});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	/*!
		Autosize 3.0.15
		license: MIT
		http://www.jacklmoore.com/autosize
	*/
	(function (global, factory) {
		if (true) {
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, module], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
			factory(exports, module);
		} else {
			var mod = {
				exports: {}
			};
			factory(mod.exports, mod);
			global.autosize = mod.exports;
		}
	})(undefined, function (exports, module) {
		'use strict';

		var set = typeof Set === 'function' ? new Set() : function () {
			var list = [];

			return {
				has: function has(key) {
					return Boolean(list.indexOf(key) > -1);
				},
				add: function add(key) {
					list.push(key);
				},
				'delete': function _delete(key) {
					list.splice(list.indexOf(key), 1);
				} };
		}();

		var createEvent = function createEvent(name) {
			return new Event(name);
		};
		try {
			new Event('test');
		} catch (e) {
			// IE does not support `new Event()`
			createEvent = function createEvent(name) {
				var evt = document.createEvent('Event');
				evt.initEvent(name, true, false);
				return evt;
			};
		}

		function assign(ta) {
			var _ref = arguments[1] === undefined ? {} : arguments[1];

			var _ref$setOverflowX = _ref.setOverflowX;
			var setOverflowX = _ref$setOverflowX === undefined ? true : _ref$setOverflowX;
			var _ref$setOverflowY = _ref.setOverflowY;
			var setOverflowY = _ref$setOverflowY === undefined ? true : _ref$setOverflowY;

			if (!ta || !ta.nodeName || ta.nodeName !== 'TEXTAREA' || set.has(ta)) return;

			var heightOffset = null;
			var overflowY = null;
			var clientWidth = ta.clientWidth;

			function init() {
				var style = window.getComputedStyle(ta, null);

				overflowY = style.overflowY;

				if (style.resize === 'vertical') {
					ta.style.resize = 'none';
				} else if (style.resize === 'both') {
					ta.style.resize = 'horizontal';
				}

				if (style.boxSizing === 'content-box') {
					heightOffset = -(parseFloat(style.paddingTop) + parseFloat(style.paddingBottom));
				} else {
					heightOffset = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
				}
				// Fix when a textarea is not on document body and heightOffset is Not a Number
				if (isNaN(heightOffset)) {
					heightOffset = 0;
				}

				update();
			}

			function changeOverflow(value) {
				{
					// Chrome/Safari-specific fix:
					// When the textarea y-overflow is hidden, Chrome/Safari do not reflow the text to account for the space
					// made available by removing the scrollbar. The following forces the necessary text reflow.
					var width = ta.style.width;
					ta.style.width = '0px';
					// Force reflow:
					/* jshint ignore:start */
					ta.offsetWidth;
					/* jshint ignore:end */
					ta.style.width = width;
				}

				overflowY = value;

				if (setOverflowY) {
					ta.style.overflowY = value;
				}

				resize();
			}

			function resize() {
				var htmlTop = window.pageYOffset;
				var bodyTop = document.body.scrollTop;
				var originalHeight = ta.style.height;

				ta.style.height = 'auto';

				var endHeight = ta.scrollHeight + heightOffset;

				if (ta.scrollHeight === 0) {
					// If the scrollHeight is 0, then the element probably has display:none or is detached from the DOM.
					ta.style.height = originalHeight;
					return;
				}

				ta.style.height = endHeight + 'px';

				// used to check if an update is actually necessary on window.resize
				clientWidth = ta.clientWidth;

				// prevents scroll-position jumping
				document.documentElement.scrollTop = htmlTop;
				document.body.scrollTop = bodyTop;
			}

			function update() {
				var startHeight = ta.style.height;

				resize();

				var style = window.getComputedStyle(ta, null);

				if (style.height !== ta.style.height) {
					if (overflowY !== 'visible') {
						changeOverflow('visible');
					}
				} else {
					if (overflowY !== 'hidden') {
						changeOverflow('hidden');
					}
				}

				if (startHeight !== ta.style.height) {
					var evt = createEvent('autosize:resized');
					ta.dispatchEvent(evt);
				}
			}

			var pageResize = function pageResize() {
				if (ta.clientWidth !== clientWidth) {
					update();
				}
			};

			var destroy = function (style) {
				window.removeEventListener('resize', pageResize, false);
				ta.removeEventListener('input', update, false);
				ta.removeEventListener('keyup', update, false);
				ta.removeEventListener('autosize:destroy', destroy, false);
				ta.removeEventListener('autosize:update', update, false);
				set['delete'](ta);

				Object.keys(style).forEach(function (key) {
					ta.style[key] = style[key];
				});
			}.bind(ta, {
				height: ta.style.height,
				resize: ta.style.resize,
				overflowY: ta.style.overflowY,
				overflowX: ta.style.overflowX,
				wordWrap: ta.style.wordWrap });

			ta.addEventListener('autosize:destroy', destroy, false);

			// IE9 does not fire onpropertychange or oninput for deletions,
			// so binding to onkeyup to catch most of those events.
			// There is no way that I know of to detect something like 'cut' in IE9.
			if ('onpropertychange' in ta && 'oninput' in ta) {
				ta.addEventListener('keyup', update, false);
			}

			window.addEventListener('resize', pageResize, false);
			ta.addEventListener('input', update, false);
			ta.addEventListener('autosize:update', update, false);
			set.add(ta);

			if (setOverflowX) {
				ta.style.overflowX = 'hidden';
				ta.style.wordWrap = 'break-word';
			}

			init();
		}

		function destroy(ta) {
			if (!(ta && ta.nodeName && ta.nodeName === 'TEXTAREA')) return;
			var evt = createEvent('autosize:destroy');
			ta.dispatchEvent(evt);
		}

		function update(ta) {
			if (!(ta && ta.nodeName && ta.nodeName === 'TEXTAREA')) return;
			var evt = createEvent('autosize:update');
			ta.dispatchEvent(evt);
		}

		var autosize = null;

		// Do nothing in Node.js environment and IE8 (or lower)
		if (typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') {
			autosize = function autosize(el) {
				return el;
			};
			autosize.destroy = function (el) {
				return el;
			};
			autosize.update = function (el) {
				return el;
			};
		} else {
			autosize = function autosize(el, options) {
				if (el) {
					Array.prototype.forEach.call(el.length ? el : [el], function (x) {
						return assign(x, options);
					});
				}
				return el;
			};
			autosize.destroy = function (el) {
				if (el) {
					Array.prototype.forEach.call(el.length ? el : [el], destroy);
				}
				return el;
			};
			autosize.update = function (el) {
				if (el) {
					Array.prototype.forEach.call(el.length ? el : [el], update);
				}
				return el;
			};
		}

		module.exports = autosize;
	});

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	* jQuery function for validation fields
	*/
	var formcraftValidation = function ($) {
	  $.fn.fcValidate = function () {
	    var alphabets = void 0,
	        alphanumeric = void 0,
	        email = void 0,
	        numbers = void 0,
	        url = void 0;
	    if (jQuery(this).attr('data-allow-spaces') && jQuery(this).attr('data-allow-spaces') === 'true') {
	      alphabets = /^[A-Za-z ]+$/;
	      numbers = /^[0-9 ]+$/;
	      alphanumeric = /^[0-9A-Za-z ]+$/;
	      url = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
	      email = /^([a-zA-Z0-9_\+.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,6})+$/;
	    } else {
	      alphabets = /^[A-Za-z]+$/;
	      numbers = /^[0-9]+$/;
	      alphanumeric = /^[0-9A-Za-z]+$/;
	      url = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
	      email = /^([a-zA-Z0-9_\+.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,6})+$/;
	    }
	    var form_id = jQuery(this).parents('form').attr('data-id');
	    var validation = window['FC_Validation_' + form_id];
	    var value = jQuery(this).val();
	    if (jQuery(this).is('[type="checkbox"]') || jQuery(this).is('[type="radio"]')) {
	      var name = jQuery(this).attr('name');
	      value = jQuery('[name="' + name + '"]:checked').val();
	      value = typeof value === 'undefined' ? '' : value;
	    }
	    value = value || '';
	    var thisElement = jQuery(this);
	    if (thisElement.attr('data-is-required') && thisElement.attr('data-is-required') === 'true' && value.trim() === '') {
	      thisElement.parents('.form-element').find('.error').text(validation.is_required);
	      thisElement.parents('.form-element').addClass('error-field');
	      return false;
	    }
	    if (jQuery(this).attr('data-input-mask') && jQuery(this).attr('data-input-mask') !== '' && jQuery(this).hasClass('mask-invalid') && value !== '') {
	      thisElement.parents('.form-element').find('.error').text(validation.is_invalid);
	      thisElement.parents('.form-element').addClass('error-field');
	      return false;
	    }
	    if (jQuery(this).attr('data-is-required') && jQuery(this).attr('data-is-required') === 'false' && value.trim() === '') {
	      thisElement.parents('.form-element').find('.error').text('');
	      thisElement.parents('.form-element').removeClass('error-field');
	      return true;
	    }
	    if (jQuery(this).attr('data-min-char') && jQuery(this).attr('data-min-char') > value.length) {
	      thisElement.parents('.form-element').find('.error').text(validation.min_char.replace('[x]', jQuery(this).attr('data-min-char')));
	      thisElement.parents('.form-element').addClass('error-field');
	      return false;
	    }
	    if (jQuery(this).attr('data-max-char') && jQuery(this).attr('data-max-char') < value.length) {
	      thisElement.parents('.form-element').find('.error').text(validation.max_char.replace('[x]', jQuery(this).attr('data-max-char')));
	      thisElement.parents('.form-element').addClass('error-field');
	      return false;
	    }
	    if (jQuery(this).attr('data-val-type') && jQuery(this).attr('data-val-type') === 'email' && !value.match(email)) {
	      thisElement.parents('.form-element').find('.error').text(validation.allow_email);
	      thisElement.parents('.form-element').addClass('error-field');
	      return false;
	    }
	    if (jQuery(this).attr('data-val-type') && jQuery(this).attr('data-val-type') === 'alphabets' && !value.match(alphabets)) {
	      thisElement.parents('.form-element').find('.error').text(validation.allow_alphabets);
	      thisElement.parents('.form-element').addClass('error-field');
	      return false;
	    }
	    if (jQuery(this).attr('data-val-type') && jQuery(this).attr('data-val-type') === 'numbers' && !value.match(numbers)) {
	      thisElement.parents('.form-element').find('.error').text(validation.allow_numbers);
	      thisElement.parents('.form-element').addClass('error-field');
	      return false;
	    }
	    if (jQuery(this).attr('data-val-type') && jQuery(this).attr('data-val-type') === 'alphanumeric' && !value.match(alphanumeric)) {
	      thisElement.parents('.form-element').find('.error').text(validation.allow_alphanumeric);
	      thisElement.parents('.form-element').addClass('error-field');
	      return false;
	    }
	    if (jQuery(this).attr('data-val-type') && jQuery(this).attr('data-val-type') === 'url' && !value.match(url)) {
	      thisElement.parents('.form-element').find('.error').text(validation.allow_url);
	      thisElement.parents('.form-element').addClass('error-field');
	      return false;
	    }
	    if (jQuery(this).attr('data-val-type') && jQuery(this).attr('data-val-type') === 'regexp') {
	      var flags = jQuery(this).attr('data-regexp').replace(/.*\/([gimy]*)$/, '$1');
	      var pattern = jQuery(this).attr('data-regexp').replace(new RegExp('^/(.*?)/' + flags + '$'), '$1');
	      var regex = new RegExp(pattern);
	      if (regex.exec(value) === null) {
	        thisElement.parents('.form-element').find('.error').text(validation.allow_regexp);
	        thisElement.parents('.form-element').addClass('error-field');
	        return false;
	      }
	    }
	    thisElement.parents('.form-element').removeClass('error-field');
	    return true;
	  };
	}(jQuery);

	exports.default = formcraftValidation;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var helpers = {
	  /**
	  * Check if user agent shows we are on a mobile phone
	  */
	  isMobile: function isMobile() {
	    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
	      return true;
	    }
	    return false;
	  },

	  /**
	  * Check if user agent shows we are on iOS
	  */
	  isiOS: function isiOS() {
	    return navigator.userAgent.match(/iPad|iPhone|iPod/g) ? true : false;
	  },

	  /**
	  * Spin to a numeric value, instead of merely setting it
	  */
	  spinTo: function spinTo(selector, _spinTo, thousand, decimal) {
	    var spinFrom = jQuery(selector).text() === '' ? 0 : parseFloat(jQuery(selector).text().replace(/[^0-9.]+/g, ''));
	    _spinTo = isNaN(parseFloat(_spinTo)) ? 0 : parseFloat(_spinTo);
	    spinFrom = isNaN(parseFloat(spinFrom)) ? 0 : parseFloat(spinFrom);
	    thousand = typeof thousand === 'undefined' ? '' : thousand;
	    decimal = typeof decimal === 'undefined' ? '.' : decimal;
	    var form = jQuery(selector).parents('form');
	    jQuery({ someValue: spinFrom }).animate({ someValue: parseFloat(_spinTo) }, {
	      duration: 600,
	      easing: 'swing',
	      context: _spinTo,
	      step: function step() {
	        var val = void 0;
	        if (parseInt(_spinTo, 10) !== parseFloat(_spinTo, 10)) {
	          val = (Math.ceil(this.someValue * 100) / 100).toString().replace(/[.]/g, decimal).replace(/\B(?=(\d{3})+(?!\d))/g, thousand);
	        } else {
	          val = Math.ceil(this.someValue).toString().replace(/[.]/g, decimal).replace(/\B(?=(\d{3})+(?!\d))/g, thousand);
	        }
	        jQuery(selector).text(val);
	      },
	      complete: function complete() {
	        jQuery(document).trigger('formcraft_math_change', [form]);
	      }
	    });
	    setTimeout(function () {
	      jQuery(selector).text(parseFloat(_spinTo).toString().replace(/[.]/g, decimal).replace(/\B(?=(\d{3})+(?!\d))/g, thousand));
	    }, 650);
	  },
	  isElementInViewport: function isElementInViewport(el) {
	    if (typeof jQuery === 'function' && el instanceof jQuery) {
	      el = el[0];
	    }
	    var rect = el.getBoundingClientRect();
	    return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
	  }
	};

	exports.default = helpers;

/***/ })
/******/ ]);