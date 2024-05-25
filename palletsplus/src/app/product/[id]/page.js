import React from 'react';
import Head from 'next/head';
import ProductDetail from './ProductDetail';
import styles from './page.module.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const generateMetadata = async ({ params }) => {
    const title = await new Promise((resolve) => {
        setTimeout(() => {
            resolve(`Product Details for ${params.id}`);
        }, 100);
    });
    return {
        title: title,
    };
};

const ProductPage = ({ params }) => {
    const { id } = params;

    console.log("Product ID from params:", id); // Log the product ID for debugging

    return (
        <>
            <Head>
                <title>Product Details</title>
            </Head>
            <ProductDetail productId={id} />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                style={{ zIndex: 9999 }} // Ensure the ToastContainer is on top
            />
        </>
    );
};

export default ProductPage;
