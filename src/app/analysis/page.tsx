"use client"

import { useState } from "react";
import Layout from "../components/NavbarWrapper";
import { CreditAnalysis } from "../components/credit-analysis";
import { DebitAnalysis } from "../components/debit-analysis";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import '../styles/transitions.css';


enum TABS {
    CREDIT = "credit",
    DEBIT = "debit"
}



const Analysis = () => {

    const [selectedTab, setSelectedTab] = useState<TABS>(TABS.CREDIT);

    const renderContent = () => {
        switch (selectedTab) {
            case TABS.CREDIT:
                return <CreditAnalysis />;
            case TABS.DEBIT:
                return <DebitAnalysis />;
            default:
                return <p>View not found.</p>;
        }
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-r from-pink-600 via-blue-600 to-red-200 flex items-center justify-center">
                <div className="bg-white w-full max-w-4xl p-8 rounded-lg shadow-lg m-4">
                    <h1 className="text-2xl font-bold mb-4"> Analysis </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Tabs */}
                        <div className="bg-gray-100 p-4 rounded-lg shadow hover:cursor-pointer" style={{ border: selectedTab == TABS.CREDIT ? '4px solid black' : 'none' }} onClick={() => setSelectedTab(TABS.CREDIT)}>
                            <h2 className="text-xl font-semibold">Credit</h2>
                        </div>

                        <div className="bg-gray-100 p-4 rounded-lg shadow hover:cursor-pointer" style={{ border: selectedTab == TABS.DEBIT ? '4px solid black' : 'none' }} onClick={() => setSelectedTab(TABS.DEBIT)}>
                            <h2 className="text-xl font-semibold" >Debit</h2>
                        </div>

                        {/* Analysis Body */}
                        <div className="bg-gray-100 p-4 rounded-sm shadow w-full col-span-2 min-h-28">
                            <TransitionGroup>
                                <CSSTransition
                                    key={selectedTab}
                                    timeout={300}
                                    classNames="fade"
                                >
                                    <div>
                                        {renderContent()}
                                    </div>
                                </CSSTransition>
                            </TransitionGroup>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Analysis;