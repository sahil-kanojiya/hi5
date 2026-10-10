import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import axiosInstance from '../../../services/axios.config';
import ReportDetail from './ReportDetail';
import DeleteConfirmationModal from '../../modal/DeleteConfirmationModal';
import { deleteAllReports } from '../../../services/api';

const ReportDetailsModal = ({ isOpen, onClose, type, relevantId, removeEntity }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleOutsideClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  console.log(type, relevantId);

  const [reportDetails, setReportDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportDetail = async () => {
      try {
        const response = await axiosInstance.get('/moderate/report-summary', {
          params: {
            reportType: type,
            relevantId,
          },
        });
        console.log(response.data);
        setReportDetails(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportDetail();
  }, [relevantId, type]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);
  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAllReports(relevantId, type);
      console.log('Reports deleted: ' + relevantId);
    } catch (error) {
      console.error('Error deleting reports: ', error);
    } finally {
      setIsDeleting(false);
      closeDeleteModal();
      onClose();
      removeEntity(relevantId);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleOutsideClick}
    >
      <div className="w-full max-w-md rounded-lg border border-gray-500 bg-card p-4 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Report Details</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground transition duration-200 hover:text-red-500"
          >
            <CloseRoundedIcon
              sx={{
                fontSize: { xs: 25, sm: 28, md: 30 },
              }}
            />
          </button>
        </div>

        <div className="hide-scrollbar max-h-60 overflow-y-auto rounded-md bg-background shadow-sm">
          {!isLoading && reportDetails.length > 0 && (
            <>
              {reportDetails.map((reportDetail, index) => (
                <ReportDetail
                  key={index}
                  reportDetail={reportDetail}
                  type={type}
                  relevantId={relevantId}
                />
              ))}
            </>
          )}
        </div>
        {isLoading && (
          <div className="flex w-full items-center justify-between px-3 py-2 transition-all duration-300 ease-in-out hover:bg-muted dark:hover:bg-gray-700">
            <p className="text-center font-medium text-gray-700 dark:text-gray-300">loading</p>
          </div>
        )}
        {error && <p className="text-sm font-semibold text-red-500">{error}</p>}

        {!isDeleting && reportDetails.length > 0 && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={openDeleteModal}
              className="rounded-md bg-red-500 px-4 py-2 font-medium text-white transition duration-200 hover:bg-red-600"
            >
              Delete All Reports
            </button>
          </div>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        closeModal={closeDeleteModal}
        confirmDelete={confirmDelete}
        isDeleting={isDeleting}
        type="REPORTS"
      />
    </div>
  );
};

ReportDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  relevantId: PropTypes.string.isRequired,
  removeEntity: PropTypes.func.isRequired,
};

export default ReportDetailsModal;
