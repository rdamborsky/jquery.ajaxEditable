<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8"/>
	<title>jQuery AJAX editable plugin DEMO</title>
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>
	<script src="js/jquery.ajaxeditable.js"></script>
	<script src="js/jquery.ajaxeditable.validators.js"></script>
	<style type="text/css">
		.editOk {background:url('images/ajax-ok.png') center right no-repeat;}
		.editError {background:url('images/ajax-error.png') center right no-repeat;}
		.editable-saving {background:url('images/spinner.gif') center right no-repeat;}
		.editable-invalid {background:#c00;color:#fff;}
		.level-editable input {width:40px;display:block;}
		.amount-editable input {width:60px;display:block;}
		.rank-editable select {width:80px;display:block;}
		.not-updated {background:#000;color:#fff;}
		#log {width:30em;height:10em;overflow:auto;margin-top:1em;}
	</style>
</head>
<body>
	<h1>jQuery AJAX editable demo</h1>
	<p>Change values in input fields. Level can be 1-9, Amount has to be 0 or greater. You can use up/down arrows or TAB to navigate. Enter to confirm, ESC for cancel current change.</p>
	<p>When update is successful on server side (random results for demo), you see message added in log.</p>
	<table>
		<tbody>
			<tr>
				<th>Name</th>
				<th>Level</th>
				<th>Amount</th>
				<th>Rank</th>
			</tr>
			<tr data-id="100">
				<td>Foo sr.</td>
				<td><div class="level-editable">3</div></td>
				<td><div class="amount-editable">40</div></td>
				<td><div class="rank-editable">noob</div></td>
			</tr>
			<tr data-id="101">
				<td>Kate</td>
				<td><div class="level-editable">6</div></td>
				<td><div class="amount-editable">23</div></td>
				<td><div class="rank-editable">pro</div></td>
			</tr>
			<tr data-id="102">
				<td>Mike</td>
				<td><div class="level-editable">1</div></td>
				<td><div class="amount-editable">85</div></td>
				<td><div class="rank-editable">noob</div></td>
			</tr>
			<tr data-id="103">
				<td>Foo jr.</td>
				<td><div class="level-editable">4</div></td>
				<td><div class="amount-editable">107</div></td>
				<td><div class="rank-editable">good</div></td>
			</tr>
			<tr data-id="104">
				<td>Bar</td>
				<td><div class="level-editable">9</div></td>
				<td><div class="amount-editable">61</div></td>
				<td><div class="rank-editable">awhsom</div></td>
			</tr>
		</tbody>
	</table>
	<p>Log:</p>
	<div id="log"></div>

	<script type="text/javascript">
		$(function() {

			// helpers for demo
			$log = $('#log');
			var log = function(msg) {
				$log.append($('<div>' + msg + '</div>'));
			};

			// function for getting all necessary parameters for ajax call handler
			var editDataPrepare = function(property, $element, value) {
				$element.animate({ width: '-=20' }, 200);
				return {
					source: property,
					id: $element.closest('tr').attr('data-id'),
					data: value
				};
			};

			// when ajax response is returned, do something useful...
			var editCallback = function($element, reply) {
				var success = (reply.status === 'ok'),
					$parent = $element.parent(),
					className = success ? 'editOk' : 'editError';
				$parent.addClass(className);
				$element.animate({ width: '+=20' }, { duration: 700, complete: function() { $parent.removeClass(className); } });
				if (success) {
					log('Property ' + reply.input.source + ' updated to ' + reply.input.data + ' for id=' + reply.input.id);
				}
			};

			$('.level-editable').ajaxEditable({
				validator: ajaxEditableValidators.prepare('number', { minValue: 1, maxValue: 9 }),
				classNameEditableSet: 'level-editable',
				ajaxPrepare: function($element, value) {
					return editDataPrepare('level', $element, value);
				},
				ajaxCallback: editCallback
			});

			$('.amount-editable').ajaxEditable({
				validator: ajaxEditableValidators.prepare('number', { minValue: 0 }),
				classNameEditableSet: 'amount-editable',
				ajaxPrepare: function($element, value) {
					return editDataPrepare('amount', $element, value);
				},
				ajaxCallback: editCallback
			});

			$('.rank-editable').ajaxEditable({
				inputType: 'select',
				inputData: {
					noob: 'Noobie',
					good: 'Good',
					pro: 'Pro ^_^',
					awhsom: 'Awhsom!'
				},
				arrowKeysNavigation: false,
				classNameEditableSet: 'rank-editable',
				ajaxPrepare: function($element, value) {
					$element.removeClass('editable-invalid');
					return editDataPrepare('rank', $element, value);
				},
				ajaxCallback: function($element, reply) {
					var success = (reply.status === 'ok'),
						$parent = $element.parent(),
						className = success ? 'editOk' : 'editError';
					$parent.addClass(className);
					$element.animate({ width: 80 }, { duration: 700, complete: function() { $parent.removeClass(className); } });
					if (success) {
						log('Property ' + reply.input.source + ' updated to ' + reply.input.data + ' for id=' + reply.input.id);
					} else {
						$element.addClass('editable-invalid');
					}
				}
			});

		});
	</script>
</body>
</html>