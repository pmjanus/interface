import * as React from 'react';
import { createTable, useTable, globalFilterRowsFn } from '@tanstack/react-table';
import Table from 'components/Table';
import useStreamsAndHistory from 'queries/useStreamsAndHistory';
import { IStream } from 'types';
import TotalStreamed from './TotalStreamed';
import Withdrawable from './Withdrawable';
import SavedName from './SavedName';
import StreamActions from './StreamActions';
import Link from 'next/link';
import AmtPerMonth from './AmtPerMonth';
import Fallback from 'components/FallbackList';
import TokenName from './TokenName';
import StreamAddress from './StreamAddress';
import { StreamIcon } from 'components/Icons';

const table = createTable<{ Row: IStream }>();

const defaultColumns = table.createColumns([
  table.createDisplayColumn({
    id: 'userName',
    header: 'Name',
    cell: ({ cell }) => (cell.row.original ? <SavedName data={cell.row.original} /> : <></>),
  }),
  table.createDisplayColumn({
    id: 'address',
    header: 'Address',
    cell: ({ cell }) => (cell.row.original ? <StreamAddress data={cell.row.original} /> : <></>),
  }),
  table.createDataColumn('tokenSymbol', {
    header: 'Token',
    cell: ({ cell }) => (cell.row.original ? <TokenName data={cell.row.original} /> : <></>),
  }),
  table.createDisplayColumn({
    id: 'amountPerSec',
    header: () => (
      <>
        <span>Amount</span>
        <small className="mx-1 text-xs font-normal text-gray-500 dark:text-gray-400">per month</small>
      </>
    ),
    cell: ({ cell }) => (cell.row.original ? <AmtPerMonth data={cell.row.original} /> : <></>),
  }),
  table.createDisplayColumn({
    id: 'totalStreamed',
    header: 'Total Streamed',
    cell: ({ cell }) => (cell.row.original ? <TotalStreamed data={cell.row.original} /> : <></>),
  }),
  table.createDisplayColumn({
    id: 'userWithdrawable',
    header: 'Withdrawable',
    cell: ({ cell }) => (cell.row.original ? <Withdrawable data={cell.row.original} /> : <></>),
  }),
  table.createDisplayColumn({
    id: 'streamActions',
    header: '',
    cell: ({ cell }) => {
      if (!cell.row.original) return null;

      return <StreamActions data={cell.row.original} />;
    },
  }),
]);

export function StreamTable() {
  const { data, isLoading, error } = useStreamsAndHistory();

  const noData = !data?.streams || data.streams?.length < 1;

  return (
    <section className="w-full">
      <div className="section-header flex w-full items-center justify-between">
        <span className="flex items-center space-x-2">
          <StreamIcon />
          <h1>Streams</h1>
        </span>

        <Link href="/create" passHref>
          <button className="whitespace-nowrap rounded-[10px] border border-[#1BDBAD] bg-[#23BD8F] py-2 px-12 text-sm font-bold text-white shadow-[0px_3px_7px_rgba(0,0,0,0.12)]">
            Create Stream
          </button>
        </Link>
      </div>
      {isLoading || error || noData ? (
        <Fallback isLoading={isLoading} isError={error ? true : false} noData={noData} type="streams" />
      ) : (
        <NewTable data={data.streams || []} />
      )}
    </section>
  );
}

function NewTable({ data }: { data: IStream[] }) {
  const [columns] = React.useState<typeof defaultColumns>(() => [...defaultColumns]);

  const [globalFilter, setGlobalFilter] = React.useState('');

  const instance = useTable(table, {
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterRowsFn: globalFilterRowsFn,
  });

  return (
    <>
      {/* <label className="space-x-4">
          <span>Search</span>
          <input
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="h-8 rounded border border-neutral-300 p-2 shadow-sm dark:border-neutral-700"
          />
        </label> */}
      <Table instance={instance} hidePagination={true} />
    </>
  );
}
