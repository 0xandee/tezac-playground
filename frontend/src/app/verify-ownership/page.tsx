'use client';

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import AppLayout from '@/components/layout/AppLayout';

const VerifySchema = Yup.object().shape({
    tokenId: Yup.string().required('Token ID is required'),
    walletAddress: Yup.string().required('Wallet address is required'),
});

const VerifyOwnershipPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [verificationResult, setVerificationResult] = useState<{
        verified: boolean;
        owner?: string;
        tokenData?: {
            name: string;
            description: string;
            imageUrl: string;
        };
    } | null>(null);

    const handleSubmit = async (values: any) => {
        setIsLoading(true);
        setVerificationResult(null);

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log('Verifying ownership:', values);

            // Mock verification result (in a real app, this would come from the API)
            const mockResult = {
                verified: Math.random() > 0.3, // 70% chance of success for demo purposes
                owner: values.walletAddress,
                tokenData: {
                    name: 'Tezac NFT #' + values.tokenId,
                    description: 'A sample Tezac NFT for demonstration purposes',
                    imageUrl: 'https://placehold.co/400x400',
                }
            };

            setVerificationResult(mockResult);

            if (mockResult.verified) {
                toast.success('Ownership verified successfully!');
            } else {
                toast.error('Ownership verification failed. This address does not own the specified NFT.');
            }
        } catch (error) {
            console.error('Error verifying ownership:', error);
            toast.error('Failed to verify ownership. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AppLayout>
            <div className="verify-ownership-page">
                <h1>Verify NFT Ownership</h1>
                <p className="page-description">
                    Verify the ownership of an NFT without revealing the owner's address and token ID.
                </p>

                <Formik
                    initialValues={{
                        tokenId: '',
                        walletAddress: '',
                    }}
                    validationSchema={VerifySchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched }) => (
                        <Form className="verify-form">
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
                                <label htmlFor="walletAddress">Wallet Address *</label>
                                <Field
                                    type="text"
                                    id="walletAddress"
                                    name="walletAddress"
                                    placeholder="Enter the wallet address to verify"
                                    className={`form-input ${errors.walletAddress && touched.walletAddress ? 'error' : ''}`}
                                />
                                <ErrorMessage name="walletAddress" component="div" className="error-message" />
                                <p className="helper-text">The wallet address you want to verify ownership for</p>
                            </div>

                            <button
                                type="submit"
                                className={`submit-button ${isLoading ? 'loading' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Verifying...' : 'Verify Ownership'}
                            </button>
                        </Form>
                    )}
                </Formik>

                {verificationResult && (
                    <div className={`verification-result ${verificationResult.verified ? 'success' : 'error'}`}
                        style={{
                            marginTop: '2rem',
                            padding: '1.5rem',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: verificationResult.verified ? 'rgba(39, 174, 96, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                            border: `1px solid ${verificationResult.verified ? 'var(--success-color)' : 'var(--error-color)'}`,
                        }}>
                        <h3 style={{ color: verificationResult.verified ? 'var(--success-color)' : 'var(--error-color)', marginBottom: '1rem' }}>
                            {verificationResult.verified ? 'Ownership Verified ✓' : 'Ownership Not Verified ✗'}
                        </h3>

                        {verificationResult.verified && verificationResult.tokenData && (
                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                                <div style={{ flexShrink: 0, width: '120px', height: '120px', overflow: 'hidden', borderRadius: 'var(--radius-md)' }}>
                                    <img
                                        src={verificationResult.tokenData.imageUrl}
                                        alt={verificationResult.tokenData.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                                <div>
                                    <p><strong>Token:</strong> {verificationResult.tokenData.name}</p>
                                    <p><strong>Owner:</strong> {verificationResult.owner}</p>
                                    <p><strong>Description:</strong> {verificationResult.tokenData.description}</p>
                                </div>
                            </div>
                        )}

                        {!verificationResult.verified && (
                            <p>The provided wallet address does not own this NFT.</p>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default VerifyOwnershipPage; 