import { useState } from 'react';
import { activateUser, checkUsername, register, registerVerifyOtp } from '../services/api';
import { useDispatch } from 'react-redux';
import { setAuth } from '../redux/slices/authSlice';
import { setToken } from '../utils/localStorage';

const useSignup = () => {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [identificationToken, setIdentificationToken] = useState(null);
  const dispatch = useDispatch();

  const submitStepData = async (values) => {
    if (step == 0) {
      setIsLoading(true);
      try {
        console.log('Form Value email:', values.email);
        console.log('Form Value password:', values.password);
        const response = await register({
          email: values.email.toLowerCase(),
        });

        if (response.data?.isSent) {
          setStep(1);
        }

        setError(null);
      } catch (err) {
        console.log('Error ' + err);
        setError(err?.response?.data?.message || 'Something went wrong, please try again.');
      } finally {
        setIsLoading(false);
      }
    } else if (step == 1) {
      setIsLoading(true);
      try {
        console.log('Form Value otp:', values.otp);

        const response = await registerVerifyOtp(values.otp, {
          email: values.email,
          password: values.password,
        });

        if (response.data?.identificationToken) {
          setIdentificationToken(response.data?.identificationToken);
          setStep(2);
        }

        setError(null);
      } catch (err) {
        console.log('Error ' + err);
        setError(err?.response?.data?.message || 'Something went wrong, please try again.');
      } finally {
        setIsLoading(false);
      }
    } else if (step == 2) {
      setIsLoading(true);
      try {
        console.log('Form Value username:', values.username);
        const response = await checkUsername({ username: values.username });
        if (response.data?.isAvailable) {
          setStep(3);
        }
        setError(null);
      } catch (err) {
        setError(err?.response?.data?.message || 'Something went wrong, please try again.');
      } finally {
        setIsLoading(false);
      }
    } else if (step == 3) {
      setIsLoading(true);
      console.log('Form Values fullname:', values.fullname);
      console.log('Form Values dob:', values.dob);
      console.log('Form Values gender:', values.gender);
      try {
        const response = await activateUser(identificationToken, {
          username: values.username,
          fullname: values.fullname,
          dateOfBirth: values.dob,
          gender: values.gender.toUpperCase(),
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
        }

        setError(null);
      } catch (err) {
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
  };
};

export default useSignup;
