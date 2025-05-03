'use client';

import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import AppLayout from '@/components/layout/AppLayout';
import { useWallet } from '@/hooks/useWallet';
import { useNFT } from '@/hooks/useNFT';
import { NFTContract } from '@aztec/noir-contracts.js/NFT';
import { createPXEClient } from '@aztec/aztec.js';
import { getInitialTestAccountsWallets } from '@aztec/accounts/testing';

const MintSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    recipientAddress: Yup.string().when('isPrivate', {
        is: true,
        then: (schema) => schema.required('Recipient address is required for private minting')
    }),
});

// Get NFT contract address from environment
const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
console.log("NFT_CONTRACT_ADDRESS", NFT_CONTRACT_ADDRESS);

const MintPage = () => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [mintType, setMintType] = useState<'public' | 'private'>('public');
    const [isLoading, setIsLoading] = useState(false);
    const { isConnected } = useWallet();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
        const file = e.target.files?.[0];
        if (file) {
            setFieldValue('image', file);
            const fileReader = new FileReader();
            fileReader.onload = () => {
                if (typeof fileReader.result === 'string') {
                    setPreviewUrl(fileReader.result);
                }
            };
            fileReader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (values: any, { resetForm }: any) => {
        if (!isConnected) {
            toast.error('Please connect your wallet first');
            return;
        }

        setIsLoading(true);
        try {
            // Prepare the data for API call
            const mintData = {
                name: values.name,
                description: values.description,
                image: previewUrl, // Send the data URL
                recipientAddress: values.recipientAddress,
                isPrivate: mintType === 'private'
            };

            // Call the API endpoint
            const response = await fetch('/api/mint-nft', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mintData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to mint NFT');
            }

            // Show success toast
            toast.success(`NFT successfully minted! Token ID: ${result.tokenId}`);

            // Reset form after successful mint
            resetForm();
            setPreviewUrl(null);
        } catch (error: any) {
            console.error('Error minting NFT:', error);
            toast.error(error.message || 'Failed to mint NFT. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AppLayout>
            <div className="mint-page">
                <h1>Mint NFT</h1>
                <div className="page-description">
                    <p>Create an NFT with customizable metadata.</p>
                    <br />
                    <p><strong>Public mint:</strong> The NFT will be publicly minted and transferred to the specified address. Transaction details will be visible to everyone including the sender, recipient and token ID.</p>
                    <p><strong>Private mint:</strong> The NFT will be privately minted and transferred to the specified address. Transaction details will be hidden.</p>
                </div>

                <div className="tab-container">
                    <button
                        className={`tab-button ${mintType === 'public' ? 'active' : ''}`}
                        onClick={() => setMintType('public')}
                    >
                        Public Mint
                    </button>
                    <button
                        className={`tab-button ${mintType === 'private' ? 'active' : ''}`}
                        onClick={() => setMintType('private')}
                    >
                        Private Mint
                    </button>
                </div>

                <Formik
                    initialValues={{
                        name: '',
                        description: '',
                        image: null,
                        isPrivate: mintType === 'private',
                        recipientAddress: '',
                    }}
                    validationSchema={MintSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {({ setFieldValue, values, errors, touched }) => (
                        <Form className="mint-form">
                            <div className="form-group">
                                <label htmlFor="name">NFT Name *</label>
                                <Field
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Enter NFT name"
                                    className={`form-input ${errors.name && touched.name ? 'error' : ''}`}
                                />
                                <ErrorMessage name="name" component="div" className="error-message" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Description *</label>
                                <Field
                                    as="textarea"
                                    id="description"
                                    name="description"
                                    placeholder="Enter NFT description"
                                    className={`form-textarea ${errors.description && touched.description ? 'error' : ''}`}
                                    rows={4}
                                />
                                <ErrorMessage name="description" component="div" className="error-message" />
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
                                {mintType === 'private' && (
                                    <p className="helper-text">This address will receive the privately minted NFT</p>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="image">Upload Image *</label>
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e, setFieldValue)}
                                    className="form-file-input"
                                />
                                {previewUrl && (
                                    <div className="image-preview">
                                        <img src={previewUrl} alt="Preview" />
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                className={`submit-button ${isLoading ? 'loading' : ''}`}
                                disabled={isLoading || !isConnected}
                            >
                                {isLoading ? 'Minting...' : `Mint ${mintType === 'private' ? 'Private' : 'Public'} NFT`}
                            </button>

                            {!isConnected && (
                                <p className="wallet-warning">Please connect your wallet to mint NFTs</p>
                            )}
                        </Form>
                    )}
                </Formik>
            </div>
        </AppLayout>
    );
};

export default MintPage; 