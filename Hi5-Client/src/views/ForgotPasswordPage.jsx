import { Field, Form, Formik } from 'formik';
import logo from '../assets/images/logo/hi5.svg';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import useForgotPassword from '../hooks/useForgotPassword';
import { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const validationSchemas = [
  Yup.object({
    email: Yup.string().email('Please enter a valid email address').required('Email is required'),
  }),

  Yup.object({
    username: Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .max(15, 'Username must not exceed 15 characters')
      .required('Username is required'),
  }),

  Yup.object({
    otp: Yup.string()
      .length(6, 'OTP must be exactly 6 digits')
      .matches(/^\d{6}$/, 'OTP must only contain numbers')
      .required('OTP is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 6 characters long')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(/[@$!%*?&]/, 'Password must contain at least one special character')
      .matches(
        /^[A-Za-z0-9@$!%*?&]+$/, // Ensures NO other characters are allowed
        'Password can only contain letters, numbers, and special characters (@ $ ! % * ? &)'
      )
      .required('Password is required'),
  }),
];

const ForgotPasswordPage = () => {
  const { step, isLoading, error, submitStepData, selectedTab, setSelectedTab } =
    useForgotPassword();

  const initialValues = {
    email: '',
    username: '',
    otp: '',
    password: '',
  };

  const [showPassword, setShowPassword] = useState(false);

  const getValidationSchema = () => {
    if (step == 0) {
      return selectedTab === 'email' ? validationSchemas[0] : validationSchemas[1];
    }
    return validationSchemas[2];
  };

  return (
    <section className="mx-auto flex min-h-screen flex-col items-center justify-center bg-gray-100 px-6 py-8 dark:bg-gray-900">
      <div className="relative w-full max-w-md rounded-lg border-gray-300 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-black sm:p-8">
        <div className="my-4 flex items-center justify-center text-center">
          <a href="/">
            <img className="h-16 w-auto" src={logo} alt="Hi5" />
          </a>
        </div>

        <h1 className="mb-4 text-center text-xl font-bold">
          {step === validationSchemas.length ? 'Reset Your Password' : 'Forgot Password'}
        </h1>

        <Formik
          initialValues={initialValues}
          validationSchema={getValidationSchema()}
          onSubmit={(values) => submitStepData(values)}
        >
          {({ errors, touched }) => (
            <Form
              className={`space-y-6 transition-opacity duration-500 ${
                isLoading ? 'opacity-50' : 'opacity-100'
              }`}
            >
              {/* Email/Username & Password Form Step */}
              {step === 0 && (
                <>
                  <div className="mb-4 flex justify-center space-x-4">
                    <button
                      type="reset"
                      disabled={isLoading}
                      className={`p-2 text-sm font-medium transition-all duration-300 ${
                        selectedTab === 'email'
                          ? 'border-b-2 border-blue-600 text-blue-600'
                          : 'border-b-2 border-white text-gray-600 hover:border-gray-200'
                      }`}
                      onClick={() => setSelectedTab('email')}
                    >
                      Email
                    </button>
                    <button
                      type="reset"
                      disabled={isLoading}
                      className={`p-2 text-sm font-medium transition-all duration-300 ${
                        selectedTab === 'username'
                          ? 'border-b-2 border-blue-600 text-blue-600'
                          : 'border-b-2 border-white text-gray-600 hover:border-gray-200'
                      }`}
                      onClick={() => setSelectedTab('username')}
                    >
                      Username
                    </button>
                  </div>

                  <div className="space-y-4">
                    {selectedTab === 'email' && (
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Your Email
                        </label>
                        <Field
                          name="email"
                          type="email"
                          id="email"
                          placeholder="name@company.com"
                          className="mt-2 w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          disabled={isLoading}
                        />
                        {touched.email && errors.email && (
                          <p className="ml-1 mt-2 text-sm text-red-700">{errors.email}</p>
                        )}
                      </div>
                    )}

                    {selectedTab === 'username' && (
                      <div>
                        <label
                          htmlFor="username"
                          className="block text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Your Username
                        </label>
                        <Field
                          name="username"
                          type="text"
                          id="username"
                          placeholder="Enter your username"
                          className="mt-2 w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          disabled={isLoading}
                        />
                        {touched.username && errors.username && (
                          <p className="ml-1 mt-2 text-sm text-red-700">{errors.username}</p>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* OTP Form Step */}
              {step === 1 && (
                <>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    A one-time password (OTP) has been sent to your email. Please enter the 6-digit
                    code below to verify your email address.
                  </p>
                  <div>
                    <label
                      htmlFor="otp"
                      className="block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      OTP
                    </label>
                    <Field
                      name="otp"
                      type="text"
                      id="otp"
                      placeholder="Choose a username"
                      className="mt-2 w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      disabled={isLoading}
                    />
                    {touched.otp && errors.otp && (
                      <p className="ml-1 mt-2 text-sm text-red-700">{errors.otp}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </label>
                    <div className="mt-2 flex w-full items-center justify-between gap-2 rounded-lg border focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                      <Field
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        disabled={isLoading}
                        className="w-full bg-transparent p-2 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="p-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                        disabled={isLoading}
                        tabIndex={-1}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </button>
                    </div>
                    {touched.password && errors.password && (
                      <p className="ml-1 mt-2 text-sm text-red-700">{errors.password}</p>
                    )}
                  </div>
                </>
              )}

              {/* Show error from backend if exists */}
              {error && <div className="ml-1 text-xs text-red-500">{error}</div>}

              {(step == 0 || step == 1) && (
                <div className="mt-4 flex items-center justify-between">
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-blue-600 p-2 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
                    disabled={isLoading}
                  >
                    {step === 0 ? 'Continue' : 'Verify'}
                  </button>
                </div>
              )}

              {step == 2 && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Your Password reset successful
                </p>
              )}

              {(step == 0 || step == 2) && (
                <>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Back to
                    <Link to="/login" className="pl-2 font-medium text-blue-600 hover:underline">
                      Login
                    </Link>
                  </p>
                </>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
