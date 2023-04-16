'use client';

import { Dialog, Transition } from '@headlessui/react';

import { Loading, LoadingProps } from './loading';

interface LoadingBackdropProps {
  show?: boolean;
  className?: string;
  loadingProps?: LoadingProps;
}
const stub = () => null;

export const LoadingBackdrop = ({ show, loadingProps, className }: LoadingBackdropProps) => {
  return (
    <Dialog open={show} onClose={stub} className={className}>
      <Transition
        show={show}
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <div className="fixed inset-0 bg-slate-950 bg-opacity-80 z-50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <Loading {...loadingProps} />
        </div>
      </Transition>
    </Dialog>
  );
};
