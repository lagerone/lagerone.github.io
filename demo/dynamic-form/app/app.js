(function (window, $, ko, _) {

	'use strict';

	var jsonDataFromServer = [
		{
			name: 'FirstName',
			type: 'text',
			required: true,
			value: ''
		}
		,
		{
			name: 'LastName',
			type: 'text',
			required: true,
			value: ''
		},
		{
			name: 'Age',
			type: 'int',
			required: false,
			value: 0
		},
		{
			name: 'Message',
			type: 'textarea',
			required: false,
			value: 'This is a default/stored value'
		},
		{
			name: 'Selections',
			type: 'enum',
			required: false,
			value: '',
			enumItems: [
				{
					name: 'Option 1'
				},
				{
					name: 'Option 2'
				},
				{
					name: 'Option 3'
				}
			]
		}
	];

	var ItemModel = function (data) {
		this.name = data.name;
		this.type = ko.observable(data.type);
		this.required = data.required;
		this.value = data.value;
		this.enumItems = data.enumItems || [];
	};
	
	var ViewModel = function (data) {
		this.initData = data;
		this.items = ko.observableArray([]);
		this.types = ko.observableArray(['text', 'int', 'textarea', 'enum'])
		this.init(data);
	};

	ViewModel.prototype = {
		init: function (data) {
			var items, 
				defaultValue;
			items = _.map(data, function (i) {
				return new ItemModel(i);
			});
			this.items(items);
		},
		getTemplateName: function (item) {
			return item.type() + '-template';
		},
		getPlaceHolderValue: function (item) {
			return 'Enter ' + item.name;
		}
	};

	ko.applyBindings(new ViewModel(jsonDataFromServer), document.getElementById('app'));

}(window, jQuery, ko, _));