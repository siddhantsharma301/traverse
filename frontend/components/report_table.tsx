import { useMemo } from 'react';
import { useTable } from 'react-table';

export default function Table({ columns, data }) {
    useTable({
        columns,
        data
    });
}