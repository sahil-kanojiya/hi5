import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const BanConfirmationModal = ({ isOpen, closeModal, confirmBan, isBanning }) => {
  const [banDate, setBanDate] = useState(new Date());
  const [yearsToAdd, setYearsToAdd] = useState(0);
  const [monthsToAdd, setMonthsToAdd] = useState(0);
  const [daysToAdd, setDaysToAdd] = useState(0);

  const updateBanDate = () => {
    let newBanDate = new Date(banDate);
    newBanDate.setFullYear(newBanDate.getFullYear() + yearsToAdd);
    newBanDate.setMonth(newBanDate.getMonth() + monthsToAdd);
    newBanDate.setDate(newBanDate.getDate() + daysToAdd);
    setBanDate(newBanDate);
  };

  const handleInputChange = (e, type) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) {
      value = 0;
    }
    if (type === 'year') setYearsToAdd(value);
    if (type === 'month') setMonthsToAdd(value);
    if (type === 'day') setDaysToAdd(value);
  };

  const handleTimeChange = (date) => {
    setBanDate(date);
  };

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeModal]);

  const handleOutsideClick = (event) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  const clearAll = () => {
    setYearsToAdd(0);
    setMonthsToAdd(0);
    setDaysToAdd(0);
  };

  return (
    <>
      {isOpen && (
        <div
          className={`fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
            isBanning ? 'pointer-events-none' : ''
          }`}
          onClick={handleOutsideClick}
        >
          <div
            className={`w-full max-w-xs transform rounded-lg border border-gray-500 bg-white p-6 shadow-lg transition-transform duration-300 dark:bg-black sm:w-2/3 sm:max-w-sm sm:p-8 md:w-1/2 md:max-w-md lg:w-1/3 lg:max-w-lg xl:w-1/4 xl:max-w-xl ${
              isBanning ? 'pointer-events-none scale-95' : 'scale-100'
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-yellow-600 dark:text-yellow-400">
                Confirm Ban
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-800 dark:text-gray-200 dark:hover:text-gray-400"
                disabled={isBanning}
              >
                <CloseRoundedIcon
                  sx={{
                    fontSize: { xs: 25, sm: 28, md: 30 },
                  }}
                />
              </button>
            </div>

            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Are you sure you want to ban this account?
            </p>
            <div className="mb-6">
              <label htmlFor="banDate" className="mb-2 block text-gray-700 dark:text-gray-300">
                Ban Date
              </label>
              <DatePicker
                selected={banDate}
                onChange={handleTimeChange}
                dateFormat="yyyy-MM-dd"
                className="w-full rounded-lg border border-gray-500 px-4 py-2 outline-none dark:bg-gray-800 dark:text-white"
                disabled={isBanning}
                placeholderText="Select a date"
              />
            </div>
            <div className="mb-6">
              <label className="mb-2 block text-gray-700 dark:text-gray-300">Add Time</label>
              <div className="flex gap-4">
                <div className="flex w-20 flex-col items-center">
                  <label className="text-gray-700 dark:text-gray-300">Years</label>
                  <input
                    type="number"
                    value={yearsToAdd}
                    onChange={(e) => handleInputChange(e, 'year')}
                    className="w-full rounded-lg border border-gray-500 px-4 py-2 outline-none dark:bg-gray-800 dark:text-white"
                    disabled={isBanning}
                  />
                </div>
                <div className="flex w-20 flex-col items-center">
                  <label className="text-gray-700 dark:text-gray-300">Months</label>
                  <input
                    type="number"
                    value={monthsToAdd}
                    onChange={(e) => handleInputChange(e, 'month')}
                    className="w-full rounded-lg border border-gray-500 px-4 py-2 outline-none dark:bg-gray-800 dark:text-white"
                    disabled={isBanning}
                  />
                </div>
                <div className="flex w-20 flex-col items-center">
                  <label className="text-gray-700 dark:text-gray-300">Days</label>
                  <input
                    type="number"
                    value={daysToAdd}
                    onChange={(e) => handleInputChange(e, 'day')}
                    className="w-full rounded-lg border border-gray-500 px-4 py-2 outline-none dark:bg-gray-800 dark:text-white"
                    disabled={isBanning}
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={updateBanDate}
                  className={`bg-yellow-500 dark:bg-yellow-600 ${isBanning ? 'cursor-not-allowed opacity-50' : 'hover:bg-yellow-600 dark:hover:bg-yellow-700'} rounded-lg px-4 py-2 text-white transition-all duration-200 ease-in-out`}
                  disabled={isBanning}
                >
                  Add Time
                </button>
                <button
                  onClick={clearAll}
                  className={`bg-gray-300 dark:bg-gray-600 ${isBanning ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-400 dark:hover:bg-gray-500'} rounded-lg px-4 py-2 text-black transition-all duration-200 ease-in-out dark:text-white`}
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={closeModal}
                className={`bg-gray-300 dark:bg-gray-600 ${
                  isBanning
                    ? 'cursor-not-allowed opacity-50'
                    : 'hover:bg-gray-400 dark:hover:bg-gray-500'
                } rounded-lg px-4 py-2 text-black transition-all duration-200 ease-in-out dark:text-white`}
                disabled={isBanning}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  confirmBan(banDate);
                }}
                className={`bg-yellow-500 dark:bg-yellow-600 ${
                  isBanning
                    ? 'cursor-not-allowed opacity-50'
                    : 'hover:bg-yellow-600 dark:hover:bg-yellow-700'
                } rounded-lg px-4 py-2 text-white transition-all duration-200 ease-in-out`}
                disabled={isBanning}
              >
                Ban
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

BanConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  confirmBan: PropTypes.func.isRequired,
  isBanning: PropTypes.bool.isRequired,
};

export default BanConfirmationModal;
