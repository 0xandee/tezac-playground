'use client';

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import AppLayout from '@/components/layout/AppLayout';

const TransferSchema = Yup.object().shape({
    tokenId: Yup.string().required('Token ID is required'),
    recipientAddress: Yup.string().required('Recipient address is required'),
});

const TransferPage = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (values: any, { resetForm }: any) => {
        setIsLoading(true);

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log('Transferring NFT:', values);
            toast.success('NFT transferred successfully!');

            // Reset form after successful transfer
            resetForm();
        } catch (error) {
            console.error('Error transferring NFT:', error);
            toast.error('Failed to transfer NFT. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AppLayout>
            <div className="transfer-page">
                <h1>Transfer NFT</h1>
                <p className="page-description">
                    <p>Transfer ownership of your NFT to another address.</p>
                    <br />
                    <p><strong>Public transfer:</strong> Everyone can see your transfer details including the sender, recipient and token ID.</p>
                    <p><strong>Private transfer:</strong> No one can see your transfer details.</p>
                </p>

                <Formik
                    initialValues={{
                        tokenId: '',
                        recipientAddress: '',
                    }}
                    validationSchema={TransferSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched }) => (
                        <Form className="transfer-form">
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
                                <p className="helper-text">The unique identifier of the NFT you want to transfer</p>
                            </div>

                            <div className="form-group">
                                <label htmlFor="recipientAddress">Recipient Address *</label>
                                <Field
                                    type="text"
                                    id="recipientAddress"
                                    name="recipientAddress"
                                    placeholder="Enter recipient's wallet address"
                                    className={`form-input ${errors.recipientAddress && touched.recipientAddress ? 'error' : ''}`}
                                />
                                <ErrorMessage name="recipientAddress" component="div" className="error-message" />
                                <p className="helper-text">The wallet address that will receive the NFT</p>
                            </div>

                            <button
                                type="submit"
                                className={`submit-button ${isLoading ? 'loading' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Transferring...' : 'Transfer NFT'}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </AppLayout>
    );
};

export default TransferPage; 