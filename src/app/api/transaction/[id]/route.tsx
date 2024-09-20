// pages/api/items/[id].ts
import { connect } from '@/app/dbConfig/dbConfig';
import Transaction from '@/models/transactionModel';
import { NextApiRequest, NextApiResponse } from 'next';


connect()


export async function GET(req: Request, { params }: { params: { id: string } }) {

    if (req.method === 'GET') {
        try {
            // Find and delete the item by id
            const result = await Transaction.findById({ _id: params.id });

            if (result.length === 0) {
                return new Response(
                    'Item not found',
                    {
                        status: 404,
                    }
                );
            }

            return Response.json({
                message: 'Transaction fetched Successfully',
                transaction: result
            })
        } catch (error) {
            return new Response(
                'Error fetching transaction',
                {
                    status: 500,
                }
            );
        }
    } else {
        return new Response(
            'Method not allowed',
            {
                status: 404,
            }
        );
    }
}
