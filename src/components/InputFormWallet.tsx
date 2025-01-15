import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import React, { FC, useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { Transaction } from "@solana/web3.js";

export const InputFormWallet: FC = () => {
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();
    const [transactionLink, setTransactionLink] = useState<string>("");
    const [donationInfo, setDonationInfo] = useState<any>(null);

    useEffect(() => {
        if(connection && publicKey) handleGet();
    }, [publicKey, connection]);

    const handleGet = async () => {
        const response = await fetch('/api/actions/donate');
        const data = await response.json();
        setDonationInfo(data);
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setTransactionLink("");

        if (!connection || !publicKey) {
            console.error("Connection or publickey is not available.");
            return;
        }

        try {

            const response = await fetch('/api/actions/donate', {
                method: "POST",
                body: JSON.stringify({
                    account: publicKey,
                    latestBlockhash: (await connection.getLatestBlockhash()).blockhash,
                    type: "transaction"
                })
            });

            const transactionJson  = await response.json();
            const transactionObject = Transaction.from(Buffer.from(transactionJson.transaction, "base64"));
            const signature = await sendTransaction(transactionObject, connection);
            const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
            setTransactionLink(explorerUrl);
        } catch (error) {
            console.error("Transaction failed:", error)
        }
    }

    return (
        <div className={styles.AppBody}>
            {
                (publicKey && connection) ? (<form onSubmit={handleSubmit} className={styles.form}>
                    <button 
                    type="submit" className={`${styles.input} ${styles.formField}`}>{donationInfo?.label}</button>
                </form>) : ""
            }

            <br />
            {publicKey && connection && transactionLink && (
                <a 
                    href={transactionLink} 
                    target="_blank"
                    className={styles.transactionLink}
                >
                    Check Transaction Status
                </a>
            )}
                
        </div>
    )
}