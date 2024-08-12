"use client";

import { useState } from "react";

const Checkbox = ({ checkedCb }: { checkedCb: (checked: boolean) => void }) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="inline-block">
      <label className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            className="hidden"
            name="isCollab"
            checked={isChecked}
            onChange={() => {
                checkedCb(!isChecked);
                setIsChecked(!isChecked);
            }}
          />
          <div
            className={`w-6 h-6 border-2 border-black rounded-sm ${
              isChecked ? "bg-white" : "bg-white"
            }`}
          >
            {isChecked && (
              <svg
                className="w-5 h-5 text-black fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
              </svg>
            )}
          </div>
        </div>
      </label>
    </div>
  );
};

export default Checkbox;
