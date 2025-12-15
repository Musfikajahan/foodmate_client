import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GiPartyPopper } from 'react-icons/gi';

const PaymentSuccess = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-green-50 via-green-100 to-green-50 p-4 relative overflow-hidden">
            
            {/* Confetti Emoji Animation */}
            <motion.div 
                className="absolute top-0 left-1/2 text-4xl"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 100, opacity: 1 }}
                transition={{ repeat: Infinity, repeatType: 'loop', duration: 2, delay: 0.2 }}
            >
                🎉
            </motion.div>
            <motion.div 
                className="absolute top-0 left-1/3 text-4xl"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 120, opacity: 1 }}
                transition={{ repeat: Infinity, repeatType: 'loop', duration: 2.5, delay: 0.4 }}
            >
                🎊
            </motion.div>

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center z-10"
            >
                <GiPartyPopper className="text-6xl text-green-500 mb-4 animate-bounce" />
                <h2 className="text-5xl md:text-6xl font-extrabold text-green-600 mb-4 drop-shadow-lg">
                    Payment Successful!
                </h2>
                <p className="text-xl md:text-2xl text-gray-700 mb-8 text-center">
                    Thank you for your order. Your delicious meal is on the way!
                </p>

                <Link to="/dashboard/payment-history">
                    <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: '#16a34a' }}
                        whileTap={{ scale: 0.95 }}
                        className="btn px-10 py-4 text-lg font-bold text-white bg-green-500 rounded-xl shadow-lg transition-all duration-300"
                    >
                        View Payment History
                    </motion.button>
                </Link>
            </motion.div>
        </div>
    );
};

export default PaymentSuccess;
