import axios from 'axios'

export default axios.create({
    baseURL: 'https://react-quiz-75217.firebaseio.com/'
})