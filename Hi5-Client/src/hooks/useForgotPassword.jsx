import { useState } from 'react';
import { forgotPassword, forgotPasswordVerifyOTP } from '../services/api';

const useForgotPassword = () => {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('email');

  const submitStepData = async (values) => {
    if (step === 0) {
      setIsLoading(true);
      try {
        console.log('Form Value email:', values.email);
        console.log('Form Value username:', values.username);
        if (selectedTab === 'email') {
          const response = await forgotPassword({
            email: values.email.toLowerCase(),
          });

          if (response.data?.isSent) {
            setStep(1);
          }

          setError(null);
        } else if (selectedTab === 'username') {
          const response = await forgotPassword({
            username: values.username,
          });

          if (response.data?.sent) {
            setStep(1);
          }

          setError(null);
        }
      } catch (err) {
        console.log('Error ' + err);
        setError(err?.response?.data?.message || 'Something went wrong, please try again.');
      } finally {
        setIsLoading(false);
      }
    } else if (step === 1) {
      setIsLoading(true);
      try {
        console.log('Form Value OTP:', values.otp);
        console.log('Form Value username:', values.password);
        if (selectedTab === 'email') {
          const response = await forgotPasswordVerifyOTP(values.otp, {
            email: values.email.toLowerCase(),
            password: values.password,
          });

          if (response.status === 200) {
            setStep(2);
          }

          setError(null);
        } else if (selectedTab === 'username') {
          const response = await forgotPasswordVerifyOTP(values.otp, {
            username: values.username,
            password: values.password,
          });

          if (response.status === 200) {
            setStep(2);
          }

          setError(null);
        }
      } catch (err) {
        console.log('Error ' + err);
        setError(err?.response?.data?.message || 'Something went wrong, please try again.');
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

export default useForgotPassword;
