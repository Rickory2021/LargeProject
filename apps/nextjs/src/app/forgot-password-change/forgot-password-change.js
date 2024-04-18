'use client'
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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordHovered, setConfirmPasswordHovered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    uppercase: false,
    lowercase: false,
    specialCharacter: false,
  });
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      setError('Entered password does not meet validation requirements!');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    try {
      const res = await fetch(
        `https://slicer-backend.vercel.app/api/auth/user/reset-password?token=${token}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        }
      );
      if (res.ok) {
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
      setError(
        'An unexpected error occurred. Please try again later. ' + error
      );
    }
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    const newPasswordRequirements = {
      minLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      specialCharacter: /[!@#$%^&*]/.test(password),
    };
    setPasswordRequirements(newPasswordRequirements);
    return passwordRegex.test(password);
  };

  const closeErrorPopup = () => {
    setError('');
  };

  const handlePasswordFocus = () => {
    setPasswordFocused(true);
  };

  const handlePasswordBlur = () => {
    setPasswordFocused(false);
  };

  const handleConfirmPasswordHover = () => {
    setConfirmPasswordHovered(true);
  };

  const handleConfirmPasswordLeave = () => {
    setConfirmPasswordHovered(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (passwordFocused) {
      validatePassword(e.target.value);
    }
    setPasswordsMatch(e.target.value === confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordsMatch(e.target.value === password);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen pb-16">
      <h1 className="text-4xl font-bold mb-8">Reset Password</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          onFocus={handleConfirmPasswordHover}
          onBlur={handleConfirmPasswordLeave}
          className="p-2 border border-gray-300 rounded-md"
        />
        {(passwordRequirements && (passwordFocused || confirmPasswordHovered)) && (
          <div className="flex p-2 border border-gray-300 rounded-md">
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
                {passwordRequirements.specialCharacter ? '✅' : '-'} Contain
                at least one special character: !@#$%^&*
              </li>
              <li>
                {(passwordsMatch && password.length > 0)? '✅' : '-'} Passwords Match
              </li>
            </ul>
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md"
        >
          Sign Up
        </button>
      </form>
      <br />
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