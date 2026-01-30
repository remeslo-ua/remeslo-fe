interface Props {
  name: string;
  register: any;
  label: string;
  type?: string;
  autocomplete?: string;
  validation?: any;
  errors: any;
}

export const PrimaryInput: React.FC<Props> = ({
  name,
  register,
  label,
  type = "text",
  validation,
  errors,
}) => {
  return (
    <div className="mb-5">
      <label
        htmlFor={name}
        className={`block text-sm font-medium mb-2 ${
          errors[name]
            ? "text-red-600 dark:text-red-400"
            : "text-gray-700 dark:text-gray-300"
        }`}
      >
        {label}
      </label>
      <input
        {...register(name, validation || {})}
        id={name}
        type={type}
        className={`w-full px-4 py-3 rounded-lg border-2 transition-colors
          ${
            errors[name]
              ? "border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-600 focus:border-red-600 dark:focus:border-red-500"
              : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-blue-500 dark:focus:border-blue-400"
          }
          text-gray-900 dark:text-white
          placeholder:text-gray-400 dark:placeholder:text-gray-500
          focus:outline-none focus:ring-2 ${
            errors[name]
              ? "focus:ring-red-200 dark:focus:ring-red-900"
              : "focus:ring-blue-200 dark:focus:ring-blue-900"
          }`}
      />
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {errors[name]?.message}
        </p>
      )}
    </div>
  );
};
