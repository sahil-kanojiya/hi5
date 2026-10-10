import PropTypes from 'prop-types';
import { formatDistanceToNow } from 'date-fns';

const TimeAgo = ({ date, className = '' }) => {
  let dateObj;
  if (typeof date === 'number') {
    dateObj = new Date(Number(date));
  } else {
    dateObj = new Date(date);
  }

  const timeAgo = isNaN(dateObj.getTime())
    ? 'Invalid date'
    : formatDistanceToNow(dateObj, { addSuffix: true });

  return <span className={className}>{timeAgo}</span>;
};

TimeAgo.propTypes = {
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  className: PropTypes.string,
};

export default TimeAgo;
