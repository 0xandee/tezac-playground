'use client';

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import AppLayout from '@/components/layout/AppLayout';

const CancelListingSchema = Yup.object().shape({
    tokenId: Yup.string().required('Token ID is required'),
    listingId: Yup.string().required('Listing ID is required'),
});

const CancelListingPage = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (values: any, { resetForm }: any) => {
        setIsLoading(true);

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log('Cancelling NFT listing:', values);
            toast.success('Listing cancelled successfully!');

            // Reset form after successful cancellation
            resetForm();
        } catch (error) {
            console.error('Error cancelling listing:', error);
            toast.error('Failed to cancel listing. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AppLayout>
            <div className="cancel-listing-page">
                <h1>Cancel NFT Listing</h1>
                <p className="page-description">
                    Remove your NFT from the marketplace by cancelling an active listing.
                </p>

                <Formik
                    initialValues={{
                        tokenId: '',
                        listingId: '',
                    }}
                    validationSchema={CancelListingSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched }) => (
                        <Form className="cancel-form">
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
                                <p className="helper-text">The unique identifier of the NFT</p>
                            </div>

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
                                <p className="helper-text">The identifier of the listing you want to cancel</p>
                            </div>

                            <button
                                type="submit"
                                className={`submit-button ${isLoading ? 'loading' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Cancelling...' : 'Cancel Listing'}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </AppLayout>
    );
};

export default CancelListingPage; 