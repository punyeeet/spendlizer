// pages/api/items/[id].ts
import { connect } from '@/app/dbConfig/dbConfig';
import Transaction from '@/models/transactionModel';
import { NextApiRequest, NextApiResponse } from 'next';


connect()


export async function DELETE(req: Request, { params }: { params: { id: string } }) {

    if (req.method === 'DELETE') {
        try {
            // Find and delete the item by id
            const result = await Transaction.deleteOne({ _id: params.id });

            if (result.deletedCount === 0) {
                return new Response(
                    'Item not found',
                    {
                        status: 404,
                    }
                );
            }

            return Response.json({
                message: 'Deleted Successfully'
            })
        } catch (error) {
            return new Response(
                'Error deleting item',
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
