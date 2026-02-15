'use client';

import { Select, SelectItem } from '@nextui-org/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBox,
  faUsers,
  faWrench,
  faFileContract,
  faShieldHalved,
  faBolt,
  faCar,
  faScrewdriverWrench,
  faBullhorn,
  faPen,
  faBriefcase,
  faFileInvoiceDollar,
  faMoneyBillWave,
  faFileSignature,
  faBoxesStacked,
  faHandHoldingDollar,
  faCommentsDollar,
  faShoppingCart,
  faUtensils,
  faHome,
  faFilm,
  faHeartPulse,
  faGraduationCap,
  faPlane,
  faGift,
  faPiggyBank,
  faChartLine,
  faCreditCard,
  faLandmark,
  faCircleDollarToSlot,
} from '@fortawesome/free-solid-svg-icons';

const iconOptions = [
  { value: 'box', label: 'Box', icon: faBox },
  { value: 'users', label: 'Users', icon: faUsers },
  { value: 'wrench', label: 'Wrench', icon: faWrench },
  { value: 'file-contract', label: 'Contract', icon: faFileContract },
  { value: 'shield-halved', label: 'Shield', icon: faShieldHalved },
  { value: 'bolt', label: 'Bolt', icon: faBolt },
  { value: 'car', label: 'Car', icon: faCar },
  { value: 'screwdriver-wrench', label: 'Tools', icon: faScrewdriverWrench },
  { value: 'bullhorn', label: 'Bullhorn', icon: faBullhorn },
  { value: 'pen', label: 'Pen', icon: faPen },
  { value: 'briefcase', label: 'Briefcase', icon: faBriefcase },
  { value: 'file-invoice-dollar', label: 'Invoice', icon: faFileInvoiceDollar },
  { value: 'money-bill-wave', label: 'Money', icon: faMoneyBillWave },
  { value: 'file-signature', label: 'Signature', icon: faFileSignature },
  { value: 'boxes-stacked', label: 'Boxes', icon: faBoxesStacked },
  { value: 'hand-holding-dollar', label: 'Payment', icon: faHandHoldingDollar },
  { value: 'comments-dollar', label: 'Comments', icon: faCommentsDollar },
  { value: 'shopping-cart', label: 'Shopping', icon: faShoppingCart },
  { value: 'utensils', label: 'Food', icon: faUtensils },
  { value: 'home', label: 'Home', icon: faHome },
  { value: 'film', label: 'Entertainment', icon: faFilm },
  { value: 'heart-pulse', label: 'Health', icon: faHeartPulse },
  { value: 'graduation-cap', label: 'Education', icon: faGraduationCap },
  { value: 'plane', label: 'Travel', icon: faPlane },
  { value: 'gift', label: 'Gift', icon: faGift },
  { value: 'piggy-bank', label: 'Savings', icon: faPiggyBank },
  { value: 'chart-line', label: 'Investment', icon: faChartLine },
  { value: 'credit-card', label: 'Credit Card', icon: faCreditCard },
  { value: 'landmark', label: 'Bank', icon: faLandmark },
  { value: 'circle-dollar-to-slot', label: 'Deposit', icon: faCircleDollarToSlot },
];

interface Props {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
}

export const IconPicker: React.FC<Props> = ({ value, onChange, label = 'Icon', error }) => {
  return (
    <div className="mb-5 w-full">
      <Select
        label={label}
        selectedKeys={value ? [value] : []}
        onChange={(e) => onChange(e.target.value)}
        variant="bordered"
        fullWidth
        classNames={{
          trigger: [
            'border-2 border-black-200 h-[62px] bg-[#FFFFFF]',
            error && 'border-danger-D300 bg-[#F7E8E8]',
          ],
          listboxWrapper: 'min-h-[300px] max-h-96',
        }}
        renderValue={(items) => {
          return items.map((item) => {
            const option = iconOptions.find((opt) => opt.value === item.key);
            return (
              <div key={item.key} className="flex items-center gap-2">
                {option && <FontAwesomeIcon icon={option.icon} className="w-4 h-4" />}
                <span>{option?.label}</span>
              </div>
            );
          });
        }}
      >
        {iconOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={option.icon} className="w-4 h-4" />
              <span>{option.label}</span>
            </div>
          </SelectItem>
        ))}
      </Select>
      {error && (
        <div className="prose-labelSmall text-danger-D300 pl-2 mt-1">{error}</div>
      )}
    </div>
  );
};
