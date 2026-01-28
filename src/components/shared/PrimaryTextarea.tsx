import { Textarea } from "@nextui-org/react";

interface Props {
  name: string;
  register: any;
  label: string;
  autocomplete?: string;
  validation: any;
  errors: any;
}

export const PrimaryTextarea: React.FC<Props> = ({
  name,
  register,
  label,
  autocomplete,
  validation,
  errors,
}) => {
  return (
  <div className='mb-5'>
      <Textarea
        {...register(name, validation)}
        label={label}
        width='100%'
        autoComplete={autocomplete}
        errorMessage={errors[name] && errors[name]?.message}
        classNames={{
          inputWrapper: [
          "border-2 border-black-200 dark:border-gray-600 h-[62px] bg-[#FFFFFF] dark:bg-gray-800 text-start dark:text-white",
            `${errors[name] && "border-danger-D300 bg-[#F7E8E8] dark:bg-red-900 dark:border-red-600"}`,
          ],
          label: [
            "group-data-[focus=true]:text-primary dark:group-data-[focus=true]:text-blue-400",
            "group-data-[filled=true]:text-primary dark:group-data-[filled=true]:text-blue-400",
            "text-start dark:text-gray-300",
            `${errors[name] && "group-data-[filled=true]:text-danger-D300 dark:group-data-[filled=true]:text-red-400"}`,
            `${errors[name] && "group-data-[focus=true]:text-danger-D300 dark:group-data-[focus=true]:text-red-400"}`,
          ],
          input: "dark:text-white dark:placeholder-gray-500",
          errorMessage: "text-danger-D300 dark:text-red-400",
          helperWrapper: "pl-2 dark:text-gray-400",
          description: "text-[#474949] dark:text-gray-400",
        }}
      />
    </div>
  );
};
