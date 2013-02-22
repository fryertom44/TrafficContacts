var args = arguments[0] || {};
debugger;
if (args.data) {
	$.rowView.title = args.data.get('name') || '';
	$.rowView.id = args.data.get('id')|| '';
	// $.rowView.description = args.data.description || '';
};