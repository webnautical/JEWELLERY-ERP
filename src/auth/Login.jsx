import React, { useState } from 'react'
import loginillustration from '../assets/images/login.png'
import logo from '../assets/images/black-logo.png'
import { useLoginMutation } from '../api/auth/AuthAPI'
import { Navigate, useNavigate } from 'react-router-dom'
import { authUser, encryptLocalStorageData } from '../helper/Utility'

const Login = () => {
  const [login, { isLoading }] = useLoginMutation()
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '', api: '' }))
  }

  const validate = () => {
    const newErrors = {}

    if (!form.email.trim()) {
      newErrors.email = 'Email or mobile number is required.'
    } else {
      const isEmail  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
      const isPhone  = /^[0-9]{7,15}$/.test(form.email)
      if (!isEmail && !isPhone) {
        newErrors.email = 'Enter a valid email address or mobile number.'
      }
    }

    if (!form.password) {
      newErrors.password = 'Password is required.'
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    try {
      const res = await login({
        email: form.email,
        password: form.password,
      }).unwrap()

      if (res?.status) {
        console.log("res",res)
        const logedUserInfo = res?.data
        const commonKeys = {
          role: logedUserInfo?.role,
          token: res?.token,
        }
        const authUserInfo = {
          name: `${logedUserInfo?.firstName} ${logedUserInfo?.lastName}`,
          id: logedUserInfo?.id,
          email: logedUserInfo?.email,
          status: logedUserInfo?.status,
        }
        encryptLocalStorageData('web-secret', { ...commonKeys, ...authUserInfo }, 'DoNotTryToAccess')
        navigate('/dashboard')
      } else {
        setErrors({ api: res?.message || 'Something went wrong.' })
      }
    } catch (err) {
      setErrors({ api: err?.data?.message || 'Invalid credentials.' })
    }
  }

  const auth = authUser()
  if (auth || auth?.token) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="login-wrapper container-fluid">
      <div className="row min-vh-100">

        {/* LEFT SIDE */}
        <div className="col-lg-5 d-flex align-items-center justify-content-center bg-light">
          <div className="login-box w-100 px-4" style={{ maxWidth: '400px' }}>

            <div className="logo mb-4 text-center">
              <img width={150} src={logo} alt="" />
            </div>

            <h2 className="fw-bold mb-2 text-center">Welcome Back!</h2>
            <p className="text-muted text-center mb-4">
              Please enter log in details below
            </p>

            {/* API Error */}
            {errors.api && (
              <div className="alert alert-danger py-2 text-center" role="alert">
                {errors.api}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>

              {/* EMAIL */}
              <div className="mb-3 floating-group">
                <input
                  type="text"
                  name="email"
                  className={`form-control custom-input ${errors.email ? 'is-invalid' : ''}`}
                  placeholder=" "
                  value={form.email}
                  onChange={handleChange}
                />
                <label>Email address or mobile number</label>
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              {/* PASSWORD */}
              <div className="mb-3 floating-group position-relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className={`form-control custom-input pe-5 ${errors.password ? 'is-invalid' : ''}`}
                  placeholder=" "
                  value={form.password}
                  onChange={handleChange}
                />
                <label>Password</label>
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </span>
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 mb-3"
                disabled={isLoading}
              >
                {isLoading
                  ? <><span className="spinner-border spinner-border-sm me-2" />Signing in...</>
                  : 'Sign in'
                }
              </button>

            </form>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-lg-7 d-none d-lg-flex align-items-center justify-content-center right-panel">
          <div className="text-center text-white px-4">
            <img
              src={loginillustration}
              alt="illustration"
              className="img-fluid mb-4"
              style={{ maxWidth: '550px' }}
            />
            <h4 className="fw-bold">Manage your Money Anywhere</h4>
            <p className="opacity-75">
              you can Manage your Money on the go with Quickon on the web
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Login