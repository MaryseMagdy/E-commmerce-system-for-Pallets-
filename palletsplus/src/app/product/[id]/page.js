import React from 'react';
import Head from 'next/head';
import ProductDetail from './ProductDetail';
import styles from './page.module.css';

export const generateMetadata = async ({ params }) => {
    const title = await new Promise((resolve) => {
        setTimeout(() => {
            resolve(``);
        }, 100);
    });
    return {
        title: `Product Details ${title}`,
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
        </>
    );
};

export default ProductPage;
