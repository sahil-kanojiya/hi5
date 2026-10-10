import PropTypes from 'prop-types';
import ReportedUsersModel from './ReportedUsersModel';
import { useState } from 'react';

const ReportDetail = ({ reportDetail, type, relevantId }) => {
  const [isReportedUsersOpen, setIsReportedUsersOpen] = useState(false);

  const openReportedUsersModel = () => setIsReportedUsersOpen(true);
  const closeReportedUsersModel = () => {
    setIsReportedUsersOpen(false);
    console.log('set');
  };

  return (
    <>
      <div
        className="flex w-full cursor-pointer items-center justify-between px-3 py-2 transition-all duration-300 ease-in-out hover:bg-gray-300 dark:hover:bg-gray-700"
        onClick={openReportedUsersModel}
      >
        <p className="font-medium text-gray-700 dark:text-gray-300">{reportDetail.reason}</p>
        <span className="font-semibold text-gray-900 dark:text-gray-100">{reportDetail.count}</span>
      </div>
      {isReportedUsersOpen && (
        <ReportedUsersModel
          isOpen={isReportedUsersOpen}
          closeModal={closeReportedUsersModel}
          type={type}
          relevantId={relevantId}
          reason={reportDetail.reason}
        />
      )}
    </>
  );
};

ReportDetail.propTypes = {
  reportDetail: PropTypes.shape({
    reason: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
  }).isRequired,
  type: PropTypes.string.isRequired,
  relevantId: PropTypes.string.isRequired,
};

export default ReportDetail;
