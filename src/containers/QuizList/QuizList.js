import React, { Component } from 'react'
import classes from './QuizList.module.css'
import { NavLink } from 'react-router-dom'
import axios from '../../axios/axios.config'
import Loader from '../../components/UI/Loader/Loader'

export default class QuizList extends Component {

    state = {
        quizes: [],
        loading: true
    }

    renderQuizes() {
        return this.state.quizes.map(quiz => {
            return (
                <li
                    key={quiz.key}
                >
                    <NavLink to={'/quiz/' + quiz.key}>
                        { quiz.name }
                    </NavLink>
                </li>
            )
        })
    }

    async componentDidMount() {
        try{
            const response = await axios.get('/quizes.json')
            const quizes = []

            Object.keys(response.data).forEach((item) => {
                axios.get(`/quizes/${item}/testName/0.json`)
                .then(response => { 
                    quizes.push({
                        key: item,
                        name: response.data
                    })

                    this.setState({
                        quizes,
                        loading: false
                    })
                })
                .catch(err => {console.log(err)})


            })
        } catch (e) {
            console.log(e)
        }
        
    }

    render() {
        return (
            <div className={classes.QuizList}>
                <h1>Список тестов</h1>
                { 
                    this.state.loading ? <Loader/> :
                    <ul>
                        { this.renderQuizes() }
                    </ul>
                }
            </div>
        )
    }
}