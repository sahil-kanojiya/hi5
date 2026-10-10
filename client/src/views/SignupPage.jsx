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
  const { step, isLoading, error, submitStepData } = useSignup();

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
          {step === validationSchemas.length ? 'Complete Your Profile' : 'Join Hi5 Today'}
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
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-sm font-medium text-foreground">
                      Email address
                    </label>
                    <Field
                      name="email"
                      type="email"
                      id="email"
                      className="w-full rounded-lg border border-border bg-input/50 p-3 text-foreground transition-colors focus:border-primary focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="name@company.com"
                      disabled={isLoading}
                    />
                    {touched.email && errors.email && (
                      <p className="mt-1 text-xs text-destructive">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="password" className="block text-sm font-medium text-foreground">
                      Password
                    </label>
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
              )}

              {/* OTP Form Step */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="rounded-lg border border-primary/20 bg-primary/10 p-4 text-sm text-foreground/80">
                    A one-time password (OTP) has been sent to your email. Please enter the 6-digit
                    code below to verify your email address.
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

              {/* Username Form Step */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="rounded-lg border border-border bg-secondary p-4 text-sm text-foreground/80">
                    Choose a unique username that will be displayed on your profile.
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="username" className="block text-sm font-medium text-foreground">
                      Username
                    </label>
                    <Field
                      name="username"
                      type="text"
                      id="username"
                      placeholder="e.g. janesmith_99"
                      className="w-full rounded-lg border border-border bg-input/50 p-3 text-foreground transition-colors focus:border-primary focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                      disabled={isLoading}
                    />
                    {touched.username && errors.username && (
                      <p className="mt-1 text-xs text-destructive">{errors.username}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Full Name, DOB & Gender Form Step */}
              {step === 3 && (
                <div className="space-y-5">
                  <div className="rounded-lg border border-border bg-secondary p-4 text-sm text-foreground/80">
                    Please provide your details to complete your profile. This information will help
                    us personalize your experience.
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="fullname"
                        className="block text-sm font-medium text-foreground"
                      >
                        Full Name
                      </label>
                      <Field
                        name="fullname"
                        type="text"
                        id="fullname"
                        placeholder="Enter your full name"
                        className="w-full rounded-lg border border-border bg-input/50 p-3 text-foreground transition-colors focus:border-primary focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                        disabled={isLoading}
                      />
                      {touched.fullname && errors.fullname && (
                        <p className="mt-1 text-xs text-destructive">{errors.fullname}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="dob" className="block text-sm font-medium text-foreground">
                        Date of Birth
                      </label>
                      <Field
                        name="dob"
                        type="date"
                        id="dob"
                        className="w-full rounded-lg border border-border bg-input/50 p-3 text-foreground transition-colors focus:border-primary focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                        disabled={isLoading}
                      />
                      {touched.dob && errors.dob && (
                        <p className="mt-1 text-xs text-destructive">{errors.dob}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="gender" className="block text-sm font-medium text-foreground">
                        Gender
                      </label>
                      <Field
                        name="gender"
                        as="select"
                        id="gender"
                        className="w-full rounded-lg border border-border bg-input/50 p-3 text-foreground transition-colors focus:border-primary focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                        disabled={isLoading}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                      </Field>
                      {touched.gender && errors.gender && (
                        <p className="mt-1 text-xs text-destructive">{errors.gender}</p>
                      )}
                    </div>
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
                {step === 0
                  ? 'Create Account'
                  : step === 1
                    ? 'Verify Email'
                    : step === 2
                      ? 'Continue'
                      : 'Complete Setup'}
              </button>

              {step === 0 && (
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link to="/login" className="font-semibold text-primary hover:underline">
                    Sign in here
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

export default SignUpPage;
