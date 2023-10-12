import { useEffect, useState } from 'react';
import styles from './Loader.module.css';
import loadingImg from '../../assets/loading.png';

export function Loader(){
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simule uma operação de carregamento
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }, []);
    return(
        <div className={loading ? styles.loader : ''}>
            <img src={loading ? loadingImg: ''} alt="" />
        </div>
    )
}