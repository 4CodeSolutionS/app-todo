import { ChangeEvent, FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../../../header/Header'
import styles from './Login.module.css'
import { Footer } from '../../../footer/Footer';
import { env } from '../../../../env';

export interface IUser{
    email: string,
    password: string,
}

interface IResponseLoginUser{
    user: {
        id: string
        name: string,
        email: string,
        emailActive: boolean
        createdAt: string,
    },
    accessToken: string,
    refreshToken: string
}

export function Login(){
    const [loginUser, setLoginUser] = useState<IUser>({
        email: '',
        password: '',
    } as IUser)

    const navigate = useNavigate()
    
    //[x] criar metodo para enviar as informações de login para a API do backend
    async function handleLoginUser(event: FormEvent<HTMLFormElement>){
        try {
            event.preventDefault();        
            const responseLoginUser = await fetch(`${env.REACT_APP_API_URL}/users/login`,{
                body: JSON.stringify(
                    {
                        email: loginUser.email,
                        password: loginUser.password
                    }
                ),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            setLoginUser({
                email: '',
                password: '',
            })

            const data = await responseLoginUser.json() as unknown as IResponseLoginUser
            if(responseLoginUser.status === 401){
                alert('E-mail ou senha incorretos')
                return
            }
            
            if(data.user.emailActive === false ){
                alert('Lembrete: Por favor, verifique seu e-mail e confirme seu endereço para ativar sua conta.')
                return
            }

            //[x] armazenar accessToken, refreshToken e user.id no localStorage
            localStorage.setItem('accessToken', data.accessToken)
            localStorage.setItem('refreshToken', data.refreshToken)
            localStorage.setItem('idUser', data.user.id)
            //[x] redirecionar para a página de tarefas
            navigate("/")
        } catch (error) {
            console.log(error)
        }
    }
    //[x] criar metodo para receber os dados do formulário
    function handleOnChange(event: ChangeEvent<HTMLInputElement>){
        const {name, value} = event.target

        setLoginUser({
            ...loginUser,
            [name]: value
        })
    }

    return(
    <div className={styles.container}>
            <Header/>
            <main className={styles['main-content']}>
            <div className={styles['form-center']}>
                <form 
                className={styles.form} 
                id="register-account" 
                onSubmit={handleLoginUser}
                >
                    <fieldset className={styles.fieldset} form='register-account' name='group-register'>
                        <span className={styles.title}><p>Conectar-se</p></span>

                        <label htmlFor="email">E-mail</label>
                        <input id={styles['space-down']}type="text" value={loginUser.email} onChange={handleOnChange} name="email" required placeholder='example@email.com' />
                    
                        <label htmlFor="password">Senha</label>
                        <input type="password" value={loginUser.password} onChange={handleOnChange} name="password" required placeholder='Digite sua senha' />
                        <Link to="/forgot-password">Esqueceu a senha?</Link>

                    </fieldset>
                    <footer className={styles.footer}>
                    <button type='submit'>Entrar</button>
                    <span>
                        <p>
                            Não possui cadastro?
                        </p>
                        <Link to="/register">fazer cadastro</Link>
                    </span>
                    </footer>
                </form>
            </div>
            </main>
            <Footer />
    </div>
    )
}