import React, { Component } from 'react'
import classes from './Quiz.module.css'
import ActiveQuiz from '../../components/ActiveQuiz/ActiveQuiz'
import FinishedQuiz from '../../components/FinishedQuiz/FinishedQuiz'
import axios from '../../axios/axios.config'
import Loader from '../../components/UI/Loader/Loader'

export default class Quiz extends Component {
    state = {
        results: {}, // { [id]: 'success' || 'error' }
        isFinished: false,
        activeQuestion: 0,
        answerState: null, // { [id]: 'success' || 'error' }
        loading: true,
        quiz: [
            {
                question: 'Kакого цвета небо?',
                rightAnswerId: 2,
                id: 1,
                answers: [
                    {text: 'Черный', id: 1},
                    {text: 'Синий', id: 2},
                    {text: 'Красный', id: 3},
                    {text: 'Белый', id: 4}
                ]   
            }
            // {
            //     question: 'В каком году основали СПб?',
            //     rightAnswerId: 3,
            //     id: 2,
            //     answers: [
            //         {text: '1700', id: 1},
            //         {text: '1705', id: 2},
            //         {text: '1703', id: 3},
            //         {text: '1803', id: 4}
            //     ]   
            // }
        ]
    }

    onAnswerClickHandler = (answerId) => {
        if (this.state.answerState) {
            const key = Object.keys(this.state.answerState)[0]
            if (this.state.answerState[key] === 'success') {
                return
            }
        }


        console.log('Answer id: ', answerId)

        const question = this.state.quiz[this.state.activeQuestion]
        const results = this.state.results

        if (question.rightAnswerId === answerId) {
            if (!results[question.id]) {
                results[question.id] = 'success'
            }

            this.setState({
                answerState: {[answerId]: 'success'},
                results
            })

            const timeout = window.setTimeout(() => {
                if (this.isQuizFinished()) {
                    this.setState({
                        isFinished: true
                    })
                } else {
                    this.setState({
                        activeQuestion: this.state.activeQuestion + 1,
                        answerState: null
                    })
                }
                window.clearTimeout(timeout)
            }, 1000)



        } else {
            results[question.id] = 'error'
            this.setState({
                answerState: {[answerId]: 'error'},
                results
            })
        }
    }

    isQuizFinished() {
        return this.state.activeQuestion + 1 === this.state.quiz.length
    }

    onRepeatHandler = () => {
        this.setState({
            activeQuestion: 0,
            answerState: null,
            isFinished: false,
            results: {}
        })
    }

    async componentDidMount() {
        try {
            const response = await axios.get(`/quizes/${this.props.match.params.id}/quizes.json`)
            const quiz = response.data
            console.log(quiz)
            this.setState({
                quiz,
                loading: false
            })

        } catch(e) {
            console.log(e)
        }
    }

    render() {
        return (
            <div className={classes.Quiz}>
                <div className={classes.QuizWrapper}>
                    <h1>Ответьте на все вопросы</h1>
                    {
                        this.state.loading ? <Loader /> :
                        this.state.isFinished ?
                        <FinishedQuiz 
                            results={this.state.results}
                            quiz={this.state.quiz}
                            onRepeat={this.onRepeatHandler}
                        /> :
                        <ActiveQuiz 
                        answers={this.state.quiz[this.state.activeQuestion].answers}
                        question={this.state.quiz[this.state.activeQuestion].question}
                        onAnswerClick={this.onAnswerClickHandler}
                        quizLength={this.state.quiz.length}
                        answerNum={this.state.activeQuestion + 1}
                        state={this.state.answerState}
                    />
                    }
                </div>
            </div>
        )
    }
}