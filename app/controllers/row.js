var args = arguments[0] || {};

if (args.data) {
	$.rowView.id = args.data.get('id')|| '';
	$.rowView.title = args.title || '';
	$.rowView.description = args.description || '';
};