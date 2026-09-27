"use client";

import { useState } from "react";
import Layout from "../components/NavbarWrapper";
import { CreditAnalysis } from "../components/credit-analysis";
import { DebitAnalysis } from "../components/debit-analysis";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "../styles/transitions.css";
import { BsArrowDownLeft, BsArrowUpRight } from "react-icons/bs";
import { FiTrendingUp, FiTrendingDown, FiPieChart } from "react-icons/fi";

enum TABS {
  CREDIT = "credit",
  DEBIT = "debit",
}

const Analysis = () => {
  const [selectedTab, setSelectedTab] = useState<TABS>(TABS.CREDIT);

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] bg-slate-50/60 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Card */}
          <div className="bg-white border border-slate-200/80 shadow-sm rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
                <FiPieChart className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                  Expense & Income Analytics
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Deep-dive into category spending patterns and revenue distribution
                </p>
              </div>
            </div>

            {/* Segmented Tab Switcher */}
            <div className="inline-flex p-1.5 bg-slate-100 rounded-2xl border border-slate-200/60 shadow-inner self-start md:self-auto">
              <button
                type="button"
                onClick={() => setSelectedTab(TABS.CREDIT)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  selectedTab === TABS.CREDIT
                    ? "bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-200/50"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span
                  className={`flex items-center justify-center w-5 h-5 rounded-full ${
                    selectedTab === TABS.CREDIT
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  <BsArrowDownLeft className="w-3 h-3" />
                </span>
                <span>Credit (Income)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTab(TABS.DEBIT)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  selectedTab === TABS.DEBIT
                    ? "bg-white text-rose-700 shadow-sm ring-1 ring-rose-200/50"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span
                  className={`flex items-center justify-center w-5 h-5 rounded-full ${
                    selectedTab === TABS.DEBIT
                      ? "bg-rose-100 text-rose-700"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  <BsArrowUpRight className="w-3 h-3" />
                </span>
                <span>Debit (Expense)</span>
              </button>
            </div>
          </div>

          {/* Analysis View Content */}
          <div className="bg-white border border-slate-200/80 shadow-sm rounded-2xl p-6">
            <TransitionGroup>
              <CSSTransition key={selectedTab} timeout={300} classNames="fade">
                <div>
                  {selectedTab === TABS.CREDIT ? <CreditAnalysis /> : <DebitAnalysis />}
                </div>
              </CSSTransition>
            </TransitionGroup>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analysis;
