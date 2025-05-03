"use client";

import React, { useCallback, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import AppLayout from "@/components/layout/AppLayout";
import { useContract } from "@/hooks/useContract";
import { useWallet } from "@/hooks/useWallet";

const TransferSchema = Yup.object().shape({
	tokenId: Yup.string().required("Token ID is required"),
	recipientAddress: Yup.string().required("Recipient address is required"),
});

const TransferPage = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [transferResult, setTransferResult] = useState<string | null>(null);
	const { contract, deploy, wait } = useContract();
	const { address } = useWallet();

	const handleSubmit = useCallback(
		async (values: any, { resetForm }: any) => {
			setIsLoading(true);

			if (values.tokenId || values.recipientAddress) {
				alert("Please enter a token ID and recipient address");
				return;
			}

			if (!contract) {
				alert("Contract not deployed");
				return;
			}

			setIsLoading(true);
			setTransferResult(null);

			try {
				// Simulate API delay
				await new Promise((resolve) => setTimeout(resolve, 2000));
				console.log("Transferring NFT:", values);

				const transferInteraction = contract.methods.transfer_in_public(
					address,
					values.recipientAddress,
					values.tokenId,
					1234,
				);

				const tx = await transferInteraction.send().wait();

				setTransferResult(
					`NFT ${values.tokenId} transferred to ${values.recipientAddress} ETH (Tx: ${tx.txHash})`,
				);
				toast.success("NFT transferred successfully!");

				// Reset form after successful transfer
				resetForm();
			} catch (error) {
				console.error("Error transferring NFT:", error);
				toast.error("Failed to transfer NFT. Please try again.");
			} finally {
				setIsLoading(false);
			}
		},
		[address, contract],
	);

	return (
		<AppLayout>
			<div className="transfer-page">
				<h1>Transfer NFT</h1>
				<p className="page-description">
					<p>Transfer ownership of your NFT to another address.</p>
					<br />
					<p>
						<strong>Public transfer:</strong> Everyone can see your transfer
						details including the sender, recipient and token ID.
					</p>
					<p>
						<strong>Private transfer:</strong> No one can see your transfer
						details.
					</p>
				</p>

				<Formik
					initialValues={{
						tokenId: "",
						recipientAddress: "",
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
									className={`form-input ${errors.tokenId && touched.tokenId ? "error" : ""}`}
								/>
								<ErrorMessage
									name="tokenId"
									component="div"
									className="error-message"
								/>
								<p className="helper-text">
									The unique identifier of the NFT you want to transfer
								</p>
							</div>

							<div className="form-group">
								<label htmlFor="recipientAddress">Recipient Address *</label>
								<Field
									type="text"
									id="recipientAddress"
									name="recipientAddress"
									placeholder="Enter recipient's wallet address"
									className={`form-input ${errors.recipientAddress && touched.recipientAddress ? "error" : ""}`}
								/>
								<ErrorMessage
									name="recipientAddress"
									component="div"
									className="error-message"
								/>
								<p className="helper-text">
									The wallet address that will receive the NFT
								</p>
							</div>

							<button
								type="submit"
								className={`submit-button ${isLoading ? "loading" : ""}`}
								disabled={isLoading}
							>
								{isLoading ? "Transferring..." : "Transfer NFT"}
							</button>
						</Form>
					)}
				</Formik>
				{transferResult && (
					<div className="alert alert-success">
						<h3
							style={{
								margin: "0 0 15px 0",
								color: "var(--accent-primary)",
							}}
						>
							Transfer Result
						</h3>
						<p style={{ margin: "0", color: "var(--text-active)" }}>
							{transferResult}
						</p>
					</div>
				)}
			</div>
		</AppLayout>
	);
};

export default TransferPage;
