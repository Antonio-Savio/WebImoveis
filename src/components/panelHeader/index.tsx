import { Link } from "react-router-dom";
import { auth } from '../../services/firebaseConnection'
import { signOut } from "firebase/auth";
import { IoMdExit } from "react-icons/io";

export function DashboardHeader(){
    
    async function handleLogout(){
        await signOut(auth);
    }

    return(
        <div className="w-full flex items-center gap-4 h-10 bg-main rounded-lg text-white font-medium px-4 mb-4">
            <Link to='/dashboard'>
                Dashboard
            </Link>

            <Link to='/dashboard/new'>
                Cadastrar imóvel
            </Link>

            <button className="ml-auto hidden sm:block" onClick={handleLogout}>
                Sair da conta
            </button>

            <button className="ml-auto hover:text-red-500 transition-all sm:hidden" onClick={handleLogout}>
                <IoMdExit size={22} />
            </button>
        </div>
    )
}