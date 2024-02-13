import { useState, useEffect } from "react";
import axios from 'axios';
import styles from './Review.module.css';
import { Rate } from 'antd';

// const desc = ["1점", "2점", "3점", "4점", "5점"]

const Review = () => {

    // 평점과 후기 변수
    // const [value, setValue] = useState(3);
    const [point, setPoint] = useState(1);
    const [reviews, setReviews] = useState([{
        id: '',
        userid: '',
        oderid: '',
        title: '',
        content: '',
        img: '',
        rate: '',
        date: ''
    }]);

    // review 데이터를 불러와서 mapping하고 review의 값으로 합니다
    useEffect(() => {
        async function readReview () {
            const responses = await axios.get('http://localhost:8000/review', {})
            const rawData = await responses.data.map((response) => ({
                id: response.reviewId,
                userid: response.userId,
                oderid: response.oderId,
                title: response.title,
                content: response.content,
                img: response.img,
                rate: response.rate,
                date: response.rDate
            }))
            setReviews(rawData)
        }
        readReview();
    }, [])

    // const hadleChange = (value) => {
    //     var sum = 0;
    //     for (var i=0; i < reviews.length; i++) {
    //         sum += reviews[i].rate
    //     }
    //     setValue(sum/(reviews.length));
    // }

    // 해당 리뷰의 평점 부분들의 합을 sum으로 하고 이를 reviews.length로 나누어 평균 평점을 냅니다
    useEffect (() => {
        const reviewPoint = () => {
            var sum = 0;
            for (var i = 0; i < reviews.length; i++) {
                sum += reviews[i].rate
            }
            setPoint(sum/(reviews.length))
        }
        reviewPoint();
        console.log(reviews)
    },[reviews])
    
    return (
        <div>
            <div>
                구매만족도
                {/* <span>
                    <Rate onChange={hadleChange} value={value} />
                    <span>{desc[value-1]}</span>
                </span> */}
                <p>{point}/5</p>
            </div>
            {reviews && reviews.map((review) => (
                <div key={review.id} className={styles.reviewitem}>
                    <div className={styles.userinfo}>
                        <p>{review.userid}님</p>
                        <p>평점: {review.rate}</p>
                    </div>
                    <div className={styles.reviewcontent}>
                        {review.img ? <img src={review.img} alt='이미지' className={styles.reviewimg} /> : ''}
                        <div className={styles.items}>
                            <p className={styles.itemtitle}>{review.title}</p>
                            <p className={styles.itemcontent}>{review.content}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Review;