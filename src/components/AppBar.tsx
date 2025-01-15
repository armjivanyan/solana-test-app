import { FC } from "react";
import styles from '../styles/Home.module.css'
import dynamic from "next/dynamic";
const WalletMultiButton = dynamic(() => import('@solana/wallet-adapter-react-ui').then(mod => mod.WalletMultiButton), { ssr: false });


export const AppBar: FC = () => {
    return(
        <div className={styles.AppHeader}>
            <WalletMultiButton />
        </div>
    )
}