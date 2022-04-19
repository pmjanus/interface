import React, { useEffect } from 'react';
import { IStreamAndHistory } from 'types';
import { formatAddress } from 'utils/address';
import { useAccount } from 'wagmi';
import DisperseSend from './DisperseSend';
import PayeeBalance from './PayeeBalance';

interface SendToPayeesProps {
  data: IStreamAndHistory;
}

export default function SendToPayees({ data }: SendToPayeesProps) {
  const [tableContents, setTableContents] = React.useState<{ [key: string]: number }>({});
  const [toSend, setToSend] = React.useState<{ [key: string]: number }>({});
  const [amountState, setAmount] = React.useState<number>(0);
  const [{ data: accountData }] = useAccount();
  function getInitialData() {
    const accountAddress = accountData?.address.toLowerCase();
    const newTable: { [key: string]: number } = {};
    data.streams?.forEach((p) => {
      if (accountAddress === p.payerAddress.toLowerCase()) {
        newTable[p.payeeAddress.toLowerCase()] = 0;
      }
    });
    setTableContents(newTable);
  }

  useEffect(() => {
    getInitialData();
  }, []);

  function onSelectAll() {
    const newToSend = { ...tableContents };
    setToSend(newToSend);
  }

  function onUnselectAll() {
    setToSend({});
  }

  function onSelect(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const checked = e.target.checked;
    const address = e.target.name;
    const newToSend = { ...toSend };
    if (checked) {
      newToSend[address] = tableContents[address];
    } else {
      delete newToSend[address];
    }
    setToSend(newToSend);
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const address = e.target.name;
    const newtableContents = { ...tableContents };
    const value = Number(e.target.value);
    newtableContents[address] = value;
    setTableContents(newtableContents);
    if (toSend[address] !== undefined) {
      const newToSend = { ...toSend };
      newToSend[address] = value;
      setToSend(newToSend);
    }
  }

  function onSplitEqually() {
    const newtableContents = { ...tableContents };
    const newToSend = { ...toSend };
    const amountPerPayee = amountState / Object.keys(toSend).length;
    Object.keys(tableContents).map((p) => {
      if (toSend[p] !== undefined) {
        newToSend[p] = amountPerPayee;
        newtableContents[p] = amountPerPayee;
      } else {
        newtableContents[p] = 0;
      }
    });
    setTableContents(newtableContents);
    setToSend(newToSend);
  }

  return (
    <form>
      <div className="space-y-2">
        <div className="flex w-48 space-x-2">
          <button onClick={onSplitEqually} type="button" className=" w-full rounded-xl bg-[#ffffff]  px-1 py-1 text-sm">
            Split Equally
          </button>
          <label>
            <input
              type="number"
              autoComplete="off"
              onChange={(e) => {
                if (Number(e.target.value) < 0) setAmount(0);
                setAmount(Number(e.target.value));
              }}
              name="amount"
              className="w-24"
              placeholder="0.0"
              min="0"
            />
          </label>
        </div>
        <div className="flex w-48 space-x-2">
          <button onClick={onSelectAll} type="button" className=" w-full rounded-xl bg-[#ffffff] px-1 py-1 text-sm">
            Select All
          </button>
          <button onClick={onUnselectAll} type="button" className=" w-full rounded-xl bg-[#ffffff]  px-1 py-1 text-sm">
            Unselect All
          </button>
        </div>

        <table id="payeeTable">
          <thead>
            <tr>
              <th></th>
              <th className="text-md">Address</th>
              <th className="text-md">Payee Balance</th>
              <th className="text-md">Amount to Send</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(tableContents).map((p) => (
              <tr key={p}>
                <td className="w-16">
                  <label>
                    <input
                      type="checkbox"
                      name={p}
                      onChange={(e) => onSelect(e)}
                      checked={toSend[p] !== undefined ? true : false}
                    ></input>
                  </label>
                </td>
                <td className="text-md w-56 text-center">{formatAddress(p)}</td>
                <td className="text-md w-48 text-center">
                  <PayeeBalance id={p} />
                </td>
                <td className="text-md w-32 text-center">
                  <input
                    className="w-32"
                    autoComplete="off"
                    type="number"
                    min="0"
                    name={p}
                    value={tableContents[p] === 0 ? '' : tableContents[p]}
                    placeholder="0.0"
                    onChange={(e) => onInputChange(e)}
                  ></input>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <DisperseSend data={toSend} />
      </div>
    </form>
  );
}