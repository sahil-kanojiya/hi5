import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import logo from '../assets/images/logo/hi5.svg';
import googleLogo from '../assets/images/logo/google.svg';
import githubLogo from '../assets/images/logo/github.svg';
import useSignup from '../hooks/useSignUp';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const validationSchemas = [
  Yup.object({
    email: Yup.string().email('Please enter a valid email address').required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 6 characters long')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(/[@$!%*?&]/, 'Password must contain at least one special character: @ $ ! % * ? &')
      .matches(
        /^[A-Za-z0-9@$!%*?&]+$/,
        'Password can only contain letters, numbers, and special characters (@ $ ! % * ? &)'
      )
      .required('Password is required'),
  }),

  Yup.object({
    otp: Yup.string()
      .length(6, 'OTP must be exactly 6 digits')
      .matches(/^\d{6}$/, 'OTP must only contain numbers')
      .required('OTP is required'),
  }),

  Yup.object({
    username: Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .max(15, 'Username must not exceed 15 characters')
      .matches(
        /^[a-z0-9_]+$/,
        'Username can only contain lowercase letters, numbers, and underscores'
      )
      .required('Username is required'),
  }),

  Yup.object({
    fullname: Yup.string()
      .min(3, 'Fullname must be at least 3 characters')
      .max(50, 'Fullname must not exceed 15 characters')
      .matches(/^[A-Za-z ]+$/, 'Full name can only contain letters and spaces')
      .required('Full name is required'),
    dob: Yup.date()
      .max(new Date(), 'Date of birth cannot be in the future')
      .required('Date of birth is required'),
    gender: Yup.string()
      .oneOf(['male', 'female', 'other', 'prefer_not_to_say'], 'Please select a valid gender')
      .required('Gender is required'),
  }),
];

const SignUpPage = () => {
  const { step, isLoading, error, submitStepData } = useSignup(); // Using the custom hook

  const initialValues = {
    email: '',
    password: '',
    otp: '',
    username: '',
    fullname: '',
    dob: '',
    gender: '',
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleRedirect = () => {
    console.log('login with google');
    location.href = 'http://localhost:8080/oauth2/authorize/google';
  };

  const handleGithubRedirect = () => {
    console.log('login with github');
    location.href = 'http://localhost:8080/oauth2/authorize/github';
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
          {step === validationSchemas.length ? 'Complete Your Profile' : 'Sign Up to Hi5'}
        </h1>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchemas[step]}
          onSubmit={(values) => submitStepData(values)}
        >
          {({ errors, touched }) => (
            <Form
              className={`space-y-6 transition-opacity duration-500 ${
                isLoading ? 'opacity-50' : 'opacity-100'
              }`}
            >
              {/* Email & Password Form Step */}
              {step === 0 && (
                <>
                  <div className="space-y-4">
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
                        className="mt-2 w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        placeholder="name@company.com"
                        disabled={isLoading}
                      />
                      {touched.email && errors.email && (
                        <p className="ml-1 mt-2 text-sm text-red-700">{errors.email}</p>
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
                      placeholder="Enter OTP"
                      className="mt-2 w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      disabled={isLoading}
                    />
                    {touched.otp && errors.otp && (
                      <p className="ml-1 mt-2 text-sm text-red-700">{errors.otp}</p>
                    )}
                  </div>
                </>
              )}

              {/* Username Form Step */}
              {step === 2 && (
                <>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Choose a unique username that will be displayed on your profile.
                  </p>
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Username
                    </label>
                    <Field
                      name="username"
                      type="text"
                      id="username"
                      placeholder="Choose a username"
                      className="mt-2 w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      disabled={isLoading}
                    />
                    {touched.username && errors.username && (
                      <p className="ml-1 mt-2 text-sm text-red-700">{errors.username}</p>
                    )}
                  </div>
                </>
              )}

              {/* Full Name, DOB & Gender Form Step */}
              {step === 3 && (
                <>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Please provide your full name, date of birth, and gender to complete your
                    profile. This information will help us personalize your experience.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="fullname"
                        className="block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Full Name
                      </label>
                      <Field
                        name="fullname"
                        type="text"
                        id="fullname"
                        placeholder="Enter your full name"
                        className="mt-2 w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        disabled={isLoading}
                      />
                      {touched.fullname && errors.fullname && (
                        <p className="ml-1 mt-2 text-sm text-red-700">{errors.fullname}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="dob"
                        className="block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Date of Birth
                      </label>
                      <Field
                        name="dob"
                        type="date"
                        id="dob"
                        className="mt-2 w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        disabled={isLoading}
                      />
                      {touched.dob && errors.dob && (
                        <p className="ml-1 mt-2 text-sm text-red-700">{errors.dob}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="gender"
                        className="block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Gender
                      </label>
                      <Field
                        name="gender"
                        as="select"
                        id="gender"
                        className="mt-2 w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        disabled={isLoading}
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                      </Field>
                      {touched.gender && errors.gender && (
                        <p className="text-red-5 700 ml-1 mt-2 text-sm">{errors.gender}</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Show error from backend if exists */}
              {error && <div className="ml-1 text-xs text-red-700">{error}</div>}

              {/* Submit or Next Button */}
              <div className="mt-4 flex items-center justify-between">
                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-600 p-2 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
                  disabled={isLoading}
                >
                  {step == 0 ? 'Sign Up' : step == 1 ? 'Verify' : step == 2 ? 'Continue' : 'Finish'}
                </button>
              </div>

              {step == 0 && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?
                  <Link to="/login" className="pl-2 font-medium text-blue-600 hover:underline">
                    Login
                  </Link>
                </p>
              )}
            </Form>
          )}
        </Formik>

        {step == 0 && (
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="rounded-md bg-gray-200 px-3 py-1 text-gray-500 dark:bg-gray-800 dark:text-white">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={handleGoogleRedirect}
                className="inline-flex w-full justify-center rounded-md bg-gray-300 px-4 py-2 text-gray-700 shadow-sm hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-800"
                disabled={isLoading}
              >
                <img className="w-6" src={googleLogo} alt="Google Logo" />
                <span className="ml-2">Google</span>
              </button>

              <button
                onClick={handleGithubRedirect}
                className="inline-flex w-full justify-center rounded-md bg-gray-300 px-4 py-2 text-gray-700 shadow-sm hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-800"
                disabled={isLoading}
              >
                <img className="w-6" src={githubLogo} alt="GitHub Logo" />
                <span className="ml-2">GitHub</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SignUpPage;
