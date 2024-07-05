
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

    const [chartData, setChartData] = useState<ChartData>({
        datasets: [],
        labels: []
    });

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get('/api/transaction/tag/all'); // Adjust the endpoint as necessary

                const fetchedData = response.data.data;

                setTags(fetchedData);

            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, []);

    useEffect(() => {
        if (tags.length > 0) {

            const allTags = tags.map((tag: any) => tag.tag.tag);

            const data = tags.map((tag: any) => calculateTotalDebit(tag.transactions))

            const colorData = tags.map((tag: any) => tag.tag.color);

            setChartData({
                labels: allTags,
                datasets: [
                    {
                        label:'Debit',
                        barThickness:20,
                        data: data,
                        fill: true,
                        borderColor: "rgb(0, 0, 0)",
                        backgroundColor: colorData
                    }
                ]
            })
        }
    }, [tags])

    const memoizedData = useMemo(() => tags, [tags]);

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md">
                <thead>
                    <tr>
                        <th className="py-2">Tag</th>
                        <th className="py-2">Total Debit</th>
                    </tr>
                </thead>

                {
                    memoizedData.map((tag) => {
                        const debit = calculateTotalDebit(tag.transactions)
                        return (
                            <tr>
                                <td className="py-2 border-t text-center">{tag.tag.tag}</td>
                                <td className="py-2 border-t text-center">{debit}</td>
                            </tr>
                        )
                    })
                }
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