'use client';

import { useEffect, useState } from 'react';
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
  faQuestion,
} from '@fortawesome/free-solid-svg-icons';

const iconMap: { [key: string]: any } = {
  'box': faBox,
  'users': faUsers,
  'wrench': faWrench,
  'file-contract': faFileContract,
  'shield-halved': faShieldHalved,
  'bolt': faBolt,
  'car': faCar,
  'screwdriver-wrench': faScrewdriverWrench,
  'bullhorn': faBullhorn,
  'pen': faPen,
  'briefcase': faBriefcase,
  'file-invoice-dollar': faFileInvoiceDollar,
  'money-bill-wave': faMoneyBillWave,
  'file-signature': faFileSignature,
  'boxes-stacked': faBoxesStacked,
  'hand-holding-dollar': faHandHoldingDollar,
  'comments-dollar': faCommentsDollar,
  'shopping-cart': faShoppingCart,
  'utensils': faUtensils,
  'home': faHome,
  'film': faFilm,
  'heart-pulse': faHeartPulse,
  'graduation-cap': faGraduationCap,
  'plane': faPlane,
  'gift': faGift,
  'piggy-bank': faPiggyBank,
  'chart-line': faChartLine,
  'credit-card': faCreditCard,
  'landmark': faLandmark,
  'circle-dollar-to-slot': faCircleDollarToSlot,
};

interface Category {
  _id: string;
  name: string;
  type: string;
  color: string;
  icon?: string;
  iconType?: string;
  usageCount?: number;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  type: 'expense' | 'income';
  label?: string;
  error?: string;
}

export const CategorySelect: React.FC<Props> = ({ 
  value, 
  onChange, 
  type, 
  label = 'Category',
  error 
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, [type]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/budgeting/categories/most-used?type=${type}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (icon?: string) => {
    if (!icon) return faQuestion;
    return iconMap[icon] || faQuestion;
  };

  return (
    <div className="mb-5">
      <Select
        label={label}
        selectedKeys={value ? [value] : []}
        onChange={(e) => onChange(e.target.value)}
        variant="bordered"
        isLoading={loading}
        size="lg"
        classNames={{
          trigger: [
            'border-2 border-black-200 dark:border-gray-600 h-14 md:h-16 bg-[#FFFFFF] dark:bg-gray-800 dark:text-white text-base md:text-lg',
            error && 'border-danger-D300 dark:border-red-600 bg-[#F7E8E8] dark:bg-red-900',
          ],
          label: [
            'text-base md:text-lg dark:text-gray-300',
            'group-data-[focus=true]:text-primary dark:group-data-[focus=true]:text-blue-400',
            'group-data-[filled=true]:text-primary dark:group-data-[filled=true]:text-blue-400',
          ],
          listboxWrapper: 'max-h-96',
          popoverContent: 'dark:bg-gray-800',
        }}
        listboxProps={{
          classNames: {
            base: 'dark:bg-gray-800',
            list: 'dark:bg-gray-800',
          },
        }}
        renderValue={(items) => {
          return items.map((item) => {
            const category = categories.find((cat) => cat._id === item.key);
            return (
              <div key={item.key} className="flex items-center gap-3">
                {category?.icon && (
                  <FontAwesomeIcon 
                    icon={getIcon(category.icon)} 
                    className="w-5 h-5" 
                    style={{ color: category.color }}
                  />
                )}
                <span className="text-base">{category?.name}</span>
              </div>
            );
          });
        }}
      >
        {categories.map((category) => (
          <SelectItem key={category._id} value={category._id}>
            <div className="flex items-center gap-3 py-2">
              {category.icon && (
                <FontAwesomeIcon 
                  icon={getIcon(category.icon)} 
                  className="w-5 h-5" 
                  style={{ color: category.color }}
                />
              )}
              <span className="text-base">{category.name}</span>
              {category.usageCount && category.usageCount > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">({category.usageCount})</span>
              )}
            </div>
          </SelectItem>
        ))}
      </Select>
      {error && (
        <div className="prose-labelSmall text-danger-D300 dark:text-red-400 pl-2 mt-1">{error}</div>
      )}
    </div>
  );
};
