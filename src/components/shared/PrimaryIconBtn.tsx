interface Props {
  icon: React.ReactNode;
};

export const PrimaryIconBtn: React.FC<Props> = ({ icon }) => {
  return (
    <button className="flex items-center gap-3 justify-center w-full h-12 bg-[#F5F5F5] rounded-md text-[#4D4D4D] hover:bg-[#E0E0E0] hover:text-[#4D4D4D]">
      {icon}
    </button>
  );
};
