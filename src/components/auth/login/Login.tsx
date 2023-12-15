import { Button, Input } from "@nextui-org/react";

export const Login = () => {
  return (
    <div className="flex justify-end">
      <div className="w-[50vw] flex flex-col gap-3 p-5">
        <Input label='email'/>
        <Input label='password'/>
        <Button>Submit</Button>
      </div>
    </div>
  );
};