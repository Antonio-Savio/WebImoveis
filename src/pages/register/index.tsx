import { useEffect, useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import logo from '../../assets/webimoveis-logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { auth } from '../../services/firebaseConnection'
import { createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth'
import toast from 'react-hot-toast'

const schema = z.object({
  name: z.string().min(1, 'O campo nome é obrigatório'),
  email: z.string().min(1, 'O campo email é obrigatório').email('Insira um email válido'),
  password: z.string().min(6, 'A senha deve ter ao menos 6 caracteres'),
})

type FormData = z.infer<typeof schema>

export function Register() {
  const { updateInfoUser } = useContext(AuthContext)
  const navigate = useNavigate();

    const { register, handleSubmit, formState: {errors} } = useForm<FormData>({
      resolver: zodResolver(schema),
      mode: "onChange",
    })

    useEffect(() => {
      async function handleLogOut() {
        await signOut(auth)
      }

      handleLogOut()
    }, [])


    function onSubmit(data: FormData){
      createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async (user) => {
        await updateProfile(user.user, {
          displayName: data.name
        })

        updateInfoUser({
          name: data.name,
          email: data.email,
          uid: user.user.uid
        })

        toast.success(`Bem vindo ao WebImóveis, ${data.name}!`)
        navigate('/dashboard', { replace: true })
      })
      .catch((error) => {
        console.log("Erro ao cadastrar este usuário");
        console.log(error);
        toast.error('Erro ao cadastrar conta')
      })
    }

    return (
      <div className='container'>
        <div className='w-full min-h-screen flex justify-center items-center flex-col gap-4'>
          <Link to='/'>
            <img 
              src={logo}
              alt="Logo do site"
              className='w-48'
            />
          </Link>

          <form
            className='bg-white max-w-xl w-full rounded-lg p-4'
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className='mb-3'>
              <input
                type='text'
                className='input'
                placeholder='Digite seu nome completo'
                {...register("name")}
              />
              {errors.name && <p className='errors'>{errors.name.message}</p>}
            </div>

            <div className='mb-3'>
              <input
                type='email'
                className='input'
                placeholder='Digite seu email'
                {...register("email")}
              />
              {errors.email && <p className='errors'>{errors.email.message}</p>}
            </div>

            <div className='mb-3'>
              <input
                type='password'
                className='input'
                placeholder='Digite sua senha'
                {...register("password")}
              />
              {errors.password && <p className='errors'>{errors.password.message}</p>}
            </div>
          
            <button className='bg-black w-full h-11 rounded-md text-white font-medium hover:opacity-90' type='submit'>
              Cadastrar
            </button>
          </form>

          <Link to='/login'>
            Já possui uma conta? Faça o login.
          </Link>

        </div>
      </div>
    )
}