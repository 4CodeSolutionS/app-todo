/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import styles from './Create.module.css'
import { Header } from "../../../header/Header";
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Item } from '../../../item/Item';
import { verifyRefreshToken } from '../../../../utils/verify-refresh-token';
import { getAccessToken } from '../../../../utils/get-access-token';
import clipBoard from '../../../../assets/clipboard.svg'
import logoutImg from '../../../../assets/logout.png';
import hamburgerImg from '../../../../assets/hamburger.png';
import { Loader } from '../../../loader/Loader';
import { Footer } from '../../../footer/Footer';
import { useNavigate } from 'react-router';


interface ITodo{
    id: string,
    idUser: string,
    description: string,
    completed: boolean,
    createdAt: string,
}

interface IDescription{
    description: string
}


export function Create(){
    //[x] criar estado para armazenar a descrição da tarefa
    const [descriptionTodo, setDescriptionTodo] = useState<IDescription>({
        description: ''
    } as IDescription)
    
    const navigate = useNavigate()

    const [block, setBlock] = useState<boolean>(false)

    //[x] criar estado para armazenar a lista de tarefas
    const [todos, setTodos] = useState<ITodo[]>([])

    const [countAllTodos, setCountAllTodos] = useState<number>(0)

    const [countCompletedTodos, setCountCompletedTodos] = useState<number>(0)

    const [menu, setMenu] = useState<boolean>(false)

    function handleMenu(){
        const element = document.getElementById('select-mobile') as HTMLElement;

        if(!menu){
            element.style.display = 'block'
            setMenu(true)
            return
        }
        element.style.display = 'none'
        setMenu(false)

    }

    //[x] criar metodo para enviar as informações para a API do backend
    async function handleCreateTodo(event: FormEvent<HTMLFormElement>){
        try {
            event.preventDefault();
            // console.log(process.env.API_URL)

            const responseCreateTodo = await fetch(`${import.meta.env.VITE_API_URL}/todos`,{
                body: JSON.stringify(
                    {
                        description: `${descriptionTodo.description}`
                    }
                ),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            })
            setDescriptionTodo({
                description: ''
            })
            await responseCreateTodo.json()

        } catch (error) {
            console.log(error)
        }
    }
  
    function handleOnChange(event: ChangeEvent<HTMLInputElement>){
        const {name, value} = event.target

        setDescriptionTodo({
            ...descriptionTodo,
            [name]: value
        })
    }

    async function handleLogout(){
        await fetch(`${import.meta.env.VITE_API_URL}/users/logout`,{
            body: JSON.stringify(
                {
                    refreshToken: `${localStorage.getItem('refreshToken')}`
                }
            ),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        navigate("/login")
    }

    useEffect(()=>{
        setBlock(true)
        async function checkTokenOn(){
        const isValidRefreshToken = await verifyRefreshToken()
            if(!isValidRefreshToken){
                navigate("/login")
            }
        }

        async function loadTodos(){
            const token = await getAccessToken()
           try {
                const responseListTodo = await fetch(`${import.meta.env.VITE_API_URL}/todos/user`,{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                const data = await responseListTodo.json()

                //[x] colocar a lista de todos no estado
                setTodos(data)
              
           } catch (error) {
            navigate("/login")
           }
        }

        async function loadCountAllTodos(){
            const token = await getAccessToken()
            const responseCountAllTodo = await fetch(`${import.meta.env.VITE_API_URL}/todos/count-all`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            const data = await responseCountAllTodo.json()

            setCountAllTodos(data.count)
        }

        async function loadCountCompletedTodos(){
            const token = await getAccessToken()
            const responseCountAllTodo = await fetch(`${import.meta.env.VITE_API_URL}/todos/count-ready`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            const data = await responseCountAllTodo.json()

            setCountCompletedTodos(data.count)
        }
    
        checkTokenOn()
        loadTodos()
        loadCountAllTodos()
        loadCountCompletedTodos()
    }, [countAllTodos, todos, countCompletedTodos])

    
    return(
        <div className={block ? styles.container : styles.none}>
            <Header />
            <Loader />
            <div className={styles['main-content']}>
                <div className={styles.hamburguer} onClick={handleMenu}>
                    <img src={hamburgerImg} alt="" />
                </div>
                <div id='select-mobile' className={styles['navbar-mobile']}>
                    <div onClick={handleLogout}>
                    <img src={logoutImg} alt="" /> 
                    <span>Sair</span>
                    </div>
                </div>
                <div className={styles.logout} onClick={handleLogout}>
                    <img src={logoutImg} alt="" />
                    Sair
                </div>
                <form 
                action=""
                className={styles.form}
                id="create-todo"
                onSubmit={handleCreateTodo}
                >
                    <fieldset className={styles.fieldset}>
                        <input type="text" value={descriptionTodo.description} onChange={handleOnChange} id="description" name="description" required placeholder='Adicionar uma nova tarefa' />
                    </fieldset>
                    <footer className={styles.footer}>
                        <button className={styles.btnCriar} type="submit">Criar</button>
                    </footer>
                </form>

                <div className={styles.title}>
                    <div>
                        Tarefas Criadas <span>{countAllTodos}</span>
                    </div>
                    <span>{countCompletedTodos} de {countAllTodos}</span>
                </div>
            
                <div className={todos.length > 0 ? styles['container-off'] : styles['container-title']}>
                    <div>
                        <img src={clipBoard} alt="" />
                    </div>

                    <p><strong>Você ainda não tem tarefas cadastradas</strong></p>
                    <p>Crie tarefas e organize seus itens a fazer</p>
                </div>

                <div className={styles.listTodos}>
                    {  
                        todos.map((todo)=>{
                            return(
                                <Item 
                                key={todo.id}
                                id={todo.id}
                                description={todo.description}
                                completed={todo.completed}
                                />
                            )
                        })
                    }
                </div>
            </div>
            <Footer />
        </div>
    )
}