
import React from 'react'
import { useAuth } from '../lib/useAuth';

const Settings = () => {
  const { user } = useAuth();
  return (
    <div>Settings</div>
  )
}

export default Settings