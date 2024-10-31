import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import logo from '../../assets/webimoveis-logo.png'
import { Link } from 'react-router-dom'
import { FiUser, FiLogIn } from 'react-icons/fi'

export function Header() {
  const {user, signed, loadingAuth} = useContext(AuthContext)

  return (
    <div className='w-full h-16 bg-white drop-shadow flex justify-center items-center mb-4'>
      <header className='w-full max-w-7xl flex items-center justify-between px-4 mx-auto'>
        <Link to="/">
          <img 
            src={logo}
            alt="Logo do site"
            className='w-24'
          />
        </Link>

        {!loadingAuth && signed && (
          <div className='flex items-center gap-2'>
            <div className='text-right text-[10px] xs:text-xs text-gray-700 whitespace-nowrap max-w-32 xs:max-w-60 overflow-hidden'>
              <div>{user?.name}</div>
              <div className='text-[8px] xs:text-[10px] text-gray-400'>{user?.email}</div>
            </div>

            <Link to='/dashboard' className='border-2 rounded-full p-1 border-gray-900'>
              <FiUser size={24} color='#000' />
            </Link>
          </div>
        )}

        {!loadingAuth && !signed && (
          <Link to='/login' className='border-2 rounded-full p-1 border-gray-900'>
            <FiLogIn size={24} color='#000' />
          </Link>
        )}
      </header>
    </div>
  )
}