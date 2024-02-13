import { useState, useEffect } from "react";
import axios from "axios";
import styles from './Question.module.css'
const Question = () => {


    // 문의에 대한 답변과 답변 입력창, 후기데이터를 받을 question을 선언
    const [response, setResponse] = useState('');
    const [isOpenList, setIsOpenList] = useState([]);
    const [question, setQuestion] = useState([{
        questionid: '',
        userid : '',
        prodid : '',
        content : '',
        response: ''        
    }]);

    // 포트 8000번의 questino 경로에서 답변 데이터를 받아와서 mapping한 rawData를 question의 값으로 합니다
    useEffect(() => {
        async function readQuestion () {
            const responses = await axios.get('http://localhost:8000/question', {})
            const rawData = await responses.data.map((response) => ({
                questionid : response.questionid,
                userid: response.userid,
                prodid : response.prodid,
                content: response.content,
                response: response.response
            }))
            setQuestion(rawData);
        }
        readQuestion();
    }, [])


    // 답변이 달린 문의에 대해선 답변 입력창이 열리지 않게 하기 위한 코드입니다
    // 문의글을 클릭하면 해당 문의의 index에 따라 newState[index]의 값이 true,false로 변하고 그 값을 isOpenlist의 값으로 합니다
    const handleToggle = (index) => {
        setIsOpenList((prev) => {
            const newState = [...prev]
            newState[index] = !newState[index];
            return newState;
        })
    }


    
    // 문의에 대한 답변과 답변을 업데이트하는 과정에서 문의글을 찾는 지표가 될 questionid를 question경로로 업데이트 합니다
    // headers 부분은 클라이언트 단에서 서버단으로 요청을 보낼 때 데이터의 형식을 정해주는 코드입니다
    const addResponse = (index) => {
        console.log(response, question[index].questionid)
        axios.put('http://localhost:8000/question', {
            response: response,
            questionid: question[index].questionid
        }, { // application/json 타입 선언
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(()=> {
            console.log("success");
        }).catch((err) => {
            console.log(err);
        })
    }


    // useEffect(() => {
    //     console.log(question)
    //     console.log(isOpenList)
    // }, [question, isOpenList])

    return(
        <div>
            <div>
                {question.map((it, index) => (
                    <div key={it.questionid} >
                        <div onClick={()=>handleToggle(index)} className={styles.questionitems}>
                            <p>{it.userid}</p>
                            <p>{it.content}</p>
                        </div>
                        {/* 문의에 대한 답변이 있다면 해당 답변을 렌더링하고 isOpenlist에 값에 상관없이 입력창이 뜨지 않습니다
                        한편, 답변이 없는 문의 글을 클릭하면 답변입력창이 뜨고 답변을 입력하고 입력버튼을 누르면 해당 내용이 서버에 업데이트 됩니다 */}
                        {it.response ?  
                        <div>
                            {it.response}
                        </div> 
                        :                        
                        <div className={isOpenList[index] ? styles.show_menu : styles.hide_menu}>
                            <input onChange={(e) => setResponse(e.target.value)}/>
                            <button onClick={() => addResponse(index)}>입력</button>                        
                        </div>
                        }                         
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Question;