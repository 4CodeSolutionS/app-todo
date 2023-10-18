/* eslint-disable no-inner-declarations */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Footer } from '../../../footer/Footer';
import { Header } from '../../../header/Header';
import styles from './Verify-Email.module.css';
import verificationImg from '../../../../assets/verification.png';
import rocketImg from '../../../../assets/rocket.svg';
import todoImg from '../../../../assets/todo.svg';
import { useLocation } from 'react-router';
import { useState } from 'react';
import { verifyEmailConfirm } from '../../../../utils/verify-email-confirm';

export function VerifyEmail(){
    const [block, setBlock] = useState<boolean>(false)
    
    const { search } = useLocation();

    const params = new URLSearchParams(search);
    const email = params.get('email') as string;
    const token = params.get('token');  

    

    async function verifyEmail(){
       try {
            const isEmailConfirmed = await verifyEmailConfirm(email)

            if(isEmailConfirmed){
                window.location.href = '/login';
            }

            await fetch(`https://api-todo-oe5w.onrender.com/api/users/verify-email?email=${email}&token=${token}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({})
            });
            setBlock(true)

            redirect().then((result)=>{
                if (result) {
                    window.location.href = '/login';
                    setBlock(false)
                }
            })
       } catch (error) {
        console.log(error)
       }
    }
    verifyEmail()

    async function redirect(){
        return new Promise((resolve) => {
            setTimeout(()=>{
            resolve(true)
        }, 5000)
    })
}
    return(
        <div className={block ? styles.container : styles.none}>
            <Header />
            <div className={styles['verification-content']}>
                <img src={verificationImg} alt="" />
                <strong>Verificação de E-mail Bem-Sucedida!</strong>
                <p>
                Parabéns! Seu e-mail foi verificado com sucesso. Agora você está pronto para aproveitar ao máximo nossa plataforma. Continue explorando e aproveitando todos os recursos que temos a oferecer. 
                </p>
                <span className={styles.icon}>
                 Equipe
                 <img src={rocketImg} alt="" />
                 <img src={todoImg} alt="" />
                </span>
            </div>
            <Footer />
        </div>
    )
}