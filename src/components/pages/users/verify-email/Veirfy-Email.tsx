/* eslint-disable no-inner-declarations */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Footer } from '../../../footer/Footer';
import { Header } from '../../../header/Header';
import styles from './Verify-Email.module.css';
import verificationImg from '../../../../assets/verification.png';
import { useLocation, useNavigate } from 'react-router';

export function VerifyEmail(){
    const { search } = useLocation();

    const navigate = useNavigate()

    const params = new URLSearchParams(search);
    const email = params.get('email') as string;
    const token = params.get('token');  

    async function verifyEmail(){
       try {
            await fetch(`${import.meta.env.VITE_API_URL}/users/verify-email?email=${email}&token=${token}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({})
            });

            async function redirect(){
                return new Promise((resolve) => {
                    setTimeout(()=>{
                    resolve(true)
                    }, 3000)
                })
            }

        redirect().then((result)=>{
            if (result) {
                navigate("/login")
            }
        })

       } catch (error) {
        console.log(error)
       }
    }
    verifyEmail();

    return(
        <div className={styles.container}>
            <Header />
            <div className={styles['verification-content']}>
                <img src={verificationImg} alt="" />
                <strong>Verificação de E-mail Bem-Sucedida!</strong>
                <p>
                Parabéns! Seu e-mail foi verificado com sucesso. Agora você está pronto para aproveitar ao máximo nossa plataforma. Continue explorando e aproveitando todos os recursos que temos a oferecer. 
                </p>
            </div>
            <Footer />
        </div>
    )
}