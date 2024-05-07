import React, { useEffect, useState } from 'react';
import { addToDb, deleteShoppingCart, getShoppingCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';
import { Link, useLoaderData } from 'react-router-dom';

const Shop = () => {
            const carts = useLoaderData()

    const [products, setProducts] = useState([]);
    
    const [itemPerPage,setItemPerPage]=useState(10)
    const [currentPage,setCurrentPage]=useState(0)
    const [count , setCount] = useState(10)
    const [cart,setCart]=useState(carts)

            //  const [cart, setCart] = useState([])
     
    // const {count} = useLoaderData()
    useEffect(()=>{
        fetch('http://localhost:5000/productsCount')
        .then(res=>res.json())
        .then(data=>setCount(data.count))
    },[])



    const numberOfPages = Math.ceil(count/itemPerPage)
    const pages = [...Array(numberOfPages).keys()]

    const handleOnChange = e =>{
        const data = parseInt(e.target.value);
        setItemPerPage(data)
        setCurrentPage(0)
        console.log(data);
    }

    const handlePrev=()=>{
        if(currentPage>0){
           setCurrentPage(currentPage-1)
        }
    }
    const handleNext=()=>{
        if(currentPage<pages.length-1){
           setCurrentPage(currentPage+1)
        }
    }

    console.log(pages);

    // const pages = [];
    // for(let i = 0 ; i<numberOfPages ; i++){
    //     pages.push(i)
    // }
    // console.log(pages);

    useEffect(() => {
        fetch(`http://localhost:5000/products?currentPage=${currentPage}&size=${itemPerPage}`)
            .then(res => res.json())
            .then(data => setProducts(data))
    }, [currentPage,itemPerPage]);




        // useEffect(() => {
        //     const storedCart = getShoppingCart();
        //     const savedCart = [];
        //     // step 1: get id of the addedProduct
        //     for (const id in storedCart) {
        //         // step 2: get product from products state by using id
        //         const addedProduct = products.find(product => product._id === id)
        //         if (addedProduct) {
        //             // step 3: add quantity
        //             const quantity = storedCart[id];
        //             addedProduct.quantity = quantity;
        //             // step 4: add the added product to the saved cart
        //             savedCart.push(addedProduct);
        //         }
        //         // console.log('added Product', addedProduct)
        //     }
        //     // step 5: set the cart
        //     setCart(savedCart);
        // }, [products])

    const handleAddToCart = (product) => {
        // cart.push(product); '
        let newCart = [];
        // const newCart = [...cart, product];
        // if product doesn't exist in the cart, then set quantity = 1
        // if exist update quantity by 1
        const exists = cart.find(pd => pd._id === product._id);
        if (!exists) {
            product.quantity = 1;
            newCart = [...cart, product]
        }
        else {
            exists.quantity = exists.quantity + 1;
            const remaining = cart.filter(pd => pd._id !== product._id);
            newCart = [...remaining, exists];
        }

        setCart(newCart);
        addToDb(product._id)
    }

    const handleClearCart = () => {
        setCart([]);
        deleteShoppingCart();
    }

    return (
        <div className='shop-container'>
            <div className="products-container">
                {
                    products.map(product => <Product
                        key={product._id}
                        product={product}
                        handleAddToCart={handleAddToCart}
                    ></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart
                    cart={cart}
                    handleClearCart={handleClearCart}
                >
                    <Link className='proceed-link' to="/orders">
                        <button className='btn-proceed'>Review Order</button>
                    </Link>
                </Cart>
            </div>
            <div className='pagination'>
                <p>Current Page = {currentPage  }</p>  
                <button onClick={handlePrev}>Prev</button> 
                {
                    pages.map(p=> <button
                    className={currentPage===p ? "pageButton" : ''}
                        onClick={()=>setCurrentPage(p)} 
                        
                        key={p}>{p}</button>
                    )}
                    <button onClick={handleNext}>Next</button>
                <select  className='button' onChange={handleOnChange} defaultValue={itemPerPage} id="">
                        <option value="1"> 1</option>
                        <option value="2">2 </option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>


               
            </div>
        </div>
    );
};

export default Shop;