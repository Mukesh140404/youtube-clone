import React from 'react'

const ActionButton = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <button className="flex items-center gap-2 bg-gray-100 dark:bg-[#272727] px-4 py-2 rounded-full hover:bg-gray-200 dark:hover:bg-[#3f3f3f] transition text-sm font-medium">
    {icon} {label && <span>{label}</span>}
  </button>
);

export default ActionButton