import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from 'axios';
import styles from './Product.module.css'
import Review from '../components/Review';
import Shipping from '../components/Shipping';
import Question from "../components/Question";


const Product = () => {
    const { id } = useParams();

    const [products, setProducts] = useState([{
        id: '',
        name: '',
        description: '',
        price: ''
    }])

    // url의 id와 상품코드가 일치하는 데이터를 inputData로 하고 이를 mapping 하여 product 값으로 합니다
    useEffect(() => {
        async function resData() {
            const responses = await axios.get("http://localhost:8000/shop", {})
            const inputData = await responses.data.filter((it) => it.productCode === id)
            const product = await inputData.map((it) => ({
                id: it.productCode,
                name: it.productName,
                description: it.productDescription,
                price: it.buyPrice
            }))
            setProducts(product);        
        }
        resData();
    }, [id])

    // products 안에 데이터가 존재한다면 해당 데이터에서의 price를 total의 값으로 합니다
    useEffect(() => {
        console.log(products);
        if (products.length > 0) {
            setTotal(parseInt(products[0].price));
        } else {
            setTotal(0);
        }
    }, [products])
    
    // 상품수량과 총가격
    const [quantity, setQuantity] = useState(1);
    const [total, setTotal] = useState(0);

    // 클릭함에 따라 quantity와 total의 값이 바뀝니다
    const handleClickCounter = (num) => {
        setQuantity(quantity + num);
        setTotal(total + parseInt(products[0].price)*num);
    };

    // input창의 수량에 따라 quantity와 total 값이 정해집니다
    const handleChangeInput = (e) => {
        let newValue = parseInt(e.target.value)
        if (!isNaN(newValue) && newValue >=1 ) {
        setQuantity(newValue)
        setTotal(parseInt(products[0].price)*newValue)
        }
        console.log('sdf')
    }

    useEffect(() => {
        console.log(quantity)
    },[quantity])

    
    return (
        <div className={styles.container}>
            <p>{id} 상세페이지</p>
            <p>{products[0].name}</p>
            <p>{products[0].price}</p>
            <div className={styles.counter}>
                <button type="button" onClick={() => handleClickCounter(-1)} disabled={quantity === 1}>-</button>
                <input 
                type="number" 
                min={1} 
                value={quantity} 
                className={'inputnumber'} 
                onBlur={handleChangeInput}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                />
                <button type="button" onClick={() => handleClickCounter(+1)}>+</button>
            </div>
            <div className={`price`}>
                <strong>{total.toLocaleString()} 원</strong>
            </div>
            <div>
                <ul className={styles.nav_container}>
                    <li>상품 상세</li>
                    <li>상품평</li>
                    <li>상품 문의</li>
                    <li>배송/교환/반품 안내</li>
                </ul>
            </div>
            <div className={styles.productdetail}>
                <img src={'https://onlyeco.co.kr/web/upload/NNEditor/20230627/dddd.jpg'} alt='사진' />
            </div>
            <div>
                <ul className={styles.nav_container}>
                    <li>상품 상세</li>
                    <li>상품평</li>
                    <li>상품 문의</li>
                    <li>배송/교환/반품 안내</li>
                </ul>
            </div>
            <Review />
            <div>
                <ul className={styles.nav_container}>
                    <li>상품 상세</li>
                    <li>상품평</li>
                    <li>상품 문의</li>
                    <li>배송/교환/반품 안내</li>
                </ul>
            </div>
            상품문의
            <Question />
            <div>
                <ul className={styles.nav_container}>
                    <li>상품 상세</li>
                    <li>상품평</li>
                    <li>상품 문의</li>
                    <li>배송/교환/반품 안내</li>
                </ul>
            </div>
            <Shipping />
        </div>
    )
}

export default Product;