"use client";
import { useState } from "react";
import Link from "next/link";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { TransactionsList } from "../../../components/budgeting/TransactionsList";
import { Dashboard } from "../../../components/budgeting/Dashboard";
import { BudgetSettings } from "../../../components/budgeting/BudgetSettings";
import AuthGuard from "../../../components/AuthGuard";
import { ROUTES } from "@/constants/routes";

interface Category {
  _id: string;
  name: string;
  type: 'expense' | 'income';
  color: string;
  isDefault: boolean;
}

export default function BudgetingPage() {
  const [showSettings, setShowSettings] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSettingsUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header with Settings Button */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl md:text-4xl font-bold">Budgeting</h1>
            <button
              onClick={() => setShowSettings(true)}
              className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Settings"
            >
              <FontAwesomeIcon icon={faGear} className="w-5 h-5 text-black dark:text-white" />
            </button>
          </div>
          <div className="flex justify-center gap-4 md:gap-6 mb-8">
            <Link href={ROUTES.BUDGETING.ADD_EXPENSE}>
              <button className="w-[38px] h-[38px] md:w-40 md:h-40 rounded-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-bold flex flex-col items-center justify-center text-center transition-colors shadow-lg gap-2">
                <FontAwesomeIcon icon={faMinus} className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            </Link>
            <Link href={ROUTES.BUDGETING.ADD_INCOME}>
              <button className="w-[38px] h-[38px] md:w-40 md:h-40 rounded-full bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold flex flex-col items-center justify-center text-center transition-colors shadow-lg gap-2">
                <FontAwesomeIcon icon={faPlus} className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            </Link>
          </div>

          <Dashboard key={refreshKey} />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">
            <TransactionsList type="expense" title="Recent Expenses" />
            <TransactionsList type="income" title="Recent Income" />
          </div>
        </div>

        {/* Settings Modal */}
        <Modal 
          isOpen={showSettings} 
          onClose={() => setShowSettings(false)}
          size="3xl"
          scrollBehavior="inside"
        >
          <ModalContent>
            <ModalHeader>
              <h2 className="text-2xl font-bold">Budget Settings</h2>
            </ModalHeader>
            <ModalBody className="pb-6">
              <BudgetSettings 
                onClose={() => setShowSettings(false)} 
                onUpdate={handleSettingsUpdate}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      </div>
    </AuthGuard>
  );
}