import { ImSpinner2 } from 'react-icons/im';

import { cn } from '@/lib/utils';

export default function LoadingComponent({ msg }: { msg: string }) {
  return (
    <div
      className={cn(
        'absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-lg text-gray-400'
      )}
    >
      <ImSpinner2 className='animate-spin text-4xl' />
      <span>{msg}</span>
    </div>
  );
}
