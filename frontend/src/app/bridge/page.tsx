'use client';

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import AppLayout from '@/components/layout/AppLayout';

const BridgeSchema = Yup.object().shape({
    tokenId: Yup.string().required('Token ID is required'),
    sourceChain: Yup.string().required('Source chain is required'),
    destinationChain: Yup.string().required('Destination chain is required'),
    recipientAddress: Yup.string().required('Recipient address is required'),
});

const BridgePage = () => {
    const [isLoading, setIsLoading] = useState(false);

    const chains = [
        { value: 'ethereum', label: 'Ethereum' },
        { value: 'polygon', label: 'Polygon' },
        { value: 'optimism', label: 'Optimism' },
        { value: 'arbitrum', label: 'Arbitrum' },
        { value: 'base', label: 'Base' },
    ];

    const handleSubmit = async (values: any, { resetForm }: any) => {
        setIsLoading(true);

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log('Bridging NFT:', values);
            toast.success('NFT bridge transaction initiated! Check status in your wallet.');

            // Reset form after successful bridge initiation
            resetForm();
        } catch (error) {
            console.error('Error bridging NFT:', error);
            toast.error('Failed to bridge NFT. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AppLayout>
            <div className="bridge-page">
                <h1>Bridge NFT (WIP)</h1>
                <p className="page-description">
                    Trade your NFT on different blockchain networks.
                </p>

                <div className="notice" style={{
                    backgroundColor: 'rgba(243, 156, 18, 0.1)',
                    border: '1px solid var(--warning-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    marginBottom: '2rem'
                }}>
                    <p style={{ color: 'var(--warning-color)' }}>
                        <strong>Note:</strong> This feature is currently under development. Some functionality may be limited.
                    </p>
                </div>

                {/* <Formik
                    initialValues={{
                        tokenId: '',
                        sourceChain: 'ethereum',
                        destinationChain: '',
                        recipientAddress: '',
                    }}
                    validationSchema={BridgeSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, values }) => (
                        <Form className="bridge-form">
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
                                <p className="helper-text">The unique identifier of the NFT you want to bridge</p>
                            </div>

                            <div className="form-group">
                                <label htmlFor="sourceChain">Source Chain *</label>
                                <Field
                                    as="select"
                                    id="sourceChain"
                                    name="sourceChain"
                                    className={`form-select ${errors.sourceChain && touched.sourceChain ? 'error' : ''}`}
                                >
                                    <option value="">Select Source Chain</option>
                                    {chains.map(chain => (
                                        <option key={`source-${chain.value}`} value={chain.value}>
                                            {chain.label}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage name="sourceChain" component="div" className="error-message" />
                                <p className="helper-text">The blockchain where your NFT currently exists</p>
                            </div>

                            <div className="form-group">
                                <label htmlFor="destinationChain">Destination Chain *</label>
                                <Field
                                    as="select"
                                    id="destinationChain"
                                    name="destinationChain"
                                    className={`form-select ${errors.destinationChain && touched.destinationChain ? 'error' : ''}`}
                                >
                                    <option value="">Select Destination Chain</option>
                                    {chains
                                        .filter(chain => chain.value !== values.sourceChain)
                                        .map(chain => (
                                            <option key={`dest-${chain.value}`} value={chain.value}>
                                                {chain.label}
                                            </option>
                                        ))}
                                </Field>
                                <ErrorMessage name="destinationChain" component="div" className="error-message" />
                                <p className="helper-text">The blockchain where you want to bridge your NFT to</p>
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
                                <p className="helper-text">The wallet address that will receive the NFT on the destination chain</p>
                            </div>

                            <div className="form-group" style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                                <h4 style={{ marginBottom: '0.5rem' }}>Bridge Fee Estimate</h4>
                                <p className="helper-text">Estimated fee: 0.005 ETH</p>
                                <p className="helper-text">Gas cost may vary based on network conditions</p>
                            </div>

                            <button
                                type="submit"
                                className={`submit-button ${isLoading ? 'loading' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Processing Bridge...' : 'Bridge NFT'}
                            </button>
                        </Form>
                    )}
                </Formik> */}
            </div>
        </AppLayout>
    );
};

export default BridgePage; 