import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAuth } from '../redux/slices/authSlice';
import { setToken } from '../utils/localStorage';
import { login, loginVerifyOTP } from '../services/api';

const useLogin = () => {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('email');
  const [identificationToken, setIdentificationToken] = useState(null);
  const dispatch = useDispatch();

  const submitStepData = async (values) => {
    if (step === 0) {
      setIsLoading(true);
      try {
        if (selectedTab == 'email') {
          const response = await login({
            email: values.email.toLowerCase(),
            password: values.password,
          });

          if (response.data?.authToken) {
            setToken(response.data?.authToken);
            dispatch(
              setAuth({
                isAuthenticated: false,
                isInitializing: false,
                token: response.data?.authToken,
              })
            );
          } else {
            setIdentificationToken(response.data?.identificationToken);
            setStep(1);
          }
          setError(null);
        } else if (selectedTab == 'username') {
          const response = await login({
            username: values.username,
            password: values.password,
          });

          if (response.data?.authToken) {
            setToken(response.data?.authToken);
            dispatch(
              setAuth({
                isAuthenticated: false,
                isInitializing: false,
                token: response.data?.authToken,
              })
            );
          } else {
            setIdentificationToken(response.data?.identificationToken);
            setStep(1);
          }
          setError(null);
        }
      } catch (err) {
        setError(err?.response?.data?.message || 'Something went wrong, please try again.');
      } finally {
        setIsLoading(false);
      }
    } else if (step === 1) {
      setIsLoading(true);
      try {
        const response = await loginVerifyOTP(values.otp, identificationToken);

        setToken(response.data.authToken);
        dispatch(
          setAuth({
            isAuthenticated: false,
            isInitializing: false,
            token: response.data.authToken,
          })
        );

        setError(null);
      } catch (err) {
        setError(err?.response?.data?.message || 'Something went wrong, please try again.');

        setStep(2);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    step,
    isLoading,
    error,
    submitStepData,
    selectedTab,
    setSelectedTab,
  };
};

export default useLogin;
