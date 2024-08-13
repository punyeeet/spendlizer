
import { calculateTotalDebit } from '@/app/util/Analysis.util';
import { Tag, Transaction } from '@/archetypes/Transaction';
import axios from 'axios';
import React, { memo, useEffect, useMemo, useState } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, Title, Tooltip, Legend, ChartData, BarElement } from "chart.js"
import { Bar } from "react-chartjs-2"


interface TagTransaction {
    tag: Tag,
    transactions: Transaction[];
}

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
)

const DebitAnalysisComponent = () => {

    const [tags, setTags] = useState<TagTransaction[]>([]);
    const [filteredTags, setFilteredTags] = useState<TagTransaction[]>([]);
    const [chartData, setChartData] = useState<ChartData>({
        datasets: [],
        labels: []
    });
    const [filter, setFilter] = useState('all');


    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get('/api/transaction/tag/all'); // Adjust the endpoint as necessary
                const fetchedData = response.data.data;
                setTags(fetchedData);
                setFilteredTags(fetchedData);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, []);



    useEffect(() => {
        console.log("Called useEffect !!");
        if (filteredTags.length > 0) {
            const allTags = filteredTags.map(tag => tag.tag.tag);
            const data = filteredTags.map(tag => calculateTotalDebit(tag.transactions));
            const colorData = filteredTags.map(tag => tag.tag.color);

            setChartData({
                labels: allTags,
                datasets: [
                    {
                        label: "Debit",
                        barThickness: 20,
                        data: data,
                        fill: true,
                        borderColor: "rgb(255, 99, 132)",
                        backgroundColor: colorData
                    }
                ]
            });
        }
    }, [filteredTags]);

    const filterTransactions = () => {
        const now = new Date();
        let filtered = tags;

        switch (filter) {
            case 'day':
                filtered = tags.map(tag => ({
                    ...tag,
                    transactions: tag.transactions.filter(transaction => {
                        const transactionDate = new Date(transaction.date);
                        return transactionDate.toDateString() === now.toDateString();
                    })
                }));
                break;
            case 'week':
                const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
                filtered = tags.map(tag => ({
                    ...tag,
                    transactions: tag.transactions.filter(transaction => {
                        const transactionDate = new Date(transaction.date);
                        return transactionDate >= startOfWeek;
                    })
                }));
                break;
            case 'month':
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                filtered = tags.map(tag => ({
                    ...tag,
                    transactions: tag.transactions.filter(transaction => {
                        const transactionDate = new Date(transaction.date);
                        return transactionDate >= startOfMonth;
                    })
                }));
                break;
            case 'year':
                const startOfYear = new Date(now.getFullYear(), 0, 1);
                filtered = tags.map(tag => ({
                    ...tag,
                    transactions: tag.transactions.filter(transaction => {
                        const transactionDate = new Date(transaction.date);
                        return transactionDate >= startOfYear;
                    })
                }));
                break;
            case 'all':
            default:
                filtered = tags;
                break;
        }

        setFilteredTags(filtered);
    };

    useEffect(() => {
        filterTransactions();
    }, [filter, tags, filterTransactions]);


    return (
        <div className="overflow-x-auto">
            <div className="mb-4">
                <label className="mr-4">
                    <input
                        type="radio"
                        value="all"
                        checked={filter === 'all'}
                        onChange={() => setFilter('all')}
                    />
                    All
                </label>
                <label className="mr-4">
                    <input
                        type="radio"
                        value="day"
                        checked={filter === 'day'}
                        onChange={() => setFilter('day')}
                    />
                    Day
                </label>
                <label className="mr-4">
                    <input
                        type="radio"
                        value="week"
                        checked={filter === 'week'}
                        onChange={() => setFilter('week')}
                    />
                    Week
                </label>
                <label className="mr-4">
                    <input
                        type="radio"
                        value="month"
                        checked={filter === 'month'}
                        onChange={() => setFilter('month')}
                    />
                    Month
                </label>
                <label className="mr-4">
                    <input
                        type="radio"
                        value="year"
                        checked={filter === 'year'}
                        onChange={() => setFilter('year')}
                    />
                    Year
                </label>
            </div>

            <table className="min-w-full bg-white shadow-md">
                <thead>
                    <tr>
                        <th className="py-2">Tag</th>
                        <th className="py-2">Total Debit</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        filteredTags.map((tag) => {
                            const debit = calculateTotalDebit(tag.transactions)
                            return (
                                <tr>
                                    <td className="py-2 border-t text-center">{tag.tag.tag}</td>
                                    <td className="py-2 border-t text-center">{debit}</td>
                                </tr>
                            )
                        })
                    }

                </tbody>
            </table>

            <div className='w-full mt-4 '>
                <Bar
                    //@ts-ignore
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: { position: "top" },
                            title: { display: true, text: "Debit Analysis" }
                        },
                        indexAxis: 'y'
                    }}
                />
            </div>
        </div>
    )
}

export const DebitAnalysis = memo(DebitAnalysisComponent);