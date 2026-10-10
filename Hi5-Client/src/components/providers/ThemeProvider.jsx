import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const ThemeProvider = ({ children }) => {
  console.log('ThemeProvider');

  const theme = useSelector((state) => state.theme.theme);

  useEffect(() => {
    console.log('ThemeProvider theme :' + theme);
    theme === 'dark'
      ? document.documentElement.classList.add('dark')
      : document.documentElement.classList.remove('dark');
  }, [theme]);

  return <>{children}</>;
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ThemeProvider;
