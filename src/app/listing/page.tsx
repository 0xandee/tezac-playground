'use client';

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import AppLayout from '@/components/layout/AppLayout';

const ListingSchema = Yup.object().shape({
    tokenId: Yup.string().required('Token ID is required'),
    price: Yup.number()
        .required('Price is required')
        .positive('Price must be positive')
        .typeError('Price must be a number'),
    duration: Yup.number()
        .required('Duration is required')
        .positive('Duration must be positive')
        .integer('Duration must be a whole number')
        .typeError('Duration must be a number'),
});

const ListingPage = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (values: any, { resetForm }: any) => {
        setIsLoading(true);

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log('Creating NFT listing:', values);
            toast.success('NFT listed successfully!');

            // Reset form after successful listing
            resetForm();
        } catch (error) {
            console.error('Error creating listing:', error);
            toast.error('Failed to create listing. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AppLayout>
            <div className="listing-page">
                <h1>List NFT for Sale</h1>
                <p className="page-description">
                    <p>Create a listing to sell your NFT on the marketplace.</p>
                    <br />
                    <p><strong>Public listing:</strong> Everyone can see your listing details.</p>
                    <p><strong>Private listing:</strong> Same as public listing but the seller address is hidden.</p>
                </p>

                <Formik
                    initialValues={{
                        tokenId: '',
                        price: '',
                        duration: '7',
                    }}
                    validationSchema={ListingSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched }) => (
                        <Form className="listing-form">
                            <div className="form-group">
                                <label htmlFor="tokenId">Token ID *</label>
                                <Field
                                    type="text"
                                    id="tokenId"
                                    name="tokenId"
                                    placeholder="Enter the NFT Token ID"
                                    className={`form-input ${errors.tokenId && touched.tokenId ? 'error' : ''}`}
                                />
                                <ErrorMessage name="tokenId" component="div" className="error-message" />
                                <p className="helper-text">The unique identifier of the NFT you want to list</p>
                            </div>

                            <div className="form-group">
                                <label htmlFor="price">Price (ETH) *</label>
                                <Field
                                    type="text"
                                    id="price"
                                    name="price"
                                    placeholder="Enter listing price in ETH"
                                    className={`form-input ${errors.price && touched.price ? 'error' : ''}`}
                                />
                                <ErrorMessage name="price" component="div" className="error-message" />
                                <p className="helper-text">The price at which you want to sell your NFT</p>
                            </div>

                            <div className="form-group">
                                <label htmlFor="duration">Duration (days) *</label>
                                <Field
                                    type="text"
                                    id="duration"
                                    name="duration"
                                    placeholder="Enter listing duration in days"
                                    className={`form-input ${errors.duration && touched.duration ? 'error' : ''}`}
                                />
                                <ErrorMessage name="duration" component="div" className="error-message" />
                                <p className="helper-text">How long your listing will be active for</p>
                            </div>

                            <button
                                type="submit"
                                className={`submit-button ${isLoading ? 'loading' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating Listing...' : 'List NFT for Sale'}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </AppLayout>
    );
};

export default ListingPage; 