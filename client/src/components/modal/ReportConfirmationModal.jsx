import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const reportReasonsEnum = {
  HARASSMENT_BULLYING: 'Harassment or Bullying',
  HATE_SPEECH: 'Hate Speech',
  SPAM: 'Spam',
  NUDITY: 'Nudity or Sexual Content',
  VIOLENCE_THREATS: 'Violence or Threats',
  SELF_HARM_SUICIDE: 'Self-Harm or Suicide',
  MISINFORMATION: 'Misinformation',
  IMPERSONATION: 'Impersonation',
  INTELLECTUAL_PROPERTY: 'Intellectual Property Violations',
  INAPPROPRIATE_CONTENT: 'Inappropriate Content',
  SCAMS_FRAUD: 'Scams or Fraud',
  ILLEGAL_ACTIVITIES: 'Illegal Activities',
};

const ReportConfirmationModal = ({ isOpen, closeModal, report, isReporting, type }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, closeModal]);

  const handleOutsideClick = (event) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  const handleSubmit = () => {
    setError(null);
    if (selectedReason) {
      report(selectedReason);
      closeModal();
    } else {
      setError('Please select a reason before submitting.');
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className={`fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
            isReporting ? 'pointer-events-none opacity-50' : ''
          }`}
          onClick={handleOutsideClick}
        >
          <div
            className={`w-full max-w-xs transform rounded-lg border border-gray-500 bg-card p-6 shadow-lg transition-transform duration-300 sm:max-w-sm md:max-w-md lg:max-w-lg ${
              isOpen ? 'scale-100' : 'scale-95'
            } ${isReporting ? 'opacity-50' : ''}`}
          >
            <div className="mb-4 flex items-center justify-between text-xl">
              <h3 className="font-semibold text-red-600 dark:text-red-600">Confirm Report</h3>
              <button
                onClick={closeModal}
                className="text-muted-foreground hover:text-foreground dark:text-gray-300 dark:hover:text-gray-100"
                disabled={isReporting}
              >
                <CloseRoundedIcon
                  sx={{
                    fontSize: { xs: 25, sm: 28, md: 30 },
                  }}
                  className="text-muted-foreground transition duration-200 hover:text-red-500"
                />
              </button>
            </div>
            {type === 'POST' && (
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Please select a reason for reporting this post:
              </p>
            )}
            {type === 'REEL' && (
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Please select a reason for reporting this reel:
              </p>
            )}
            {type === 'COMMENT' && (
              <p className="mb-6 text-gray-700 dark:text-gray-300">
                Please select a reason for reporting this comment:
              </p>
            )}
            <div className="hide-scrollbar mb-4 max-h-60 overflow-y-auto rounded-lg border px-4 py-3 dark:border-gray-500">
              {Object.keys(reportReasonsEnum).map((key) => (
                <div key={key} className="mb-3 flex items-center">
                  <input
                    type="radio"
                    id={key}
                    name="reportReason"
                    value={key}
                    checked={selectedReason === key}
                    onChange={() => {
                      setError(null);
                      setSelectedReason(key);
                    }}
                    className="mr-2"
                    disabled={isReporting}
                  />
                  <label className="text-gray-700 dark:text-gray-300">
                    {reportReasonsEnum[key]}{' '}
                  </label>
                </div>
              ))}
            </div>

            <div className="mb-3 text-xs text-red-700 dark:text-red-400">{error}</div>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeModal}
                className={`rounded-lg bg-muted px-4 py-2 text-foreground transition-all duration-200 ease-in-out hover:bg-gray-400 dark:hover:bg-gray-600`}
                disabled={isReporting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className={`rounded-lg bg-red-500 px-4 py-2 text-white transition-all duration-200 ease-in-out hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700`}
                disabled={isReporting}
              >
                Report
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

ReportConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  report: PropTypes.func.isRequired,
  isReporting: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
};

export default ReportConfirmationModal;
