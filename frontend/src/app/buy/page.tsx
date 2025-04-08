'use client';

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import AppLayout from '@/components/layout/AppLayout';

const BuySchema = Yup.object().shape({
    listingId: Yup.string().required('Listing ID is required'),
    price: Yup.number()
        .required('Price is required')
        .positive('Price must be positive')
        .typeError('Price must be a number'),
});

const BuyPage = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (values: any, { resetForm }: any) => {
        setIsLoading(true);

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log('Purchasing NFT:', values);
            toast.success('NFT purchased successfully!');

            // Reset form after successful purchase
            resetForm();
        } catch (error) {
            console.error('Error purchasing NFT:', error);
            toast.error('Failed to purchase NFT. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AppLayout>
            <div className="buy-page">
                <h1>Buy NFT</h1>
                <p className="page-description">
                    <p>Purchase an NFT that is listed for sale on the marketplace.</p>
                    <br />
                    <p><strong>Public buy:</strong> Everyone can see your buy transaction details including the seller, price, and what NFT you bought.</p>
                    <p><strong>Private buy:</strong> No one can see your buy transaction details.</p>
                </p>
                <Formik
                    initialValues={{
                        listingId: '',
                        price: '',
                    }}
                    validationSchema={BuySchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched }) => (
                        <Form className="buy-form">
                            <div className="form-group">
                                <label htmlFor="listingId">Listing ID *</label>
                                <Field
                                    type="text"
                                    id="listingId"
                                    name="listingId"
                                    placeholder="Enter the listing ID"
                                    className={`form-input ${errors.listingId && touched.listingId ? 'error' : ''}`}
                                />
                                <ErrorMessage name="listingId" component="div" className="error-message" />
                                <p className="helper-text">The unique identifier of the listing you want to purchase</p>
                            </div>

                            <div className="form-group">
                                <label htmlFor="price">Price (ETH) *</label>
                                <Field
                                    type="text"
                                    id="price"
                                    name="price"
                                    placeholder="Enter the amount in ETH"
                                    className={`form-input ${errors.price && touched.price ? 'error' : ''}`}
                                />
                                <ErrorMessage name="price" component="div" className="error-message" />
                                <p className="helper-text">The price should match the listing price</p>
                            </div>

                            <button
                                type="submit"
                                className={`submit-button ${isLoading ? 'loading' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Processing Purchase...' : 'Buy NFT'}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </AppLayout>
    );
};

export default BuyPage; 