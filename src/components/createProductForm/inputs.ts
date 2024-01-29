export const productInputs = [
	{
		id: "1",
		name: "product-name",
		type: "text",
		label: "Product Name",
		validation: { required: { value: true, message: "Product Name is required" } },
	},
	{
		id: "2",
		name: "price",
		type: "number",
		label: "Price",
		validation: { required: { value: true, message: "Price is required" } },
	},
];
