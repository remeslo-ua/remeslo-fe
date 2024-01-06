import { Button } from '@nextui-org/react';
import { Spinner } from '@nextui-org/react';

interface Props {
  text: string;
  isLoading?: boolean;
  styles?: string;
  isDisabled?: boolean;
  errorMessage?: string;
  icon?: React.JSX.Element;
  color?: string;
  btnContainerStyles?: string;
  type?: 'button' | 'submit';
  onClick?: () => void;
}

export const PrimaryButton: React.FC<Props> = ({
  text,
  isLoading = false,
  styles,
  isDisabled = false,
  errorMessage,
  color = 'orange-500',
  icon,
  btnContainerStyles,
  type = 'submit',
  onClick,
}) => (
  <div className={btnContainerStyles}>
    <Button
      className={`bg-${color} text-white font-bold ${styles} ${
        isDisabled && 'bg-[#B8B9B8] text-[#656766]'
      }`}
      type={type}
      isDisabled={isDisabled}
      onClick={() => {
        if (type === 'button' && onClick) {
          onClick();
        }
      }}
    >
      {isLoading ? (
        <Spinner color={text === 'REGISTRATI' ? 'default' : 'white'} />
      ) : (
        <>
          <span className="text-lg">{text}</span>
          {icon}
        </>
      )}
    </Button>

    {errorMessage && (
      <div className="prose-labelSmall text-danger-D300 absolute">
        {errorMessage}
      </div>
    )}
  </div>
);
