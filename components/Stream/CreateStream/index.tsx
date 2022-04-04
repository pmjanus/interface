import * as React from 'react';
import Placeholder from './Placeholder';
import DepositAndCreate from './DepositAndCreate';
import CreateStreamOnly from './CreateStreamOnly';
import { ICreateProps } from './types';
import ErrorBoundary from './ErrorBoundary';

export const CreateStream = ({ tokens, noBalances, isLoading, isError }: ICreateProps) => {
  const tokenOptions = React.useMemo(() => tokens?.map((t) => t.name), [tokens]);

  return (
    <section className="z-2 flex w-full max-w-lg flex-col">
      <h1 className="mb-3 text-center text-xl">
        {noBalances && !isLoading ? 'Deposit and Create a New stream' : 'Create a new stream'}
      </h1>
      {isLoading ? (
        <Placeholder />
      ) : isError || !tokens || !tokenOptions ? (
        <ErrorBoundary message="Something went wrong" />
      ) : noBalances ? (
        <DepositAndCreate tokens={tokens} tokenOptions={tokenOptions} />
      ) : (
        <CreateStreamOnly tokens={tokens} tokenOptions={tokenOptions} />
      )}
    </section>
  );
};
