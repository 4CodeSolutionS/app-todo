import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Footer } from '../../../footer/Footer';
import { Header } from '../../../header/Header';
import styles from './Reset-Password.module.css';
import { ChangeEvent, FormEvent, useState } from 'react';
import verificationImg from '../../../../assets/verification.png'

export interface IUser{
    password: string,
    confirmPassword:string
}

export function ResetPassword() {
    const [block, setBlock] = useState<boolean>(false)
    const [message, setMessage] = useState<boolean>(false)
    
    const { search } = useLocation();

    const navigate = useNavigate()

    const params = new URLSearchParams(search);
    const token = params.get('token'); 
     
    
    function blockScree(){
    const tokebResetPassword = localStorage.getItem('tokenResetPassword')
        if(!token){
            setBlock(true)
            window.location.href = "/login"
        }
        if(tokebResetPassword === token){
            // setBlock(true)
            // window.location.href = "/login"
        }
        
    }
    blockScree()
    

    //[x] criar estado para armazenar os dados do formulário
    const [resetPassword, setResetPassword] = useState<IUser>({
        password: '',
        confirmPassword: ''
    } as IUser)

    async function handleResetPassword(event: FormEvent<HTMLFormElement>){
        try {
            event.preventDefault();
           
            // console.log(process.env.API_URL)

            const responseResetPassword = await fetch(`${import.meta.env.VITE_API_URL}/users/reset-password?token=${token}`,{
                body: JSON.stringify(
                    {
                        password: resetPassword.password
                    }
                ),
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(!responseResetPassword.ok) throw new Error()
            localStorage.setItem('tokenResetPassword', token as string)
        
            setResetPassword({
                password: '',
                confirmPassword: ''
            })
            await responseResetPassword.json()
            setMessage(true)
            //[x] redirecionar para a página de login
            redirect().then((result)=>{
                if (result) {
                    navigate("/login")
                }
            })
        } catch (error) {
            navigate('/login')
        }
    }
    async function redirect(){
        return new Promise((resolve) => {
            setTimeout(()=>{
            resolve(true)
            }, 3000)
        })
    }
     //[x] criar metodo para receber os dados do formulário
     function handleOnChange(event: ChangeEvent<HTMLInputElement>){
        const {name, value} = event.target

        setResetPassword({
            ...resetPassword,
            [name]: value
        })
    }

    
  return (
    <div className={block ? styles.none : styles.container}>
        <Header />
        <main className={styles['main-content']}>
        <div className={message ? styles['verification-content'] : styles.none}>
                <img src={verificationImg} alt="" />
                <strong>Senha Redefinida com Sucesso!</strong>
                <p>
                Sua senha foi redefinida com sucesso. Agora você pode fazer login com sua nova senha. 
                </p>
            </div>
        <form 
        id={message ? styles.none : styles['fomr-class'] }
        action="" 
        onSubmit={handleResetPassword}>
            <fieldset>
            <div className={styles['title-content']}>
                <span>Redefinir sua senha</span>

                <p>
                    Mínimo de 8 caracteres, incluindo letras maiúsculas e minúsculas.
                </p> 
                    
            </div>
                <label htmlFor="password">Senha</label>
                <input type="password" value={resetPassword.password} onChange={handleOnChange}  name="password" id="password" required placeholder='Digite sua senha' />

                <label htmlFor="confirmPassword">Confirmar senha</label>
                <input type="password" onChange={handleOnChange} value={resetPassword.confirmPassword} pattern={resetPassword.password}  title='A senha e a confirmação de senha não coincidem. Por favor, tente novamente' name="confirmPassword" id="confirmPassword" required placeholder='Confirme sua senha' />
            </fieldset>
            <footer>
                <Link to="/login">
                    <button type='button'>Cancelar</button>
                </Link>
                <button type='submit'>Confirmar</button>
            </footer>
        </form>
        </main>
        <Footer />
    </div>
  );
}  