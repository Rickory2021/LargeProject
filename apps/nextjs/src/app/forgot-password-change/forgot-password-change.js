'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function ForgotPasswordChange() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const router = useRouter();

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    uppercase: false,
    lowercase: false,
    specialCharacter: false,
    samePasswordRetype: false
  });
  const [retypePassword, setRetypePassword] = useState('');
  const [retypePasswordFocused, setRetypePasswordFocused] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validatePassword(password, retypePassword)) {
      setError('Entered password does not meet validation requirements!');
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://slicer-project-backend.vercel.app'}/api/auth/user/reset-password?token=${token}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password })
        }
      );
      if (res.ok) {
        // router.push('/verify-email');
        setSaved(true);
      } else if (res.status === 400) {
        const { error } = await res.json();
        setError(error);
      } else {
        const { error } = await res.json();
        setError(error);
      }
    } catch (error) {
      console.error('An unexpected error happened:', error);
      setError('An unexpected error occurred. Please try again later.');
      setError(
        `An unexpected error occurred. Please try again later. ${error}`
      );
    }
  };

  const validatePassword = (password, retypePassword) => {
    console.log(password + ': vs :' + retypePassword);
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[0123456789])(?=.*[!@#$%^&*]).{8,}$/;
    const newPasswordRequirements = {
      minLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[01234567890]/.test(password),
      specialCharacter: /[!@#$%^&*]/.test(password),
      passwordLength: password.length,
      samePasswordRetype: password === retypePassword
    };
    console.log(`password:${password}`);
    console.log(`retypePassword:${retypePassword}`);
    setPasswordRequirements(newPasswordRequirements);
    return passwordRegex.test(password) && password === retypePassword;
  };

  const closeErrorPopup = () => {
    setError('');
  };

  const handlePasswordFocus = () => {
    setPasswordFocused(true);
  };

  const handlePasswordBlur = () => {
    setPasswordFocused(false);
    // setShowPassword(false); // Hide the button when the password input is blurred
  };

  const handleRetypePasswordFocus = () => {
    setRetypePasswordFocused(true);
  };

  const handleRetypePasswordBlur = () => {
    setRetypePasswordFocused(false);
    // setShowPassword(false); // Hide the button when the password input is blurred
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
  };

  const toggleRetypePasswordVisibility = () => {
    setShowRetypePassword(prevShowPassword => !prevShowPassword);
  };

  const handlePasswordChange = e => {
    setPassword(e.target.value);
    // if (passwordFocused) {
    //   validatePassword(e.target.value);
    // }
  };

  const handleRetypePasswordChange = e => {
    setRetypePassword(e.target.value);
  };

  useEffect(() => {
    if (passwordFocused || retypePasswordFocused) {
      validatePassword(password, retypePassword);
    }
  }, [password, retypePassword]);

  return (
    <div className="flex flex-col items-center justify-center h-screen pb-16">
      <h1 className="text-4xl font-bold mb-8">Reset Password</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="relative">
          <label className="block text-gray-700 font-medium mb-2 text-sm">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
              className="p-2 border border-gray-300 rounded-md"
            />
            {!showPassword && (
              <button
                type="button"
                className="absolute top-3 right-2"
                onClick={togglePasswordVisibility}
              >
                <FaEye />
              </button>
            )}
            {showPassword && (
              <button
                type="button"
                className="absolute top-3 right-2"
                onClick={togglePasswordVisibility}
              >
                <FaEyeSlash />
              </button>
            )}
          </div>
        </div>
        <div className="relative">
          <label className="block text-gray-700 font-medium mb-2 text-sm">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showRetypePassword ? 'text' : 'password'}
              placeholder="Retype Password"
              value={retypePassword}
              onChange={handleRetypePasswordChange}
              onFocus={handleRetypePasswordFocus}
              onBlur={handleRetypePasswordBlur}
              className="p-2 border border-gray-300 rounded-md"
            />
            {!showRetypePassword && (
              <button
                type="button"
                className="absolute top-3 right-2"
                onClick={toggleRetypePasswordVisibility}
              >
                <FaEye />
              </button>
            )}
            {showRetypePassword && (
              <button
                type="button"
                className="absolute top-3 right-2"
                onClick={toggleRetypePasswordVisibility}
              >
                <FaEyeSlash />
              </button>
            )}
          </div>
        </div>
        {(passwordFocused ||
          (passwordRequirements &&
            passwordRequirements.passwordLength > 0 &&
            !(
              passwordRequirements.minLength &&
              passwordRequirements.uppercase &&
              passwordRequirements.lowercase &&
              passwordRequirements.number &&
              passwordRequirements.specialCharacter &&
              passwordRequirements.samePasswordRetype &&
              !passwordFocused
            ))) && (
          <div className="p-2 border border-gray-300 rounded-md">
            <ul>
              <li>
                {passwordRequirements.minLength ? '✅' : '-'} Password must be
                at least 8 characters long
              </li>
              <li>
                {passwordRequirements.uppercase ? '✅' : '-'} Contain at least
                one uppercase letter
              </li>
              <li>
                {passwordRequirements.lowercase ? '✅' : '-'} Contain at least
                one lowercase letter
              </li>
              <li>
                {passwordRequirements.number ? '✅' : '-'} Contain at one number
              </li>
              <li>
                {passwordRequirements.specialCharacter ? '✅' : '-'} Contain at
                least one special character: !@#$%^&*
              </li>
              <li>
                {passwordRequirements.samePasswordRetype ? '✅' : '-'} Password
                & Retype Password need to be the same
              </li>
            </ul>
          </div>
        )}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
          Sign Up
        </button>
      </form>
      <br></br>
      {saved && (
        <div>
          <Link href="/sign-in" className="px-5">
            <button className="bg-blue-500 text-white p-2 rounded-md">
              Password Changed! Return to Login
            </button>
          </Link>
        </div>
      )}
      {error && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md">
            <p className="text-red-500">{error}</p>
            <button
              onClick={closeErrorPopup}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
