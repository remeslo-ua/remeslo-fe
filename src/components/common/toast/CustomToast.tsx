import toast from "react-hot-toast";

export const CustomToast = ({t}: any) => {
  return (
    <span>
          Custom and <b>bold</b>
          <button onClick={() => toast.dismiss(t.id)}>
            Dismiss
          </button>
        </span>
  )
};