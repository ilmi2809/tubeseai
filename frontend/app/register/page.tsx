'use client'
import React, { useState } from 'react'
import { useMutation, gql } from '@apollo/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const REGISTER_USER = gql`
  mutation RegisterUser($input: RegisterInput!) {
    registerUser(input: $input) {
      token
      user {
        id
        name
        email
      }
    }
  }
`

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  })

  const [registerUser, { loading, error }] = useMutation(REGISTER_USER, {
    onCompleted: (data) => {
      if (data?.registerUser?.token) {
        localStorage.setItem('token', data.registerUser.token)
        router.push('/dashboard')
      }
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    registerUser({ variables: { input: formData } })
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit}>
        {['name', 'email', 'password', 'phone', 'address', 'city', 'state', 'zip', 'country'].map((field) => (
          <input
            key={field}
            name={field}
            type={field === 'password' ? 'password' : 'text'}
            placeholder={field}
            onChange={handleChange}
            className="w-full p-2 my-2 border rounded"
            required
          />
        ))}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded w-full mt-4"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
        {error && <p className="text-red-600 mt-2">{error.message}</p>}
        <div className="text-center text-sm mt-4">
          Sudah punya akun? <Link href="/" className="text-blue-600 hover:underline">Login</Link>
        </div>
      </form>
    </div>
  )
}
