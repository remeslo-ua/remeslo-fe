export const productInputs = [
	{
		id: "1",
		name: "name",
		type: "text",
		label: "Product Name",
		validation: { required: { value: true, message: "Product Name is required" } },
    fieldType: "input",
	},
	{
		id: "2",
		name: "description",
		type: "text",
		label: "Description",
		validation: { required: { value: true, message: "Description is required" } },
    fieldType: "textarea",
	},
	{
		id: "3",
		name: "price",
		type: "number",
		label: "Price",
		validation: { required: { value: true, message: "Price is required" } },
    fieldType: "input",
	},
];
