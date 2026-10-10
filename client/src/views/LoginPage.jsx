import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import logo from '../assets/images/logo/hi5.svg';
import googleLogo from '../assets/images/logo/google.svg';
import githubLogo from '../assets/images/logo/github.svg';
import useLogin from '../hooks/useLogin';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const validationSchemas = [
  Yup.object({
    email: Yup.string().email('Please enter a valid email address').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters long')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(/[@$!%*?&]/, 'Password must contain at least one special character')
      .matches(
        /^[A-Za-z0-9@$!%*?&]+$/,
        'Password can only contain letters, numbers, and special characters (@ $ ! % * ? &)'
      )
      .required('Password is required'),
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
    password: Yup.string()
      .min(8, 'Password must be at least 6 characters long')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(/[@$!%*?&]/, 'Password must contain at least one special character')
      .required('Password is required'),
  }),

  Yup.object({
    otp: Yup.string()
      .length(6, 'OTP must be exactly 6 digits')
      .matches(/^\d{6}$/, 'OTP must only contain numbers')
      .required('OTP is required'),
  }),
];

const LoginPage = () => {
  const { step, isLoading, error, submitStepData, selectedTab, setSelectedTab } = useLogin();

  const initialValues = {
    email: '',
    username: '',
    password: '',
    otp: '',
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

  const getValidationSchema = () => {
    if (step == 0) {
      return selectedTab === 'email' ? validationSchemas[0] : validationSchemas[1];
    }
    return validationSchemas[2];
  };

  return (
    <section className="relative mx-auto flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-8">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-pink-500/20 dark:from-indigo-900/40 dark:via-purple-900/20 dark:to-pink-900/40" />
      <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-accent/30 blur-3xl" />

      <div className="glass-card relative z-10 w-full max-w-md rounded-2xl p-8 sm:px-10">
        <div className="mb-6 flex items-center justify-center text-center">
          <Link to="/" className="group transition-transform hover:scale-105">
            <img className="h-16 w-auto drop-shadow-md" src={logo} alt="Hi5" />
          </Link>
        </div>

        <h1 className="text-gradient mb-8 text-center text-2xl font-bold tracking-tight">
          {step === validationSchemas.length ? 'Complete Your Profile' : 'Welcome back to Hi5'}
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
                  <div className="mb-6 flex justify-center space-x-2 rounded-lg bg-muted/50 p-1">
                    <button
                      type="reset"
                      disabled={isLoading}
                      className={`flex-1 rounded-md p-2 text-sm font-medium transition-all duration-300 ${
                        selectedTab === 'email'
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:bg-muted/80'
                      }`}
                      onClick={() => setSelectedTab('email')}
                    >
                      Email
                    </button>
                    <button
                      type="reset"
                      disabled={isLoading}
                      className={`flex-1 rounded-md p-2 text-sm font-medium transition-all duration-300 ${
                        selectedTab === 'username'
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:bg-muted/80'
                      }`}
                      onClick={() => setSelectedTab('username')}
                    >
                      Username
                    </button>
                  </div>

                  <div className="space-y-5">
                    {selectedTab === 'email' && (
                      <div className="space-y-1.5">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-foreground"
                        >
                          Email address
                        </label>
                        <Field
                          name="email"
                          type="email"
                          id="email"
                          placeholder="name@company.com"
                          className="w-full rounded-lg border border-border bg-input/50 p-3 text-foreground transition-colors focus:border-primary focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                          disabled={isLoading}
                        />
                        {touched.email && errors.email && (
                          <p className="mt-1 text-xs text-destructive">{errors.email}</p>
                        )}
                      </div>
                    )}

                    {selectedTab === 'username' && (
                      <div className="space-y-1.5">
                        <label
                          htmlFor="username"
                          className="block text-sm font-medium text-foreground"
                        >
                          Username
                        </label>
                        <Field
                          name="username"
                          type="text"
                          id="username"
                          placeholder="Enter your username"
                          className="w-full rounded-lg border border-border bg-input/50 p-3 text-foreground transition-colors focus:border-primary focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                          disabled={isLoading}
                        />
                        {touched.username && errors.username && (
                          <p className="mt-1 text-xs text-destructive">{errors.username}</p>
                        )}
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium text-foreground"
                        >
                          Password
                        </label>
                        {step === 0 && (
                          <Link
                            to="/forgot-password"
                            className="text-xs font-medium text-primary hover:text-primary/80 hover:underline"
                          >
                            Forgot password?
                          </Link>
                        )}
                      </div>
                      <div className="relative flex w-full items-center justify-between rounded-lg border border-border bg-input/50 transition-colors focus-within:border-primary focus-within:bg-background focus-within:ring-1 focus-within:ring-primary">
                        <Field
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          disabled={isLoading}
                          className="w-full bg-transparent p-3 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="p-3 text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
                          disabled={isLoading}
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <VisibilityOff fontSize="small" />
                          ) : (
                            <Visibility fontSize="small" />
                          )}
                        </button>
                      </div>
                      {touched.password && errors.password && (
                        <p className="mt-1 text-xs text-destructive">{errors.password}</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* OTP Form Step */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="rounded-lg border border-primary/20 bg-primary/10 p-4 text-sm text-foreground/80">
                    A one-time password (OTP) has been sent to your email. Please enter the 6-digit
                    code below to verify your identity.
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="otp" className="block text-sm font-medium text-foreground">
                      OTP Code
                    </label>
                    <Field
                      name="otp"
                      type="text"
                      id="otp"
                      placeholder="000000"
                      className="w-full rounded-lg border border-border bg-input/50 p-3 text-center text-2xl tracking-widest text-foreground transition-colors focus:border-primary focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                      disabled={isLoading}
                    />
                    {touched.otp && errors.otp && (
                      <p className="mt-1 text-center text-xs text-destructive">{errors.otp}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Show error from backend if exists */}
              {error && (
                <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              {/* Submit or Next Button */}
              <button
                type="submit"
                className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-primary/25 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-[0.98]"
                disabled={isLoading}
              >
                {step === 0 ? 'Sign In' : 'Verify Identity'}
              </button>

              {step === 0 && (
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Don&apos;t have an account yet?{' '}
                  <Link to="/signup" className="font-semibold text-primary hover:underline">
                    Create an account
                  </Link>
                </div>
              )}
            </Form>
          )}
        </Formik>

        {step === 0 && (
          <div className="mt-8">
            <div className="relative mb-6 flex items-center">
              <div className="flex-grow border-t border-border" />
              <span className="mx-4 text-xs font-medium uppercase text-muted-foreground">
                Or continue with
              </span>
              <div className="flex-grow border-t border-border" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleGoogleRedirect}
                className="flex w-full items-center justify-center space-x-2 rounded-lg border border-border bg-background p-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-border"
                disabled={isLoading}
              >
                <img className="h-5 w-5" src={googleLogo} alt="Google" />
                <span>Google</span>
              </button>

              <button
                onClick={handleGithubRedirect}
                className="flex w-full items-center justify-center space-x-2 rounded-lg border border-border bg-background p-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-border"
                disabled={isLoading}
              >
                <img className="h-5 w-5" src={githubLogo} alt="GitHub" />
                <span>GitHub</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default LoginPage;
